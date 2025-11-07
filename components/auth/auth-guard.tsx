"use client";

import { useUser } from "@/contexts/user-context";
import { AuthForm } from "./auth-form";
import { Card, CardContent } from "../ui/card";

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
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold text-primary tracking-tight">
                Tokido
              </h1>
              <div className="h-px w-16 bg-border mx-auto"></div>
            </div>
            <p className="text-xl text-muted-foreground font-light">
              Task management perfected
            </p>
          </div>

          <AuthForm />

          <div className="text-center text-sm text-muted-foreground">
            <p>Simple • Fast • Effective</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
