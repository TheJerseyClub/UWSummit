'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import Navbar from '@/components/navbar'
import Image from 'next/image'

export default function Leaderboard() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, elo, profile_pic_url, linkedin_url')
          .not('linkedin_url', 'is', null)
          .order('elo', { ascending: false })

        if (error) throw error
        setProfiles(data)
      } catch (error) {
        console.error('Error fetching profiles:', error)
      } finally {
        setLoading(false)
        // Delay setting mounted to true to ensure initial render is complete
        setTimeout(() => setMounted(true), 100)
      }
    }

    fetchProfiles()
  }, [])

  const handleProfileClick = (linkedinUrl) => {
    window.open(linkedinUrl, '_blank')
  }

  const renderPodium = () => {
    const topThree = profiles.slice(0, 3)
    const positions = [1, 0, 2]

    const podiumColors = {
      0: 'bg-yellow-500 group-hover:bg-yellow-400',
      1: 'bg-gray-400 group-hover:bg-gray-300',
      2: 'bg-amber-700 group-hover:bg-amber-600'
    }

    const animationDelays = {
      0: '0ms',
      1: '200ms',
      2: '400ms'
    }

    return (
      <div className="flex flex-col items-center mb-16 mt-10 px-4">
        <div className="flex justify-center items-end">
          {positions.map((position) => {
            const profile = topThree[position]
            if (!profile) return null

            const podiumHeight = position === 0 
              ? 'h-24 md:h-36' 
              : position === 1 
              ? 'h-20 md:h-28' 
              : 'h-16 md:h-24'
            const placement = position === 0 ? '1st' : position === 1 ? '2nd' : '3rd'
            
            return (
              <div 
                key={position} 
                className={`flex flex-col items-center mx-2 md:mx-3 translate-y-8 opacity-0 ${mounted ? 'animate-slide-up' : ''}`}
                style={{ animationDelay: animationDelays[position] }}
              >
                <div 
                  onClick={() => handleProfileClick(profile.linkedin_url)}
                  className="flex flex-col items-center mb-2 md:mb-3 cursor-pointer group"
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-md bg-gray-200 overflow-hidden mb-2 md:mb-3 border border-gray-300 group-hover:border-yellow-500 transition-colors">
                    {profile.profile_pic_url ? (
                      <Image 
                        src={profile.profile_pic_url} 
                        alt={profile.full_name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-sm md:text-base font-bold">{profile.full_name}</span>
                  <span className="font-mono text-xs md:text-sm text-gray-500">{profile.elo} ELO</span>
                </div>
                <div className={`w-20 md:w-28 ${podiumHeight} ${podiumColors[position]} rounded-t-md relative transition-colors`}>
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-mono font-bold text-white text-lg md:text-xl">
                    {placement}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        {/* Floor line under podium */}
        <div className="h-1 bg-gray-300 w-full max-w-md mt-0 rounded-full shadow-sm"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex items-center justify-center flex-1">
          <p className="font-mono">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Sticky Left Panel - Hidden on mobile */}
      <button
        onClick={() => window.history.back()}
        className="hidden md:flex w-32 fixed left-0 top-0 h-screen bg-white border-r border-gray-300 items-center justify-center hover:bg-yellow-50 transition-colors group active:bg-yellow-100"
      >
        <div className="flex flex-col items-center gap-2 text-gray-800">
          <span className="text-4xl font-bold transition-transform group-hover:translate-x-[-4px] group-active:translate-x-[-8px]">←</span>
          <span className="font-mono text-sm">Back</span>
        </div>
      </button>
      
      <div className="max-w-4xl mx-auto w-full px-4 py-16 md:pl-32">
        <h1 className="text-4xl font-mono font-bold mb-12 tracking-tight text-center mt-12">Leaderboard</h1>
        
        {/* Add podium section */}
        {renderPodium()}
        
        {/* List remaining players with delayed animation */}
        <div className="space-y-3 md:space-y-4">
          {profiles.slice(3).map((profile, index) => (
            <div 
              key={index + 3}
              onClick={() => handleProfileClick(profile.linkedin_url)}
              className={`flex items-center justify-between p-4 md:p-6 bg-white border border-gray-200 rounded-lg hover:bg-yellow-50 transition-colors cursor-pointer translate-y-8 opacity-0 ${mounted ? 'animate-slide-up' : ''}`}
              style={{ animationDelay: '600ms' }}
            >
              <div className="flex items-center gap-3 md:gap-6">
                <span className="font-mono text-xl md:text-2xl font-bold text-gray-400 w-8 md:w-12">
                  #{index + 4}
                </span>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                  {profile.profile_pic_url ? (
                    <Image 
                      src={profile.profile_pic_url} 
                      alt={profile.full_name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="font-mono text-base md:text-xl">
                  {profile.full_name}
                </span>
              </div>
              <span className="font-mono text-base md:text-xl font-bold">
                {Math.round(profile.elo)} ELO
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
