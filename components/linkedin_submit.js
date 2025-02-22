'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/contexts/AuthContext'

export default function LinkedinSubmit() {
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [message, setMessage] = useState({ text: '', isError: false })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push('/signin')
    }
  }, [user, router])

  const checkWaterlooAffiliation = (education) => {
    if (!education || !Array.isArray(education)) return false;
    return education.some(edu => 
      edu.school?.toLowerCase().includes('waterloo') ||
      edu.field_of_study?.toLowerCase().includes('waterloo') ||
      edu.degree_name?.toLowerCase().includes('waterloo')
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ text: '', isError: false })
    setLoading(true)

    try {
      const response = await fetch('/api/scrape-linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: linkedinUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn data')
      }

      const profileData = await response.json()

      // Check for Waterloo affiliation
      if (!checkWaterlooAffiliation(profileData.education)) {
        throw new Error('Profile must have Waterloo education to register')
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          linkedin_url: linkedinUrl,
          full_name: profileData.full_name,
          profile_pic_url: profileData.profile_pic_url,
          education: profileData.education,
          experiences: profileData.experiences,
          volunteer_work: profileData.volunteer_work,
          accomplishments: profileData.accomplishments,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      
      setMessage({ text: 'Profile updated successfully!', isError: false })
      setTimeout(() => {
        router.push('/profile')
      }, 1000)
    } catch (error) {
      setMessage({ text: error.message, isError: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
        {message.text && (
          <div className={`p-3 rounded-md ${
            message.isError 
              ? 'bg-red-100 text-red-700 border border-red-300' 
              : 'bg-green-100 text-green-700 border border-green-300'
          }`}>
            {message.text}
          </div>
        )}
        <input
          type="url"
          placeholder="LinkedIn URL"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          className="w-full p-2 border border-gray-300"
          required
          disabled={loading}
        />
        <button
          type="submit"
          className={`w-full p-2 bg-black text-white hover:bg-gray-800 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Loading Profile...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
