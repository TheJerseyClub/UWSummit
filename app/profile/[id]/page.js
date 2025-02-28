'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import Image from 'next/image'
import Navbar from '@/components/navbar'
import { normalizeProgram } from '@/utils/programNormalizer'
import { groupExperiences } from '@/utils/experienceGrouper'

export default function UserProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = useParams()
  const profileId = params.id

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single()

        if (error) throw error
        
        setProfile(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
        setError('Profile not found or error loading profile')
      } finally {
        setLoading(false)
      }
    }

    if (profileId) {
      fetchProfile()
    }
  }, [profileId])

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="font-mono">Loading profile...</p>
        </div>
      </main>
    )
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="font-mono text-red-500">{error || 'Profile not found'}</p>
        </div>
      </main>
    )
  }

  // Process education data
  const waterlooEducation = profile.education?.find(edu => 
    edu.school?.toLowerCase().includes('waterloo')
  )
  
  const studyField = waterlooEducation?.field_of_study || waterlooEducation?.degree_name || "Unknown Program"
  const programInfo = normalizeProgram(studyField)

  // Process experience data
  const groupedExperiences = groupExperiences(profile.experiences || [])

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-yellow-50 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-md bg-gray-200 overflow-hidden flex-shrink-0">
              {profile.profile_pic_url ? (
                <Image
                  src={profile.profile_pic_url}
                  alt={profile.full_name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold font-mono">{profile.full_name}</h1>
              <div className="mt-2 inline-block bg-yellow-100 px-3 py-1 rounded-md">
                <p className="font-mono">{programInfo.name} {programInfo.emoji}</p>
              </div>
              <div className="mt-4 flex flex-col md:flex-row gap-4 items-center md:items-start">
                <div className="bg-gray-100 px-4 py-2 rounded-md">
                  <p className="font-mono text-sm">ELO Rating</p>
                  <p className="font-mono text-xl font-bold">{Math.round(profile.elo || 1000)}</p>
                </div>
                {profile.linkedin_url && (
                  <a 
                    href={profile.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="p-6">
            <h2 className="text-xl md:text-2xl font-bold font-mono mb-4">EXPERIENCE</h2>
            <div className="space-y-6">
              {groupedExperiences.map((experience, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 relative flex-shrink-0 mt-1 bg-gray-100 rounded-md flex items-center justify-center">
                      {experience.companyLogo ? (
                        <Image 
                          src={experience.companyLogo}
                          alt={`${experience.company} logo`}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{experience.company}</h3>
                      <div className="space-y-2 mt-2">
                        {experience.positions.map((position, posIndex) => (
                          <div key={posIndex} className="ml-2">
                            <p className="font-medium">{position.title}</p>
                            {position.date_range && (
                              <p className="text-sm text-gray-600">{position.date_range}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
