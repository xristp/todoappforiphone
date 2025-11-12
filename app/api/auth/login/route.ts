import { NextResponse } from 'next/server';
import { verifyPassword, createToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';

async function loadEnvVars() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = await fs.readFile(envPath, 'utf8');
    const vars: Record<string, string> = {};
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          vars[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
    
    return vars;
  } catch (error) {
    console.error('Error loading .env.local:', error);
    return {};
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Load environment variables directly
    const envVars = await loadEnvVars();
    const validEmail = envVars.USER_EMAIL || 'bestgr@example.com';
    const validPasswordHash = envVars.USER_PASSWORD_HASH;

    console.log('Direct env check:', {
      hasEmail: !!validEmail,
      email: validEmail,
      hasHash: !!validPasswordHash,
      hashLength: validPasswordHash?.length,
      allVars: Object.keys(envVars)
    });

    if (!validPasswordHash) {
      console.error('USER_PASSWORD_HASH not found in .env.local');
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
