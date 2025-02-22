"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

export default function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [userRank, setUserRank] = useState(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        // Fetch all profiles ordered by ELO to determine rank
        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('id, elo')
          .order('elo', { ascending: false });

        // Fetch user's profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
          // Find user's rank
          const rank = allProfiles.findIndex(p => p.id === user.id) + 1;
          setUserRank(rank);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full w-full">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-mono font-bold text-gray-900 hover:text-gray-600 transition-colors">
              <span className="text-yellow-500">UW</span>Co-opium
            </Link>
          </div>
          
          <div className="hidden md:flex items-center justify-end flex-1 space-x-8">
            <Link 
              href="/leaderboard"
              className="text-gray-600 hover:text-gray-900 hover:bg-yellow-50 px-2 py-1 rounded-md text-md font-mono font-bold transition-colors"
            >
              Leaderboard
            </Link>
            <Link 
              href="/recruit/signin"
              className="text-yellow-500 hover:text-black hover:bg-yellow-100 px-2 py-1 rounded-md text-md font-mono font-bold transition-colors uppercase tracking-wider"
            >
              Recruit
            </Link>
            {user ? (
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 hover:bg-yellow-50 px-3 py-2 rounded-md transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden">
                      {userProfile?.profile_pic_url ? (
                        <Image 
                          src={userProfile.profile_pic_url} 
                          alt="Profile" 
                          width={32} 
                          height={32} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-mono text-sm font-bold text-gray-900">{user.email}</span>
                      <span className="font-mono text-xs text-gray-500">
                        {userRank ? `Rank #${userRank}` : 'Unranked'}
                      </span>
                    </div>
                  </button>

                  <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 transition-all duration-200 ease-in-out transform origin-top ${
                    dropdownOpen 
                      ? 'opacity-100 scale-y-100' 
                      : 'opacity-0 scale-y-0 pointer-events-none'
                  }`}>
                    <Link 
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 font-mono"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 font-mono"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/recruit/signin"
                  className="px-4 py-2 bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-white hover:text-yellow-500 font-mono uppercase tracking-wider hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-md"
                >
                  Recruit Sign In
                </Link>
                <Link 
                  href="/signin"
                  className="px-4 py-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black font-mono uppercase tracking-wider hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-md"
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
