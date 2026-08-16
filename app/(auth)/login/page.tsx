"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error logging in with Google:", error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="mb-4">
            <span className="font-bold text-xl">StreakPeak</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        <div className="grid gap-4">
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleGoogleLogin} 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
