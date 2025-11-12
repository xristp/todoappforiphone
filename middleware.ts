import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key'
);

const ALLOWED_EMAIL = process.env.ALLOWED_EMAIL || '';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('auth-token');

    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const verified = await jwtVerify(token.value, JWT_SECRET);
      const email = verified.payload.email as string;
      
      // Verify email matches allowed email
      if (email !== ALLOWED_EMAIL) {
        console.log(`Unauthorized access attempt from: ${email}`);
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      return NextResponse.next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
