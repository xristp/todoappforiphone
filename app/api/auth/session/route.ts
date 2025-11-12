import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const ALLOWED_EMAIL = 'polipaxrhstos@gmail.com';

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  
  // Verify email is whitelisted
  const email = session.email as string;
  if (email !== ALLOWED_EMAIL) {
    console.error(`Unauthorized session check from: ${email}`);
    return NextResponse.json({ authenticated: false }, { status: 403 });
  }
  
  return NextResponse.json({ authenticated: true, user: session });
}
