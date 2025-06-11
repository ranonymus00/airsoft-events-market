import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { AuthState } from "../types";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: {
    username?: string;
    email?: string;
    avatar?: string;
  }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  // Memoize fetchUser to prevent recreating on every render
  const fetchUser = useCallback(async (userId: string) => {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select(
          `
          *,
          team:team_members!user_id(
            team:teams(
              id,
              name,
              description,
              logo,
              play_style,
              created_at
            )
          )
        `
        )
        .eq("id", userId)
        .single();

      if (error) throw error;

      setAuthState({
        user: {
          ...user,
          team: user.team?.team || null,
        },
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  }, []);

  // Initialize auth state and set up listener
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setAuthState({
              user: null,
              isAuthenticated: false,
              loading: false,
            });
          }
          return;
        }

        if (session?.user && mounted) {
          await fetchUser(session.user.id);
        } else if (mounted) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log("Auth state changed:", event, session?.user?.id);

        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUser(session.user.id);
        } else if (event === 'SIGNED_OUT' || !session) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Don't refetch user data on token refresh, just update loading state
          setAuthState(prev => ({
            ...prev,
            loading: false,
          }));
        }
      }
    );

    // Initialize auth
    initializeAuth();

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUser]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }, []);

  const register = useCallback(async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const {
        data: { user },
        error: signUpError,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (signUpError) {
        throw signUpError;
      }
      if (!user) throw new Error("No user returned after signup");

      // Wait for session to be established
      let sessionTries = 0;
      let session = null;
      while (!session && sessionTries < 10) {
        const { data } = await supabase.auth.getSession();
        session = data.session;
        if (!session) await new Promise(res => setTimeout(res, 200));
        sessionTries++;
      }

      // Create user profile
      const { error: profileError } = await supabase.from("users").insert({
        id: user.id,
        username,
        email,
        avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${username}`,
      });

      if (profileError) {
        throw profileError;
      }

      // The auth listener will handle fetching the user data
      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      // The auth listener will handle clearing the state
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  const updateProfile = useCallback(async (data: {
    username?: string;
    email?: string;
    avatar?: string;
  }): Promise<boolean> => {
    try {
      if (!authState.user?.id) {
        throw new Error("No user logged in");
      }

      const { error } = await supabase
        .from("users")
        .update(data)
        .eq("id", authState.user.id);

      if (error) throw error;

      // Update local state immediately for better UX
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data } : null,
      }));

      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      return false;
    }
  }, [authState.user?.id]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    authState,
    login,
    register,
    logout,
    updateProfile,
  }), [authState, login, register, logout, updateProfile]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};