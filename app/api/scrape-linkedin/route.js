import { NextResponse } from 'next/server'

export async function POST(request) {
  const { url } = await request.json()
  
  try {
    // Convert params to URLSearchParams
    const params = new URLSearchParams({
      url: url,
      use_cache: 'if-present'
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
    
    // Extract only the fields we want
    return NextResponse.json({
      full_name: data.full_name,
      profile_pic_url: data.profile_pic_url,
      education: data.education,
      experiences: data.experiences,
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