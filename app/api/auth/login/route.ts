import { NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Login route - simplified without hash
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Get environment variables from process.env (base64 encoded for obfuscation)
    const validEmail = process.env.USER_EMAIL ? Buffer.from(process.env.USER_EMAIL, 'base64').toString('utf-8') : 'bestgr@example.com';
    const validPassword = process.env.USER_PASSWORD ? Buffer.from(process.env.USER_PASSWORD, 'base64').toString('utf-8') : 'test123';

    console.log('Environment check:', {
      hasEmail: !!validEmail,
      email: validEmail,
      hasPassword: !!validPassword,
      receivedEmail: email,
      receivedPassword: password,
      emailMatch: email === validEmail,
      passwordMatch: password === validPassword
    });

    // Verify credentials - direct string comparison
    if (email !== validEmail || password !== validPassword) {
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
