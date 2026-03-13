"use client";

import Link from "next/link";
import { Button } from "../ui/Button";
import { Search, Briefcase, User, SavedSearch } from "lucide-react";

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full glass border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-2 rounded-lg">
                            <Briefcase className="text-white w-6 h-6" />
                        </div>
                        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            JobPulse AI
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                            Find Jobs
                        </Link>
                        <Link href="/saved" className="text-sm font-medium hover:text-primary transition-colors">
                            Saved
                        </Link>
                        <Link href="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                            Profile
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="outline" size="sm">Sign In</Button>
                        </Link>
                        <Link href="/login">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
