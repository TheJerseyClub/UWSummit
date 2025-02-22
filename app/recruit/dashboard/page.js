'use client'

import { useState } from 'react'
import Navbar from '@/components/navbar'

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle search functionality here
    console.log('Searching for:', prompt)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <main className="flex flex-col mt-[64px] h-[calc(100vh-64px)]">
        <div className="flex-1 px-4 py-16 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 h-full">
            {/* Search Section */}
            <section className="relative">
              <div className="absolute -right-4 top-0 w-64 h-64 bg-yellow-50 rounded-full opacity-50 blur-3xl"></div>
              <h1 className="font-mono text-6xl font-black mb-6 tracking-tight">
                Find your perfect
                <br />
                <span className="text-yellow-500">candidate match</span>
              </h1>
              
              <form 
                onSubmit={handleSubmit}
                className="mt-8 bg-white p-8 rounded-lg border border-gray-200"
              >
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the skills you're looking for... (e.g., 'Find me top 5 students with React, TypeScript, and AWS experience')"
                    className="w-full min-h-[120px] p-6 bg-gray-50 rounded-lg font-mono text-base resize-none focus:outline-none focus:bg-yellow-50 focus:border-yellow-500 transition-colors border border-gray-200"
                  />
                </div>

                <button 
                  type="submit"
                  className="mt-4 w-full bg-yellow-500 text-white font-mono font-bold px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Search Candidates
                </button>
              </form>
            </section>

            {/* Results Section */}
            <section className="border-l border-gray-200 pl-16 h-full">
              <h2 className="font-mono text-2xl font-bold mb-8 sticky top-0 bg-white">Top Matches</h2>
              
              <div className="space-y-4 overflow-y-auto h-[calc(100vh-250px)] pr-4">
                {/* Placeholder Student Cards */}
                {[1, 2, 3, 4, 5].map((index) => (
                  <div 
                    key={index}
                    className="p-6 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                      <div className="flex-1">
                        <h3 className="font-mono font-bold text-lg">Student {index}</h3>
                        <p className="font-mono text-sm text-gray-600 mb-2">University of Waterloo • Computer Science</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-yellow-50 border border-black rounded-md text-sm font-mono">React</span>
                          <span className="px-2 py-1 bg-yellow-50 border border-black rounded-md text-sm font-mono">TypeScript</span>
                          <span className="px-2 py-1 bg-yellow-50 border border-black rounded-md text-sm font-mono">Node.js</span>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-yellow-500">
                        {95 - index}% Match
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
