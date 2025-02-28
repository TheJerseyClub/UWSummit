'use client'

import SignupForm from '@/components/SignupForm'
import AuthLayout from "@/components/AuthLayout"

export default function SignUp() {
  return (
    <AuthLayout 
      title="First Time?" 
      subtitle="Time to get your hands dirty."
    >
      <SignupForm />
    </AuthLayout>
  )
}