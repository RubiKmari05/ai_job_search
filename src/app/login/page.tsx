"use client";

import { Button } from "@/components/ui/Button";
import { Briefcase, Chrome } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function LoginPage() {
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/api/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            toast.error(error.message || "Failed to sign in with Google");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100-64px)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-card p-10 rounded-2xl border border-border shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                        <Briefcase className="text-white h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-foreground">Welcome Back</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to access your matched jobs and dashboard
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full flex items-center gap-3 py-6 text-base font-semibold"
                    >
                        <Chrome className="w-5 h-5 text-red-500" />
                        Continue with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>

                <div className="text-center mt-6">
                    <Link href="/" className="text-sm font-medium text-primary hover:underline">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
