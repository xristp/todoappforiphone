'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebaseClient';
import { signInWithPopup } from 'firebase/auth';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // Send token to our API to create session
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Sign in cancelled or failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bento-card p-8" style={{ borderRadius: '20px', maxWidth: '400px', margin: '0 auto' }}>
          {/* Logo/Header */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-10"
          >
            <motion.div 
              className="inline-block p-4 mb-6"
              style={{
                background: 'rgba(233, 116, 81, 0.15)',
                border: '1px solid rgba(233, 116, 81, 0.2)',
                borderRadius: '16px',
              }}
            >
              <Lock className="w-10 h-10" style={{ color: 'var(--accent-coral)' }} />
            </motion.div>
            <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              TaskMaster
            </h1>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
              Sign in to access your workspace
            </p>
          </motion.div>

          {/* Google Sign In */}
          <div className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg"
                style={{
                  background: 'rgba(255, 59, 48, 0.1)',
                  border: '1px solid rgba(255, 59, 48, 0.2)'
                }}
              >
                <p className="text-sm text-center" style={{ color: '#FF3B30' }}>{error}</p>
              </motion.div>
            )}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full font-medium py-3 px-4 disabled:opacity-50 transition-all duration-200 hover:opacity-90 flex items-center justify-center gap-3"
                style={{ 
                  background: 'white',
                  color: '#1f2937',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4"/>
                  <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
                  <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                  <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
                </svg>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </button>
            </motion.div>
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center"
          >
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Secure personal workspace with encrypted data
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
