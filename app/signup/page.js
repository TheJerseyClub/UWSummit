'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({ text: '', isError: false })

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      setMessage({ text: error.message, isError: true })
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setMessage({ text: '', isError: false })
    
    try {
      // If we get here, the user doesn't exist, so try to sign up
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setMessage({ text: error.message, isError: true })
        return
      }
      
      setMessage({ text: 'Check your email for the confirmation link!', isError: false })
    } catch (error) {
      setMessage({ text: error.message, isError: true })
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F7F7F7] overflow-hidden p-4">
      {/* Mountain Silhouettes with Snow */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full opacity-90 transform scale-150"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back mountain range */}
          <path
            d="M-200 750L320 200L520 400L920 100L1200 500L1520 250L1650 600L2000 400V900H-200V750Z"
            fill="#000000"
            className="opacity-90"
          />
          {/* Snow caps for back range */}
          <path
            d="M320 200L420 300L520 400L720 250L920 100L1020 200L1200 500L1320 375L1520 250L1585 425L1650 600L1750 500L2000 400L1900 450L1700 650L1600 625L1450 300L1300 525L1150 475L1000 150L850 125L700 275L600 425L450 225L320 200Z"
            fill="#FFFFFF"
            className="opacity-20"
          />
          {/* Additional snow detail for back range */}
          <path
            d="M920 100L970 150L1020 200L1070 175L1120 225L1200 500L1250 450L1300 525L1350 500L1400 550L1450 300L1500 350L1520 250L1540 300L1585 425L1600 400L1650 600L1700 550L1750 500L1800 525L1850 475L1900 450L1950 475L2000 400L1900 450L1700 650L1600 625L1450 300L1300 525L1150 475L1000 150L920 100Z"
            fill="#FFFFFF"
            className="opacity-30"
          />
          
          {/* Middle mountain range */}
          <path
            d="M-200 800L320 400L520 550L920 300L1200 650L1520 450L1650 700L2000 550V900H-200V800Z"
            fill="#000000"
            className="opacity-80"
          />
          {/* Snow caps for middle range */}
          <path
            d="M320 400L420 500L520 550L720 450L920 300L1020 400L1200 650L1320 550L1520 450L1585 525L1650 700L1750 600L1850 525L1750 575L1600 725L1500 625L1350 475L1200 675L1050 575L900 350L750 425L600 575L450 425L320 400Z"
            fill="#FFFFFF"
            className="opacity-15"
          />
          {/* Additional snow detail for middle range */}
          <path
            d="M920 300L970 350L1020 400L1070 375L1120 425L1200 650L1250 600L1300 625L1350 600L1400 650L1450 500L1500 550L1520 450L1540 500L1585 525L1600 500L1650 700L1700 650L1750 600L1800 625L1850 525L1750 575L1600 725L1500 625L1350 475L1200 675L1050 575L920 300Z"
            fill="#FFFFFF"
            className="opacity-25"
          />

          {/* Front mountain range */}
          <path
            d="M-200 850L320 600L520 700L920 500L1200 800L1520 650L1650 800L2000 700V900H-200V850Z"
            fill="#000000"
            className="opacity-70"
          />
          {/* Snow caps for front range */}
          <path
            d="M320 600L420 650L520 700L720 600L920 500L1020 600L1200 800L1320 700L1520 650L1585 725L1650 800L1750 750L1850 700L1750 725L1600 825L1500 775L1350 675L1200 825L1050 725L900 550L750 625L600 725L450 625L320 600Z"
            fill="#FFFFFF"
            className="opacity-10"
          />
          {/* Additional snow detail for front range */}
          <path
            d="M920 500L970 550L1020 600L1070 575L1120 625L1200 800L1250 750L1300 775L1350 750L1400 800L1450 700L1500 750L1520 650L1540 700L1585 725L1600 700L1650 800L1700 750L1750 725L1800 750L1850 700L1750 725L1600 825L1500 775L1350 675L1200 825L1050 725L920 500Z"
            fill="#FFFFFF"
            className="opacity-20"
          />
        </svg>
      </div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight uppercase">Create Account</h1>
            <p className="text-sm text-muted-foreground font-mono">
              Sign up to get started with your account
            </p>
          </div>
          
          <form onSubmit={handleSignUp} className="space-y-4">
            {message.text && (
              <div className={`p-3 rounded-md animate-fade-in-down ${
                message.isError 
                  ? 'bg-red-100 text-red-700 border border-red-300' 
                  : 'bg-green-100 text-green-700 border border-green-300'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="relative w-full max-w-[400px] h-10 px-3 border border-[#747775] rounded text-[#1f1f1f] font-['Roboto',arial,sans-serif] text-sm tracking-[0.25px] bg-white hover:bg-black/[0.06] focus:bg-black/[0.12] active:bg-black/[0.16] transition-colors duration-[0.218s] select-none cursor-pointer"
            >
              <div className="flex items-center justify-center w-full h-full">
                <div className="h-5 w-5 mr-3">
                  <svg version="1.1" viewBox="0 0 48 48" style={{ display: 'block' }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="flex-grow font-medium overflow-hidden text-ellipsis whitespace-nowrap">Sign up with Google</span>
              </div>
            </button>

            <div className="md:hidden text-center text-xs text-gray-500 mt-2">
              <p>📱 Coming from Instagram? Sign up with email! (Google is wonky)</p>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300"
            />
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300"
            />
            <button
              type="submit"
              className="w-full p-2 border border-gray-300 flex items-center justify-center space-x-2 hover:bg-gray-50"
            >
              Sign Up
            </button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/signin" className="text-black underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}