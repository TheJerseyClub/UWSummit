"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
export default function Navbar() {
  const { user } = useAuth()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-mono font-bold text-gray-900 hover:text-gray-600 transition-colors">
              Coopium
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/leaderboard"
              className="text-gray-600 hover:text-gray-900 hover:bg-yellow-50 px-2 py-1 rounded-md text-md font-mono font-bold transition-colors"
            >
              Leaderboard
            </Link>
            {user && (
              <Link 
                href="/profile"
                className="text-gray-600 hover:text-gray-900 hover:bg-yellow-50 px-2 py-1 rounded-md text-md font-mono font-bold transition-colors"
              >
                Profile
              </Link>
            )}
            {user ? (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black font-mono uppercase tracking-wider hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  href="/signup"
                  className="px-4 py-2 bg-white text-black border-2 border-black hover:bg-black hover:text-white font-mono uppercase tracking-wider hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                >
                  Sign Up
                </Link>
                <Link 
                  href="/signin"
                  className="px-4 py-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black font-mono uppercase tracking-wider hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
