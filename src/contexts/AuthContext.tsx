import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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

  useEffect(() => {
    // Check current auth session only if not already loading and user is null
    if (authState.loading && !authState.user) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          fetchUser(session.user.id);
        } else {
          setAuthState((prev) => ({ ...prev, loading: false }));
        }
      });
    }
    // Listen for auth changes
    // const {
    //   data: { subscription },
    // } = supabase.auth.onAuthStateChange(async (event, session) => {
    //   if (session) {
    //     fetchUser(session.user.id);
    //   } else {
    //     setAuthState({
    //       user: null,
    //       isAuthenticated: false,
    //       loading: false,
    //     });
    //   }
    // });
    // return () => {
    //   subscription.unsubscribe();
    // };
  }, [authState.loading, authState.user]);

  const fetchUser = async (userId: string) => {
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
  };

  const login = async (email: string, password: string): Promise<boolean> => {
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
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    onSuccess?: () => void,
    onError?: (message: string) => void
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
        if (onError) onError(signUpError.message);
        throw signUpError;
      }
      if (!user) throw new Error("No user returned after signup");
      // Wait for session
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
        if (onError) onError(profileError.message);
        throw profileError;
      }
      await fetchUser(user.id);
      if (onSuccess) onSuccess();
      return true;
    } catch (error: any) {
      let msg = "Registration error. Please try again.";
      if (error?.message && error.message.includes("already registered")) {
        msg = "User already registered. Try logging in.";
      } else if (error?.message) {
        msg = error.message;
      }
      if (onError) onError(msg);
      console.error("Registration error:", error);
      return false;
    }
  };


  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateProfile = async (data: {
    username?: string;
    email?: string;
    avatar?: string;
  }): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("users")
        .update(data)
        .eq("id", authState.user?.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
