"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import ThemeToggleBtn from "./ThemeToggleBtn";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/auth/check-admin");
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("Failed to check admin status:", error);
      }
    };

    checkAdmin();
  }, []);

  return (
    <nav className="bg-code-bg-primary px-20 py-3 border-b border-code-border flex items-center justify-between sticky top-0 z-50 transition-colors duration-200">
      {/* Left Side: Logo */}
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-2xl font-bold text-code-accent no-underline"
        >
          Code++
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6">
          <Link
            href="/problems"
            className="text-code-text-secondary text-sm font-medium no-underline transition-colors duration-200 hover:text-code-text-primary"
          >
            Problems
          </Link>

          {/* <Link
            href="/contest"
            className="text-code-text-secondary text-sm font-medium no-underline transition-colors duration-200 hover:text-code-text-primary"
          >
            Contest
          </Link>

          <Link
            href="/discuss"
            className="text-code-text-secondary text-sm font-medium no-underline transition-colors duration-200 hover:text-code-text-primary"
          >
            Discuss
          </Link> */}
        </div>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <ThemeToggleBtn />

        {/* Admin Button - Only visible for admins */}
        {isAdmin && (
          <Link href="/admin">
            <button className="bg-amber-400/30 text-amber-500 px-3 py-1 rounded-md font-semibold font-sans text-sm shadow-[0_2px_8px_rgba(255,161,22,0.3)] hover:shadow-[0_4px_12px_rgba(255,161,22,0.5)] hover:-translate-y-px active:translate-y-0 transition-all duration-200 cursor-pointer border-none">
              Admin
            </button>
          </Link>
        )}

        {/* Authentication */}
        <div className="flex items-center">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-code-bg-tertiary hover:bg-code-bg-secondary text-code-text-primary px-4 py-1 rounded-md text-sm font-medium transition-all">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
