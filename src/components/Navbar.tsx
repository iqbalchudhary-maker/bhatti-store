"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  // Farzi authentication state (Baad mein isay Clerk ya NextAuth se connect kar sakte hain)
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-black tracking-tighter">
          BHATTI<span className="text-blue-600">STORE</span>
        </Link>

        <div className="flex items-center gap-8 font-bold text-sm uppercase tracking-widest">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          
          {/* Cart Icon */}
          <Link href="/cart" className="relative hover:text-blue-600 transition-colors flex items-center gap-1">
            <span>Cart</span>
            <span className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded-full">0</span>
          </Link>

          {/* Conditional Login/Dashboard */}
          {isLoggedIn ? (
            <Link href="/dashboard" className="bg-black text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="border-2 border-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition-all">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}