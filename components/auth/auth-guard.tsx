"use client";

import { useUser } from "@/contexts/user-context";
import { AuthForm } from "./auth-form";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <AuthForm />
      </div>
    );
  }

  return <>{children}</>;
}
