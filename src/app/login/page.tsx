"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("isLoggedIn", "true");
        router.push("/dashboard");
      } else {
        setError("Ghalat Username ya Password!");
      }
    } catch (err) {
      setError("Network error! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-8">
        <div className="max-w-md w-full bg-gray-50 p-10 rounded-[3rem] shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Admin Login</h1>
            <p className="text-gray-400 text-xs font-bold uppercase mt-2 tracking-widest">Neon Database Protected</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full p-5 rounded-2xl border-2 border-gray-100 outline-none focus:border-blue-500 font-bold"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-5 rounded-2xl border-2 border-gray-100 outline-none focus:border-blue-500 font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            {error && <p className="text-red-500 text-xs font-black text-center uppercase tracking-widest">{error}</p>}

            <button 
              disabled={loading}
              className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase hover:bg-blue-600 transition-all shadow-lg disabled:bg-gray-400"
            >
              {loading ? "Verifying..." : "Login to Neon DB 🚀"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}