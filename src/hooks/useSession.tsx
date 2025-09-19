"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
}

interface Session {
  user: User;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const sessionData = await authClient.getSession();
      setSession(sessionData?.data || null);
    } catch (err) {
      console.error("Error fetching session:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch session");
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authClient.signOut();
      setSession(null);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    session,
    user: session?.user || null,
    isLoading,
    isAuthenticated: !!session?.user,
    error,
    refresh: fetchSession,
    signOut,
  };
}
