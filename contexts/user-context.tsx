"use client";

import { supabase } from "@/lib/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserContextProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export function UserProvider({ children, initialUser }: UserContextProps) {
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    } catch (error) {
      console.error("Error refreshing session:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setUser(initialUser ?? null);
    setLoading(false);
  }, [initialUser]);

  useEffect(() => {
    if (!initialUser) {
      refreshSession();
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === "INITIAL_SESSION") {
        return;
      }
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialUser, refreshSession]);

  const value = {
    user,
    session,
    loading,
    refreshSession,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
