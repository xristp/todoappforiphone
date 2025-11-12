# Security Measures

## Authentication Flow

### 1. **Firebase Google OAuth**
- Users must authenticate via Google OAuth through Firebase
- No email/password logins are possible
- Firebase handles all OAuth security

### 2. **Email Whitelist**
Only the email specified in `ALLOWED_EMAIL` environment variable is allowed access. This is enforced at multiple layers:

#### Layer 1: Login Route (`/api/auth/login`)
- Verifies Firebase ID token
- Checks email against whitelist
- Returns 403 if email not whitelisted
- Only creates session JWT if email matches

#### Layer 2: Middleware (`middleware.ts`)
- Validates JWT token on every dashboard request
- Extracts email from JWT payload
- Redirects to login if email doesn't match whitelist
- Runs before any page/API route is accessed

#### Layer 3: API Routes (`requireAuth()`)
- All protected API routes call `requireAuth()`
- Double-checks email against whitelist
- Throws error if email not whitelisted
- Used in: `/api/categories`, `/api/categories/[id]/todos`

#### Layer 4: Session Route (`/api/auth/session`)
- Validates session on frontend checks
- Returns 403 if email not whitelisted
- Prevents unauthorized session validation

## Security Features

### ✅ No Bypass Possible
1. **Cannot skip login**: Middleware redirects unauthenticated users
2. **Cannot fake email**: JWT is signed with secret key
3. **Cannot use different Google account**: Whitelist checked on login
4. **Cannot bypass Firebase**: Login route requires valid Firebase ID token
5. **Cannot access API directly**: All routes check authentication + whitelist

### ✅ Multiple Validation Layers
- Firebase token verification (cryptographically secure)
- JWT session tokens (signed with secret)
- Email whitelist at 4 different checkpoints
- Middleware protection on all routes

### ✅ Secure Credentials
- Firebase private key stored in environment variable
- JWT secret stored in environment variable
- No credentials in source code
- All secrets are in `.env.local` (not committed to git)

## Environment Variables Required

### Vercel Production
```
ALLOWED_EMAIL=your_email@gmail.com

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...

JWT_SECRET=...
ENCRYPTION_KEY=...
```

## Attack Vectors Prevented

❌ **Direct API Access**: Blocked by `requireAuth()` + whitelist
❌ **Session Hijacking**: JWT tokens are httpOnly cookies
❌ **Token Forgery**: JWT signed with server secret
❌ **Email Spoofing**: Firebase verifies Google OAuth
❌ **Unauthorized Google Account**: Whitelist enforced on login
❌ **Middleware Bypass**: Next.js middleware runs before all routes
❌ **CSRF**: httpOnly cookies + sameSite protection

## Summary
**Only the email in `ALLOWED_EMAIL` env var can:**
1. Complete Google OAuth
2. Pass login whitelist check
3. Get a valid JWT session token
4. Pass middleware validation
5. Access protected pages
6. Call protected API routes

No other user can bypass any of these steps.
