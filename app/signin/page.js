'use client'

import LoginForm from "@/components/LoginForm"
import AuthLayout from "@/components/AuthLayout"
import { useEffect } from 'react'

export default function SignIn() {
  // Add effect to prevent scrolling on mobile
  useEffect(() => {
    // Prevent scrolling on mount
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100vh'
    
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
  }, [])
  
  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Another day, another interview."
    >
      <LoginForm />
    </AuthLayout>
  )
}
