"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

export default function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  const handleGoBack = () => {
    router.back();
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-300 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 h-full">
        <div className="flex items-center justify-between h-full w-full">
          {/* Back button - only on mobile and not on home page */}
          <div className={`md:hidden ${pathname === '/' ? 'hidden' : 'block'}`}>
            <button
              onClick={handleGoBack}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Go back"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
          
          {/* Logo and title */}
          <div className={`flex items-center md:flex-grow-0 ${
            pathname !== '/' ? 'absolute left-1/2 transform -translate-x-1/2 md:static md:left-auto md:transform-none' : 'relative left-0'
          }`}>
            <svg 
              className="w-8 h-8 mr-2" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 3L4 20H20L12 3Z" 
                fill="black"
              />
              <path 
                d="M12 7L9 13H15L12 7Z" 
                fill="white"
              />
            </svg>
            <Link href="/" className="text-2xl font-mono font-bold text-gray-900 hover:text-gray-600 transition-colors">
              <span className="text-yellow-500">UW</span>Summit
            </Link>
          </div>
          
          {/* Hamburger menu button - ensure it's on the right */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          <div className="hidden md:flex items-center justify-end flex-1 space-x-8">

          <Link 
              href="/home"
              className="text-gray-600 hover:text-black hover:bg-yellow-100 px-2 py-1 rounded-md text-md font-mono font-bold transition-colors tracking-wider"
            >
              Home
            </Link>
            
            <Link 
              href="/leaderboard"
              className="text-gray-600 hover:text-gray-900 hover:bg-yellow-50 px-2 py-1 rounded-md text-md font-mono font-bold transition-colors tracking-wider"
            >
              Leaderboard
            </Link>
            <Link 
              href="/recruit"
              className="text-gray-600 hover:text-black hover:bg-yellow-100 px-2 py-1 rounded-md text-md font-mono font-bold transition-colors tracking-wider"
            >
              Recruit
            </Link>

            {user ? (
              <div className="flex items-center space-x-6">
                <Link 
                  href="/"
                  className="px-4 py-2 bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-white hover:text-yellow-500 font-mono uppercase tracking-wider hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-md"
                >
                  Play
                </Link>
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
                  href="/"
                  className="px-4 py-2 bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-white hover:text-yellow-500 font-mono uppercase tracking-wider hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-md"
                >
                  Play
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

        <div
          className={`md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ease-in-out z-50 ${
            mobileMenuOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              href="/home"
              className="block px-3 py-2 rounded-md text-base font-mono font-medium text-gray-700 hover:text-gray-900 hover:bg-yellow-50"
            >
              Home
            </Link>
            <Link
              href="/leaderboard"
              className="block px-3 py-2 rounded-md text-base font-mono font-medium text-gray-700 hover:text-gray-900 hover:bg-yellow-50"
            >
              Leaderboard
            </Link>
            <Link
              href="/livevotes"
              className="block px-3 py-2 rounded-md text-base font-mono font-medium text-gray-700 hover:text-gray-900 hover:bg-yellow-50"
            >
              Live Votes
            </Link>
            <Link
              href="/recruit"
              className="block px-3 py-2 rounded-md text-base font-mono font-medium text-gray-700 hover:text-black hover:bg-yellow-50"
            >
              Recruit
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-mono font-medium text-gray-700 hover:text-gray-900 hover:bg-yellow-50"
                >
                  Profile
                </Link>
                <Link
                  href="/"
                  className="block px-3 py-2 rounded-md text-base font-mono font-medium bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white"
                >
                  Play
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-mono font-medium text-gray-700 hover:text-gray-900 hover:bg-yellow-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className="block px-3 py-2 rounded-md text-base font-mono font-medium bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white"
                >
                  Play
                </Link>
                <Link
                  href="/signin"
                  className="block px-3 py-2 rounded-md text-base font-mono font-medium bg-black text-white hover:bg-gray-800 hover:text-white"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
