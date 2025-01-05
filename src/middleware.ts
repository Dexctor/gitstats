import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Rediriger /profiles vers /profile
    if (pathname === '/profiles') {
      return NextResponse.redirect(new URL('/profile', req.url));
    }

    // Pour toutes les autres routes non définies, laisser Next.js gérer avec not-found.tsx
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
  }
);

export const config = {
  matcher: [
    '/api/github/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/profiles',
  ],
}; 