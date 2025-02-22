'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push('/signin')
      return
    }

    async function fetchProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(data)
      setLoading(false)
    }

    fetchProfile()
  }, [user, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen pt-20 px-4 max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          {profile?.profile_pic_url && (
            <Image
              src={profile.profile_pic_url}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{profile?.full_name}</h1>
            <a 
              href={profile?.linkedin_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View LinkedIn Profile
            </a>
          </div>
        </div>

        {/* Education Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Education</h2>
          <div className="space-y-4">
            {profile?.education?.map((edu, index) => (
              <div key={index} className="border-l-4 border-black pl-4">
                <h3 className="font-bold">{edu.school}</h3>
                <p className="text-gray-600">{edu.degree_name}</p>
                <p className="text-gray-600">{edu.field_of_study}</p>
                <p className="text-sm text-gray-500">{edu.starts_at?.year} - {edu.ends_at?.year || 'Present'}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Experience</h2>
          <div className="space-y-4">
            {profile?.experiences?.map((exp, index) => (
              <div key={index} className="border-l-4 border-black pl-4">
                <div className="flex items-center gap-4">
                  {exp.company_logo_url && (
                    <Image
                      src={exp.company_logo_url}
                      alt={`${exp.company} logo`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="font-bold">{exp.title}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {exp.starts_at?.year} - {exp.ends_at?.year || 'Present'}
                </p>
                <p className="mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Volunteer Work Section */}
        {profile?.volunteer_work && profile.volunteer_work.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Volunteer Work</h2>
            <div className="space-y-4">
              {profile.volunteer_work.map((vol, index) => (
                <div key={index} className="border-l-4 border-black pl-4">
                  <h3 className="font-bold">{vol.title}</h3>
                  <p className="text-gray-600">{vol.company}</p>
                  <p className="text-sm text-gray-500">
                    {vol.starts_at?.year} - {vol.ends_at?.year || 'Present'}
                  </p>
                  <p className="mt-2">{vol.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Accomplishments Section */}
        {profile?.accomplishments && profile.accomplishments.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Accomplishments</h2>
            <div className="space-y-4">
              {profile.accomplishments.map((acc, index) => (
                <div key={index} className="border-l-4 border-black pl-4">
                  <h3 className="font-bold">{acc.title}</h3>
                  <p className="mt-2">{acc.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
