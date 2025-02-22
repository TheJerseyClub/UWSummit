'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import LinkedinSubmit from '@/components/linkedin_submit'
import Navbar from '@/components/navbar'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
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
          className="w-32 fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex items-center justify-center hover:bg-yellow-50 transition-colors"
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
            <div className="bg-white p-8 border border-gray-200 rounded-md hover:bg-yellow-50 transition-colors">
              <h1 className="text-4xl font-mono font-bold mb-6 tracking-tight">Complete Your Profile</h1>
              <div className="w-full h-[1px] bg-gray-200 my-6"></div>
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
    <div className="min-h-screen flex">
      {/* Sticky Left Panel */}
      <button
        onClick={() => router.back()}
        className="w-32 fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex items-center justify-center hover:bg-yellow-50 transition-colors"
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
          <div className="bg-white p-8 border border-gray-200 rounded-md">
            <div className="flex items-center gap-6 mb-8">
              {profile?.profile_pic_url ? (
                <div className="border border-gray-200 rounded-md">
                  <Image
                    src={profile.profile_pic_url}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="object-cover rounded-md"
                  />
                </div>
              ) : (
                <div className="w-[100px] h-[100px] bg-gray-50 border border-gray-200 rounded-md" />
              )}
              <div>
                <h1 className="text-4xl font-mono font-bold tracking-tight">{profile?.full_name || 'No name provided'}</h1>
                {profile?.linkedin_url && (
                  <a 
                    href={profile.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-2 font-mono text-gray-800 border border-gray-200 px-4 py-2 hover:bg-yellow-50 transition-colors rounded-md"
                  >
                    View LinkedIn Profile
                  </a>
                )}
              </div>
            </div>

            <div className="w-full h-[1px] bg-gray-200 my-8"></div>

            {/* Education Section */}
            <section className="mb-8">
              <h2 className="text-3xl font-mono font-bold mb-6 tracking-tight">Education</h2>
              <div className="space-y-6">
                {profile?.education?.length > 0 ? (
                  profile.education.map((edu, index) => (
                    <div key={index} className="border border-gray-200 p-4 hover:bg-yellow-50 transition-colors rounded-md">
                      <h3 className="font-mono font-bold text-xl">{edu.school}</h3>
                      <p className="font-mono text-gray-800">{edu.degree_name}</p>
                      <p className="font-mono text-gray-800">{edu.field_of_study}</p>
                      <p className="font-mono text-sm text-gray-600 mt-2">{edu.starts_at?.year} - {edu.ends_at?.year || 'Present'}</p>
                    </div>
                  ))
                ) : (
                  <p className="font-mono text-gray-600">No education information available</p>
                )}
              </div>
            </section>

            <div className="w-full h-[1px] bg-gray-200 my-8"></div>

            {/* Experience Section */}
            <section className="mb-8">
              <h2 className="text-3xl font-mono font-bold mb-6 tracking-tight">Experience</h2>
              <div className="space-y-6">
                {profile?.experiences?.length > 0 ? (
                  profile.experiences.map((exp, index) => (
                    <div key={index} className="border border-gray-200 p-4 hover:bg-yellow-50 transition-colors rounded-md">
                      <div className="flex items-center gap-4">
                        {exp.company_logo_url && (
                          <Image
                            src={exp.company_logo_url}
                            alt={`${exp.company} logo`}
                            width={40}
                            height={40}
                            className="border border-gray-200 rounded-md"
                          />
                        )}
                        <div>
                          <h3 className="font-mono font-bold text-xl">{exp.title}</h3>
                          <p className="font-mono text-gray-800">{exp.company}</p>
                        </div>
                      </div>
                      <p className="font-mono text-sm text-gray-600 mt-2">
                        {exp.starts_at?.year} - {exp.ends_at?.year || 'Present'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="font-mono text-gray-600">No experience information available</p>
                )}
              </div>
            </section>

            {/* Volunteer Work Section */}
            {profile?.volunteer_work && profile.volunteer_work.length > 0 && (
              <>
                <div className="w-full h-[1px] bg-gray-200 my-8"></div>
                <section className="mb-8">
                  <h2 className="text-3xl font-mono font-bold mb-6 tracking-tight">Volunteer Work</h2>
                  <div className="space-y-6">
                    {profile.volunteer_work.map((vol, index) => (
                      <div key={index} className="border border-gray-200 p-4 hover:bg-yellow-50 transition-colors rounded-md">
                        <h3 className="font-mono font-bold text-xl">{vol.title}</h3>
                        <p className="font-mono text-gray-800">{vol.company}</p>
                        <p className="font-mono text-sm text-gray-600 mt-2">
                          {vol.starts_at?.year} - {vol.ends_at?.year || 'Present'}
                        </p>
                        <p className="mt-2 font-mono text-gray-800">{vol.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Accomplishments Section */}
            {profile?.accomplishments && profile.accomplishments.length > 0 && (
              <>
                <div className="w-full h-[1px] bg-gray-200 my-8"></div>
                <section>
                  <h2 className="text-3xl font-mono font-bold mb-6 tracking-tight">Accomplishments</h2>
                  <div className="space-y-6">
                    {profile.accomplishments.map((acc, index) => (
                      <div key={index} className="border border-gray-200 p-4 hover:bg-yellow-50 transition-colors rounded-md">
                        <h3 className="font-mono font-bold text-xl">{acc.title}</h3>
                        <p className="mt-2 font-mono text-gray-800">{acc.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            <div className="w-full h-[1px] bg-gray-200 my-8"></div>

            {/* LinkedIn Update Section */}
            <section className="mb-8">
              <h2 className="text-3xl font-mono font-bold mb-6 tracking-tight">Update LinkedIn Profile</h2>
              <p className="mb-6 font-mono text-gray-800">Want to update your profile with new LinkedIn data?</p>
              <LinkedinSubmit />
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
