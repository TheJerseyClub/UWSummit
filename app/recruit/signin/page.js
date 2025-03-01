'use client'

import { useState } from 'react'
import Navbar from '@/components/navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [code, setCode] = useState(['', '', '', '', ''])
  const [showPlaceholders, setShowPlaceholders] = useState(true)
  const [error, setError] = useState(false)
  const router = useRouter()
  
  // Add valid codes list (you should move this to your backend in production)
  const validCodes = ['3ARJE', '5BTKL']

  const handleCodeChange = (index, value) => {
    setError(false) // Reset error state on new input
    if (value.length > 1) return // Only allow single character
    
    const newCode = [...code]
    newCode[index] = value.toUpperCase() // Convert to uppercase
    setCode(newCode)
    
    // Hide placeholders if any input has a value
    setShowPlaceholders(newCode.every(c => c === ''))

    // Check if code is complete and validate
    if (index === 4 && value) {
      const enteredCode = newCode.join('')
      if (!validCodes.includes(enteredCode)) {
        setError(true)
        setCode(['', '', '', '', '']) // Clear immediately
        setShowPlaceholders(true)
        // Focus first input after clearing
        document.getElementById('code-0')?.focus()
        // Reset error state after animation
        setTimeout(() => {
          setError(false)
        }, 1000)
      }
    }

    // Auto-focus next input
    if (value && index < 4) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // If current input is empty and backspace is pressed, focus previous input
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
        // Clear the previous input
        const newCode = [...code]
        newCode[index - 1] = ''
        setCode(newCode)
      }
    }
  }

  return (
    <main className="min-h-screen h-screen flex flex-col overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center relative bg-white">
        {/* Vertical text on the left */}
        {/* <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
          <h1 className="font-mono font-black text-[12rem] tracking-[1rem] text-yellow-500 opacity-10">RECRUIT</h1>
        </div> */}

        {/* Learn More button at the bottom */}
        <Link 
          href="/recruit"
          className="absolute left-0 right-0 bottom-0 h-48 group flex items-center justify-center bg-white hover:bg-yellow-50 border-t border-gray-200 transition-colors"
        >
          <div className="flex items-center gap-3 whitespace-nowrap font-mono text-sm tracking-widest group-hover:text-yellow-500 transition-colors">
            LEARN MORE ABOUT RECRUIT
            <span className="transform group-hover:translate-x-2 transition-transform">
              →
            </span>
          </div>
        </Link>

        <div className="w-full max-w-md px-4">
          <p className="text-center text-gray-500 font-mono mb-12">
            enter sign-in code
          </p>

          <div className={`flex justify-center gap-4 mb-8 ${error ? 'animate-shake' : ''}`}>
            {[0, 1, 2, 3, 4].map((index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                placeholder={showPlaceholders ? ['3', 'A', 'R', 'J', 'E'][index] : ''}
                className={`w-16 h-16 text-center text-3xl border-b-2 ${error ? 'border-red-500' : 'border-black'} focus:border-b-4 outline-none transition-all font-mono uppercase`}
                value={code[index]}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
          
          <div className="md:hidden text-center text-xs text-gray-500 mt-2 mb-4">
            <p>📱 Coming from Instagram? Sign in with code! (Google is wonky)</p>
          </div>
          
          {error && (
            <p className="text-center text-red-500 text-sm mb-4">
              Invalid code. Please try again.
            </p>
          )}
          
          <p className="text-center text-sm text-gray-400">
            Need a code? Contact <a href="mailto:nwjeremysu@gmail.com" className="text-yellow-500 hover:underline">nwjeremysu@gmail.com</a>
          </p>
        </div>
      </div>
    </main>
  )
}
