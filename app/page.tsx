'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
                EMAIL
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-0 transition-all duration-200 focus:outline-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                }}
                onFocus={(e) => e.target.style.border = '1px solid rgba(233, 116, 81, 0.5)'}
                onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'}
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-0 transition-all duration-200 focus:outline-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                }}
                onFocus={(e) => e.target.style.border = '1px solid rgba(233, 116, 81, 0.5)'}
                onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'}
              />
            </motion.div>

            {/* Remember Me */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
                style={{
                  accentColor: 'var(--accent-coral)',
                }}
              />
              <label 
                htmlFor="rememberMe" 
                className="text-sm cursor-pointer select-none"
                style={{ color: 'var(--text-secondary)' }}
              >
                Remember me for 90 days
              </label>
            </motion.div>

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
              transition={{ delay: 0.6 }}
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-medium py-3 disabled:opacity-50 transition-all duration-200 hover:opacity-90"
                style={{ 
                  background: 'var(--accent-coral)',
                  borderRadius: '12px',
                  border: 'none'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </motion.div>
          </form>

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
