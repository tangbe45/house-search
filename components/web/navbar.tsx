"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Houses", href: "/houses" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Contact", href: "/contact" },
  ];

  return (
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-500 absolute h-screen z-50  w-[50%] -right-4 top-14 shadow-md  dark:bg-gray-900 dark:text-gray-300">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block p-2 text-gray-300 hover:text-indigo-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
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
  );
}
