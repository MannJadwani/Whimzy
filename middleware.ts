import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to the home page without authentication
        if (pathname === '/') {
          return true
        }
        
        // Allow access to auth pages without authentication
        if (pathname.startsWith('/auth/')) {
          return true
        }
        
        // For all other protected pages, require authentication
        return !!token
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
)

export const config = {
  matcher: [
    // Only protect specific routes, not all routes
    '/builder/:path*',
    '/gallery/:path*',
    '/my-games/:path*',
    '/settings/:path*',
    '/pricing/:path*',
    '/dashboard/:path*'
  ],
}