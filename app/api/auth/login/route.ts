import { NextResponse } from 'next/server';
import { verifyPassword, createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Login route - uses environment variables from Vercel
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Get environment variables from process.env
    const validEmail = process.env.USER_EMAIL || 'bestgr@example.com';
    const validPasswordHash = process.env.USER_PASSWORD_HASH;

    console.log('Environment check:', {
      hasEmail: !!validEmail,
      email: validEmail,
      hasHash: !!validPasswordHash,
      hashLength: validPasswordHash?.length
    });

    if (!validPasswordHash) {
      console.error('USER_PASSWORD_HASH not found in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify credentials
    if (email !== validEmail) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, validPasswordHash);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await createToken(email);

    // Set cookie - keep logged in for 90 days
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 90, // 90 days
      path: '/',
    });

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
