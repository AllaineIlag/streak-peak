import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh the session if needed
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  
  // Define public routes that don't require authentication
  const isPublicRoute = 
    pathname === '/' || 
    pathname.startsWith('/login') || 
    pathname.startsWith('/auth')
  
  // If no user is logged in, redirect them to the login page for any protected route
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  // If a user is already logged in and tries to access /login, redirect to /dashboard
  if (user && pathname.startsWith('/login')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
  }

  return supabaseResponse
}
