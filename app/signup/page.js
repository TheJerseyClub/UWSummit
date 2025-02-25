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
      // Try to sign in with the email to check if it exists
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-for-check'
      })

      // If there's no error or the error is about wrong password,
      // it means the user exists
      console.log(signInError.message)
      if (!signInError || signInError.message.includes('Invalid login credentials')) {
        setMessage({ 
          text: 'An account with this email already exists. Please sign in instead.', 
          isError: true 
        })
        return
      }

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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleSignUp} className="space-y-4 w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
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
          className="w-full p-2 bg-black text-white hover:bg-gray-800"
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
  )
}