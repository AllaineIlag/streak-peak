import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
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
          <Link href="/dashboard" className="w-full">
            <Button className="w-full" size="lg">
              Sign in with Google
            </Button>
          </Link>
          <div className="text-center text-sm text-muted-foreground mt-4">
            (OAuth integration pending)
          </div>
        </div>
      </div>
    </div>
  );
}
