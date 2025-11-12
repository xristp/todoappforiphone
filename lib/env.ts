// Environment configuration
// This ensures environment variables are loaded correctly
import { config } from 'dotenv';
import path from 'path';

// Load .env.local file
config({ path: path.join(process.cwd(), '.env.local') });

export const env = {
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '',
  // Firebase config is loaded directly via NEXT_PUBLIC_ env vars
};
