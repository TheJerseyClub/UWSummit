import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)

    // Check if user has LinkedIn URL
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('linkedin_url')
        .eq('id', user.id)
        .single()

      // Redirect based on LinkedIn URL presence
      return NextResponse.redirect(
        new URL(profile?.linkedin_url ? '/' : '/profile', requestUrl.origin)
      )
    }
  }

  // Fallback to home page if something goes wrong
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
