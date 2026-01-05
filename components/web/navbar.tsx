"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, isPending, error, refetch } = authClient.useSession();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup to prevent accidental locks
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Houses", href: "/houses" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Contact", href: "/contact" },
  ];

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <nav className="w-full py-4 flex items-center relative justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <h1 className="text-xl md:text-xl font-bold">
              <Link href="/">
                Habi<span className="text-blue-500">Move</span>
              </Link>
            </h1>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:justify-center md:items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${buttonVariants({
                    variant: "ghost",
                  })}  hover:text-indigo-600 transition-colors`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session ? (
            <div className="hidden md:flex gap-2">
              <p>Welcome, {session.user.name}</p>
              {/* <img src={session.user.image} alt="User avatar" /> */}
              <Button
                onClick={() => (
                  authClient.signOut(),
                  router.push("/auth/login"),
                  router.refresh()
                )}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link
                className={buttonVariants({ variant: "outline" })}
                href="/auth/login"
              >
                Login
              </Link>
              <Link className={buttonVariants()} href="/auth/sign-up">
                Sign Up
              </Link>
            </div>
          )}

          <ThemeToggle />
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-indigo-600"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      {/* 1. Mobile Menu Overlay (Dark Backdrop) */}
      <div
        onClick={toggleMenu}
        className={`fixed md:hidden inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* 2. Slide-out Mobile Panel */}
      <div
        className={`bg-card md:hidden fixed inset-y-0 right-0 z-50 w-3/4 max-w-xs transform p-6 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button onClick={toggleMenu} className=" text-gray-500">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex flex-col justify-between h-full overflow-y-auto p-6 shadow-xl">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                onClick={toggleMenu}
                key={item.name}
                href={item.href}
                className={`${buttonVariants({
                  variant: "ghost",
                })}  hover:text-indigo-600 transition-colors`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col space-y-4">
            {session ? (
              <div className="hidden md:flex gap-2">
                <Button
                  onClick={() => (
                    authClient.signOut(),
                    router.push("/auth/login"),
                    router.refresh()
                  )}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link
                  className={buttonVariants({ variant: "outline" })}
                  href="/auth/login"
                >
                  Login
                </Link>
                <Link className={buttonVariants()} href="/auth/sign-up">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
