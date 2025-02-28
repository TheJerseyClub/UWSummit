'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import Image from 'next/image'
import Navbar from '@/components/navbar'
import { normalizeProgram } from '@/utils/programNormalizer'
import { groupExperiences } from '@/utils/experienceGrouper'

export default function UserProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState(null)
  const params = useParams()
  const profileId = params.id
  const router = useRouter()

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
        setTimeout(() => setMounted(true), 100)
      }
    }

    if (profileId) {
      fetchProfile()
    }
  }, [profileId])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-mono">Loading...</div>
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-red-500">
        {error || 'Profile not found'}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex m-8 md:flex-row md:m-8">
      {/* Sticky Left Panel - Hidden on mobile */}
      <button
        onClick={() => router.back()}
        className="hidden md:flex w-32 fixed left-0 top-0 h-screen bg-white border-r border-gray-300 items-center justify-center hover:bg-yellow-50 transition-colors group active:bg-yellow-100"
      >
        <div className="flex flex-col items-center gap-2 text-gray-800">
          <span className="text-4xl font-bold transition-transform group-hover:translate-x-[-4px] group-active:translate-x-[-8px]">←</span>
          <span className="font-mono text-sm">Back</span>
        </div>
      </button>

      {/* Main Content */}
      <div className="flex-1 md:pl-32">
        <Navbar />
        <div className="max-w-4xl mx-auto pt-16 md:pt-20 px-4">
          <div className="bg-white p-4 md:p-8 border border-gray-300 rounded-md">
            {/* Profile Header - Animate First */}
            <div className={`flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6 opacity-0 ${mounted ? 'animate-slide-up' : ''}`} style={{animationDelay: '100ms', animationFillMode: 'forwards'}}>
              {profile?.profile_pic_url ? (
                <div className="border border-gray-300 rounded-md w-20 h-20 md:w-[100px] md:h-[100px]">
                  <Image
                    src={profile.profile_pic_url}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="object-cover rounded-md"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 md:w-[100px] md:h-[100px] bg-gray-50 border border-gray-300 rounded-md" />
              )}
              <div>
                <h1 className="text-2xl md:text-4xl font-mono font-bold tracking-tight">{profile?.full_name || 'No name provided'}</h1>
                {profile?.education?.filter(edu => 
                  edu.school?.toLowerCase().includes('waterloo')
                ).length > 0 && (
                  <div className="mt-2">
                    {profile.education
                      .filter(edu => edu.school?.toLowerCase().includes('waterloo'))
                      .map((edu, index) => {
                        const programInfo = normalizeProgram(edu.field_of_study || edu.degree_name);
                        return (
                          <p key={index} className="font-mono text-lg md:text-xl text-gray-600">{`${programInfo.name} ${programInfo.emoji}`}</p>
                        );
                      })}
                  </div>
                )}
                {profile?.linkedin_url && (
                  <a 
                    href={profile.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full md:w-auto items-center justify-center gap-2 font-mono text-sm md:text-base text-white bg-[#0A66C2] hover:bg-[#004182] px-3 py-1 md:px-4 md:py-2 transition-colors rounded-md"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                    View LinkedIn Profile
                    <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <div className="w-full h-[1px] bg-gray-300 my-6 md:my-8"></div>
            
            {/* Experience Section - Animate Second */}
            <div className={`mb-6 opacity-0 ${mounted ? 'animate-slide-up' : ''}`} style={{animationDelay: '300ms', animationFillMode: 'forwards'}}>
              <h2 className="text-2xl md:text-3xl font-mono font-bold tracking-tight">Experience 💼</h2>
            </div>

            <div className={`space-y-4 md:space-y-6 opacity-0 ${mounted ? 'animate-slide-up' : ''}`} style={{animationDelay: '400ms', animationFillMode: 'forwards'}}>
              {profile?.experiences?.length > 0 ? (
                groupExperiences(profile.experiences).map((group, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-300 p-3 md:p-4 hover:bg-yellow-50 transition-colors rounded-md opacity-0 animate-slide-up" 
                    style={{animationDelay: `${500 + (index * 100)}ms`, animationFillMode: 'forwards'}}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {group.companyLogo && (
                        <Image
                          src={group.companyLogo}
                          alt={`${group.company} logo`}
                          width={40}
                          height={40}
                          className="border border-gray-300 rounded-md"
                        />
                      )}
                      <h3 className="font-mono font-bold text-xl">{group.company}</h3>
                    </div>
                    
                    <div className="space-y-4 ml-[52px]">
                      {group.positions.map((position, posIndex) => (
                        <div key={posIndex} className="flex items-center gap-2">
                          <span className="text-gray-600">•</span>
                          <p className="font-mono font-bold text-gray-600">{position.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="font-mono text-gray-600">No experience information available</p>
              )}
            </div>

            {/* Volunteer Work Section - Animate Third */}
            {profile?.volunteer_work && profile.volunteer_work.length > 0 && (
              <>
                <div className="w-full h-[1px] bg-gray-300 my-6 md:my-8"></div>
                <div className={`mb-6 opacity-0 ${mounted ? 'animate-slide-up' : ''}`} style={{animationDelay: '700ms', animationFillMode: 'forwards'}}>
                  <h2 className="text-2xl md:text-3xl font-mono font-bold mb-6 tracking-tight">Volunteer Work</h2>
                  <div className="space-y-4 md:space-y-6">
                    {profile.volunteer_work.map((vol, index) => (
                      <div 
                        key={index} 
                        className="border border-gray-300 p-3 md:p-4 hover:bg-yellow-50 transition-colors rounded-md opacity-0 animate-slide-up" 
                        style={{animationDelay: `${800 + (index * 100)}ms`, animationFillMode: 'forwards'}}
                      >
                        <h3 className="font-mono font-bold text-xl">{vol.title}</h3>
                        <p className="font-mono text-gray-800">{vol.company}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Accomplishments Section - Animate Fourth */}
            {profile?.accomplishments && profile.accomplishments.length > 0 && (
              <>
                <div className="w-full h-[1px] bg-gray-300 my-6 md:my-8"></div>
                <div className={`mb-6 opacity-0 ${mounted ? 'animate-slide-up' : ''}`} style={{animationDelay: '900ms', animationFillMode: 'forwards'}}>
                  <h2 className="text-2xl md:text-3xl font-mono font-bold mb-6 tracking-tight">Accomplishments</h2>
                  <div className="space-y-4 md:space-y-6">
                    {profile.accomplishments.map((acc, index) => (
                      <div 
                        key={index} 
                        className="border border-gray-300 p-3 md:p-4 hover:bg-yellow-50 transition-colors rounded-md opacity-0 animate-slide-up" 
                        style={{animationDelay: `${1000 + (index * 100)}ms`, animationFillMode: 'forwards'}}
                      >
                        <h3 className="font-mono font-bold text-xl">{acc.title}</h3>
                        <p className="mt-2 font-mono text-gray-800">{acc.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
