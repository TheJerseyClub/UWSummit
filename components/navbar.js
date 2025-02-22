"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import Image from "next/image";

export default function Navbar({ profilePicture }) {
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
              UWCoopium
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
              <div className="flex items-center space-x-6">

                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                  {profilePicture ? (
                    <Image src={profilePicture} alt="Profile" width={32} height={32} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="font-mono text-gray-900">{user.email}</span>
                <Link 
                  href="#"
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900 font-mono text-sm"
                >
                  Sign Out
                </Link>
              </div>
            ) : (
              <Link 
                href="/signin"
                className="px-4 py-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black font-mono uppercase tracking-wider hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
