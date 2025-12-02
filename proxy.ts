import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// check if user is authorized
export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.redirect(new URL('/login', request.url))
}
 
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/:path*',
}