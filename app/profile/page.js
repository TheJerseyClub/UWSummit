'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import LinkedinSubmit from '@/components/linkedin_submit'
import Navbar from '@/components/navbar'
import { normalizeProgram } from '@/utils/programNormalizer'
import { groupExperiences } from '@/utils/experienceGrouper'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.replace('/signin')
      return
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (error) throw error
        
        setProfile(data || null)
      } catch (error) {
        console.error('Error fetching profile:', error)
        setProfile(null)
      } finally {
        setLoading(false)
        setTimeout(() => setMounted(true), 100)
      }
    }

    fetchProfile()
  }, [user, router])

  if (!user) {
    return null
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-mono">Loading...</div>
  }

  if (!profile?.linkedin_url) {
    return (
      <div className="min-h-screen flex">
        {/* Sticky Left Panel */}
        <button
          onClick={() => router.back()}
          className="w-32 fixed left-0 top-0 h-screen bg-white border-r border-gray-300 flex items-center justify-center hover:bg-yellow-50 transition-colors"
        >
          <div className="flex flex-col items-center gap-2 text-gray-800">
            <span className="text-4xl font-bold">←</span>
            <span className="font-mono text-sm">Back</span>
          </div>
        </button>

        {/* Main Content */}
        <div className="flex-1 pl-32">
          <Navbar />
          <div className="max-w-4xl mx-auto pt-20 px-4">
            <div className="bg-white p-8 border border-gray-300 rounded-md hover:bg-yellow-50 transition-colors">
              <h1 className="text-4xl font-mono font-bold mb-6 tracking-tight">Complete Your Profile</h1>
              <div className="w-full h-[1px] bg-gray-300 my-6"></div>
              <p className="mb-6 font-mono">
                Please connect your LinkedIn profile to continue. This helps us verify your Waterloo affiliation.
              </p>
              <LinkedinSubmit />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row md:m-8">
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

      {/* Mobile Back Button */}
      <button
        onClick={() => router.back()}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-yellow-50"
      >
        <span className="text-2xl font-bold">←</span>
      </button>

      {/* Main Content */}
      <div className="flex-1 md:pl-32">
        <Navbar />
        <div className="max-w-4xl mx-auto pt-16 md:pt-20 px-4">
          <div className={`bg-white p-4 md:p-8 border border-gray-300 rounded-md translate-y-8 opacity-0 ${mounted ? 'animate-slide-up' : ''}`}>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8">
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
                {profile?.linkedin_url && (
                  <a 
                    href={profile.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-2 font-mono text-sm md:text-base text-gray-800 border border-gray-300 px-3 py-1 md:px-4 md:py-2 hover:bg-yellow-50 transition-colors rounded-md"
                  >
                    View LinkedIn Profile
                  </a>
                )}
              </div>
            </div>

            {/* Education Section */}
            <div className={`translate-y-8 opacity-0 ${mounted ? 'animate-slide-up' : ''}`} style={{ animationDelay: '200ms' }}>
              <div className="w-full h-[1px] bg-gray-300 my-6 md:my-8"></div>
              <section className="mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-mono font-bold mb-4 md:mb-6 tracking-tight">Program</h2>
                <div className="space-y-4 md:space-y-6">
                  {profile?.education?.filter(edu => 
                    edu.school?.toLowerCase().includes('waterloo')
                  ).length > 0 ? (
                    profile.education
                      .filter(edu => edu.school?.toLowerCase().includes('waterloo'))
                      .map((edu, index) => {
                        const programInfo = normalizeProgram(edu.field_of_study);
                        return (
                          <div key={index} className="border border-gray-300 p-3 md:p-4 hover:bg-yellow-50 transition-colors rounded-md">
                            <p className="font-mono text-gray-800">{`${programInfo.name} ${programInfo.emoji}`}</p>
                          </div>
                        );
                      })
                  ) : (
                    <p className="font-mono text-gray-600">No Waterloo education found</p>
                  )}
                </div>
              </section>
            </div>

            {/* Experience Section */}
            <div className={`translate-y-8 opacity-0 ${mounted ? 'animate-slide-up' : ''}`} style={{ animationDelay: '400ms' }}>
              <div className="w-full h-[1px] bg-gray-300 my-6 md:my-8"></div>
              <section className="mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-mono font-bold mb-4 md:mb-6 tracking-tight">Experience</h2>
                <div className="space-y-4 md:space-y-6">
                  {profile?.experiences?.length > 0 ? (
                    groupExperiences(profile.experiences).map((group, index) => (
                      <div key={index} className="border border-gray-300 p-3 md:p-4 hover:bg-yellow-50 transition-colors rounded-md">
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
                            <div key={posIndex} className="border-l-2 border-gray-300 pl-4">
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
              </section>
            </div>

            {/* Volunteer Work Section */}
            {profile?.volunteer_work && profile.volunteer_work.length > 0 && (
              <div className={`translate-y-8 opacity-0 ${mounted ? 'animate-slide-up' : ''}`} style={{ animationDelay: '600ms' }}>
                <div className="w-full h-[1px] bg-gray-300 my-8"></div>
                <section className="mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl font-mono font-bold mb-4 md:mb-6 tracking-tight">Volunteer Work</h2>
                  <div className="space-y-4 md:space-y-6">
                    {profile.volunteer_work.map((vol, index) => (
                      <div key={index} className="border border-gray-300 p-3 md:p-4 hover:bg-yellow-50 transition-colors rounded-md">
                        <h3 className="font-mono font-bold text-xl">{vol.title}</h3>
                        <p className="font-mono text-gray-800">{vol.company}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Accomplishments Section */}
            {profile?.accomplishments && profile.accomplishments.length > 0 && (
              <div className={`translate-y-8 opacity-0 ${mounted ? 'animate-slide-up' : ''}`} style={{ animationDelay: '800ms' }}>
                <div className="w-full h-[1px] bg-gray-300 my-8"></div>
                <section className="mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl font-mono font-bold mb-4 md:mb-6 tracking-tight">Accomplishments</h2>
                  <div className="space-y-4 md:space-y-6">
                    {profile.accomplishments.map((acc, index) => (
                      <div key={index} className="border border-gray-300 p-3 md:p-4 hover:bg-yellow-50 transition-colors rounded-md">
                        <h3 className="font-mono font-bold text-xl">{acc.title}</h3>
                        <p className="mt-2 font-mono text-gray-800">{acc.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* LinkedIn Update Section */}
            <div className={`translate-y-8 opacity-0 ${mounted ? 'animate-slide-up' : ''}`} style={{ animationDelay: '1000ms' }}>
              <div className="w-full h-[1px] bg-gray-300 my-8"></div>
              <section className="mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-mono font-bold mb-4 md:mb-6 tracking-tight">Update LinkedIn Profile</h2>
                <p className="mb-6 font-mono text-gray-800">Want to update your profile with new LinkedIn data?</p>
                <LinkedinSubmit />
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
