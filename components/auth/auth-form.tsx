"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Form validation
    if (!email || !password) {
      toast("Please enter your email and password.");
      return;
    }

    if (mode === "signup" && (!firstName || !lastInitial)) {
      toast("Please enter your first name and last initial.");
      return;
    }

    setLoading(true);

    if (mode === "signup") {
      const result = await signUp({ email, password, firstName, lastInitial });

      if (result.error) {
        toast(result.error);
      } else {
        toast(result.message);
      }
    } else {
      const result = await signIn({ email, password });

      if (result?.error) {
        toast(result.error);
      }
    }

    setLoading(false);
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>{mode === "signin" ? "Sign In" : "Sign Up"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Input
                  placeholder="First name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Last initial"
                  type="text"
                  maxLength={1}
                  value={lastInitial}
                  onChange={(e) => setLastInitial(e.target.value.toUpperCase())}
                  className="w-full"
                />
              </div>
            </div>
          )}
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <Button
          variant="link"
          className="mt-2 w-full text-sm"
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </Button>
      </CardContent>
    </Card>
  );
}
