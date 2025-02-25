'use client'

import LoginForm from "@/components/LoginForm"
import AuthLayout from "@/components/AuthLayout"

export default function SignIn() {
  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Another day, another interview."
    >
      <LoginForm />
    </AuthLayout>
  )
}
