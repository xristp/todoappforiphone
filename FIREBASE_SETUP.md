# Firebase Google Sign-In Setup

## Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project" or select existing project
3. Name it (e.g., "todoappforiphone")

## Step 2: Enable Google Sign-In
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Toggle **Enable**
4. Set support email (your email)
5. Click **Save**

## Step 3: Register Web App
1. Go to **Project Settings** (gear icon) → **General**
2. Scroll to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register app with nickname (e.g., "Todo App")
5. Copy the `firebaseConfig` object

## Step 4: Get Service Account Key
1. Go to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Keep it secure!

## Step 5: Add Environment Variables

### Local (.env.local)
```env
# Firebase Client Config (from Step 3)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin SDK (from Step 4 JSON file)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_private_key_here\n-----END PRIVATE KEY-----\n"

# Keep these existing
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-very-long-and-random-123456789
ENCRYPTION_KEY=8c55860e5d4ef53afcaf88132ffc906a6f7ea584f535471b45a308ecf7f522cf
```

### Vercel (Project Settings → Environment Variables)
Add the same variables above to Vercel.

## Step 6: Deploy
```bash
git add .
git commit -m "Add Firebase Google sign-in"
git push
```

Vercel will auto-deploy. Test the Google sign-in button!

## How It Works
- User clicks "Continue with Google"
- Google popup appears for account selection
- Firebase Auth handles the OAuth flow
- We get an ID token from Firebase
- Backend verifies the token with Firebase Admin
- User is logged in! 🎉
