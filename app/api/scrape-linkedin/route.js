import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role for direct storage access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function downloadAndUploadImage(url, type, identifier) {
  try {
    const response = await fetch(url)
    if (!response.ok) return null
    
    const buffer = await response.arrayBuffer()
    const fileName = `${type}/${identifier}-${Date.now()}.png`

    const { data, error } = await supabase.storage
      .from('logos')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: true
      })

    if (error) {
      console.error('Error uploading image:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Error processing image:', error)
    return null
  }
}

export async function POST(request) {
  const { url } = await request.json()
  
  try {
    // Convert params to URLSearchParams
    const params = new URLSearchParams({
      url: url,
      use_cache: 'if-recent'
    })

    const response = await fetch(
      `https://nubela.co/proxycurl/api/v2/linkedin?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.PROXYCURL_API_KEY}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Proxycurl API error: ${errorData}`)
    }

    const data = await response.json()
    
    // Store profile picture
    let permanentProfilePicUrl = null
    if (data.profile_pic_url) {
      permanentProfilePicUrl = await downloadAndUploadImage(
        data.profile_pic_url,
        'profile-pics',
        data.full_name.replace(/\s+/g, '-').toLowerCase()
      )
    }

    // Process and store company logos
    const experiences = await Promise.all(
      (data.experiences || []).map(async (exp) => {
        let permanentLogoUrl = null
        if (exp.logo_url) {
          permanentLogoUrl = await downloadAndUploadImage(
            exp.logo_url,
            'company-logos',
            exp.company.replace(/\s+/g, '-').toLowerCase()
          )
        }
        return {
          ...exp,
          company_logo_url: permanentLogoUrl
        }
      })
    )

    return NextResponse.json({
      full_name: data.full_name,
      profile_pic_url: permanentProfilePicUrl || data.profile_pic_url,
      education: data.education,
      experiences: experiences,
      volunteer_work: data.volunteer_work,
      accomplishments: data.accomplishments
    })
  } catch (error) {
    console.error('Scraping error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}