"use client";

import { toast } from "sonner";
import { useState } from "react";
import { signIn, signUp } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      toast.error("Missing Information", {
        description: "Please enter both email and password to continue",
      });
      return;
    }

    if (mode === "signup" && (!firstName || !lastInitial)) {
      toast.error("Complete Your Profile", {
        description: "Please enter your first name and last initial",
      });
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const result = await signUp({
          email,
          password,
          firstName,
          lastInitial,
        });
        console.log(result);
        if (result.error) {
          toast.error("Sign Up Failed", {
            description: result.error,
            duration: 5000,
          });
        } else {
          toast.success("Welcome Aboard!", {
            description: `Account created successfully for ${firstName}. Check your email to verify your account.`,
            duration: 6000,
          });
        }
      } else {
        const result = await signIn({ email, password });

        if (result?.error) {
          if (result?.error) {
            toast.error("Sign In Failed", {
              description: result.error,
              duration: 5000,
            });
          } else {
            toast.success("Welcome Back!", {
              description: `Successfully signed in with ${email}`,
              duration: 4000,
            });
          }
        }
      }
    } catch (error) {
      toast.error("Something Went Wrong", {
        description: "Please try again in a moment",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
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
          <Button
            className="w-full cursor-pointer"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <Button
          variant="link"
          className="mt-2 w-full text-sm cursor-pointer"
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
