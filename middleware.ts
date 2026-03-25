import { NextRequest, NextResponse } from 'next/server';

// Public routes that do NOT require authentication
const PUBLIC_ROUTES = ['/sign-in', '/sign-up'];
// Routes that authenticated users should not visit (redirect to dashboard)
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow Next.js internals and static assets to pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||   // Better-Auth API must be public
    pathname.startsWith('/api/inngest') || // Inngest webhook must be public
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Read the Better-Auth session cookie (name follows better-auth convention)
  const sessionCookie =
    request.cookies.get('better-auth.session_token') ??
    request.cookies.get('__Secure-better-auth.session_token');

  const isAuthenticated = Boolean(sessionCookie?.value);
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // Authenticated user visiting login/signup → go to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Unauthenticated user visiting protected route → go to login
  if (!isAuthenticated && !isPublicRoute) {
    const signInUrl = new URL('/sign-in', request.url);
    // Preserve intended destination for post-login redirect
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match everything except Next.js internals explicitly listed above
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
