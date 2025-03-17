"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Logo from "@/public/logo.svg";

export default function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
            <Image 
              src={Logo} 
              alt="Logo" 
              className="w-20 h-20 mr-2" 
              width={40} 
              height={40} 
            />
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
              href="/recruit"
              className="text-gray-600 hover:text-black hover:bg-yellow-100 px-2 py-1 rounded-md text-md font-mono font-bold transition-colors tracking-wider"
            >
              Recruit
            </Link>
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
              href="/recruit"
              className="block px-3 py-2 rounded-md text-base font-mono font-medium text-gray-700 hover:text-black hover:bg-yellow-50"
            >
              Recruit
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
