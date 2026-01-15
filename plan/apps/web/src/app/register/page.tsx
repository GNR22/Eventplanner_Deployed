'use client';

import { registerUser } from "../actions";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-pub-black bg-pub-texture bg-cover p-4 backdrop-blur-[2px]">
      <div className="bg-pub-charcoal/95 p-8 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.6)] w-full max-w-md border-2 border-pub-wood relative overflow-hidden">
        
        {/* Decorative top gold bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-pub-gold"></div>

        <h1 className="text-3xl font-extrabold mb-2 text-center text-pub-gold tracking-wide drop-shadow-sm uppercase">
            Join the Club
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm font-medium">
            Create an account and start planning
        </p>
        
        <button 
          onClick={() => {
            setLoading(true);
            signIn("google", { callbackUrl: "/" });
          }}
          disabled={loading}
          className="w-full bg-white text-black border-2 border-transparent py-3 rounded-lg font-bold hover:bg-gray-200 transition flex items-center justify-center gap-3 mb-6 shadow-sm group"
        >
          {loading ? (
             <span>Connecting...</span>
          ) : (
             <>
               {/* Google Logo */}
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
               </svg>
               <span>Sign in with Google</span>
             </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-gray-600 flex-1"></div>
            <span className="text-pub-gold text-xs uppercase font-bold tracking-widest">Or via Email</span>
            <div className="h-px bg-gray-600 flex-1"></div>
        </div>

        {/* Manual Registration Form */}
        <form action={registerUser} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1">Full Name</label>
            <input 
                name="name" 
                type="text" 
                placeholder="John Doe" 
                className="w-full border border-gray-600 p-3 rounded-lg bg-black/40 outline-none focus:border-pub-gold focus:bg-black/60 transition text-white placeholder:text-gray-600 font-medium" 
                required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1">Email Address</label>
            <input 
                name="email" 
                type="email" 
                placeholder="john@example.com" 
                className="w-full border border-gray-600 p-3 rounded-lg bg-black/40 outline-none focus:border-pub-gold focus:bg-black/60 transition text-white placeholder:text-gray-600 font-medium" 
                required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1">Password</label>
            <input 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                className="w-full border border-gray-600 p-3 rounded-lg bg-black/40 outline-none focus:border-pub-gold focus:bg-black/60 transition text-white placeholder:text-gray-600 font-medium" 
                required 
            />
          </div>

          <button className="bg-pub-gold text-white py-3 rounded-lg font-extrabold hover:bg-black transition mt-4 shadow-lg border border-pub-gold uppercase tracking-wider">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400 font-medium">
          Already a member? <Link href="/api/auth/signin" className="text-pub-gold font-bold hover:text-white hover:underline transition">Log in</Link>
        </p>
      </div>
    </div>
  );
}