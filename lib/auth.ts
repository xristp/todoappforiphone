import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key'
);

const ALLOWED_EMAIL = 'polipaxrhstos@gmail.com';

// JWT token functions for session management
export async function createToken(email: string): Promise<string> {
  return await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('90d')
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (err) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');
  
  console.log('getSession - cookie check:', {
    hasToken: !!token,
    tokenLength: token?.value?.length || 0
  });
  
  if (!token) return null;
  
  const verified = await verifyToken(token.value);
  console.log('getSession - token verification:', {
    isValid: !!verified
  });
  
  return verified;
}

export async function requireAuth() {
  const session = await getSession();
  
  console.log('requireAuth - session check:', {
    hasSession: !!session,
    sessionData: session ? { email: session.email } : null
  });
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  // Verify email is whitelisted
  const email = session.email as string;
  if (email !== ALLOWED_EMAIL) {
    console.error(`Unauthorized access attempt from: ${email}`);
    throw new Error('Unauthorized: Email not whitelisted');
  }
  
  return session;
}
