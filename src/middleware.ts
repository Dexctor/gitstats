import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Handle API routes
    if (pathname.startsWith('/api/github')) {
      if (!token?.accessToken) {
        return new NextResponse(
          JSON.stringify({ error: 'Authentication required' }),
          { 
            status: 401, 
            headers: { 'content-type': 'application/json' }
          }
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/api/github/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
  ],
}; 