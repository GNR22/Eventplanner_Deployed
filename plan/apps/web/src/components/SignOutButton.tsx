'use client';

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })} 
      className="text-xs text-pub-gold hover:text-white hover:underline font-semibold transition"
    >
      Sign Out
    </button>
  );
}