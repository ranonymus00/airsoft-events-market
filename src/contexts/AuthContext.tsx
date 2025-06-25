import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { User } from "../types";

interface AuthContextType {
  authState: {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
  };
  login: (email: User["email"], password: User["password"]) => Promise<boolean>;
  register: (
    username: User["username"],
    email: User["email"],
    password: User["password"]
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (avatar: User["avatar"]) => Promise<boolean>;
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
  const [authState, setAuthState] = useState<AuthContextType["authState"]>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

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

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      const {
        data: { session },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (session) fetchUser(session.user.id);

      if (error) {
        console.log(error);
      }

      return true;
    },
    []
  );

  const register = useCallback(
    async (
      username: string,
      email: string,
      password: string
    ): Promise<boolean> => {
      setAuthState((prev) => ({ ...prev, loading: true }));
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (user) fetchUser(user.id);

      if (error) {
        console.log(error);
      }

      return true;
    },
    []
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();

    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  }, []);

  const updateProfile = useCallback(
    async (avatar: string): Promise<boolean> => {
      try {
        if (!authState.user?.id) {
          throw new Error("No user logged in");
        }

        const { error } = await supabase
          .from("users")
          .update({
            avatar,
          })
          .eq("id", authState.user.id);

        if (error) throw error;

        // Update local state immediately for better UX
        setAuthState((prev) => ({
          ...prev,
          user: prev.user ? { ...prev.user, avatar } : null,
        }));

        return true;
      } catch (error) {
        console.error("Update profile error:", error);
        return false;
      }
    },
    [authState.user?.id]
  );

  return (
    <AuthContext.Provider
      value={{ authState, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
