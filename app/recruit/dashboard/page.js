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

      <main className="flex flex-row h-screen">

        <div className="flex-1 max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

            {/* Search Section */}
            <section className="relative flex items-center justify-center px-8">
              <div className="absolute -right-4 top-0 w-64 h-64 bg-yellow-50 rounded-full opacity-50 blur-3xl"></div>
              
              <form 
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-white rounded-lg shadow-lg border border-gray-200"
              >
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the skills you're looking for... (e.g., 'Find me top 5 students with React, TypeScript, and AWS experience')"
                    className="w-full min-h-[120px] p-4 bg-white rounded-t-lg font-sans text-base resize-none focus:outline-none border-b border-gray-200"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-b-lg flex items-center">
                  <button 
                    type="submit"
                    className="ml-auto bg-black text-white font-sans px-4 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <span>Search Candidates</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </form>
            </section>

            {/* Results Section */}
            <section className="border-l border-gray-200 pl-16 h-full flex flex-col justify-center">
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
