'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import Navbar from '@/components/navbar'
import Image from 'next/image'

export default function Leaderboard() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

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
      }
    }

    fetchProfiles()
  }, [])

  const handleProfileClick = (linkedinUrl) => {
    window.open(linkedinUrl, '_blank')
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
      <div className="max-w-4xl mx-auto w-full px-4 py-16">
        <h1 className="text-4xl font-mono font-bold mb-12 tracking-tight">Leaderboard</h1>
        <div className="space-y-4">
          {profiles.map((profile, index) => (
            <div 
              key={index}
              onClick={() => handleProfileClick(profile.linkedin_url)}
              className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-lg hover:bg-yellow-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <span className="font-mono text-2xl font-bold text-gray-400 w-12">
                  #{index + 1}
                </span>
                <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
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
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="font-mono text-xl">
                  {profile.full_name}
                </span>
              </div>
              <span className="font-mono text-xl font-bold">
                {Math.round(profile.elo)} ELO
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
