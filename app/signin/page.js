'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({ text: '', isError: false })
  const router = useRouter()

  const handleSignIn = async (e) => {
    e.preventDefault()
    setMessage({ text: '', isError: false })
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      setMessage({ text: 'Sign in successful!', isError: false })
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } catch (error) {
      setMessage({ text: error.message, isError: true })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleSignIn} className="space-y-4 w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        {message.text && (
          <div className={`p-3 rounded-md ${
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
          Sign In
        </button>
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-black underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  )
}
