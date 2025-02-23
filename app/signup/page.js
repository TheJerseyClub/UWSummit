'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({ text: '', isError: false })

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

      if (error) throw error
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
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300"
        />
        <input
          type="password"
          placeholder="Password"
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