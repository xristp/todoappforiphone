// Environment configuration
// This ensures environment variables are loaded correctly
import { config } from 'dotenv';
import path from 'path';

// Load .env.local file
config({ path: path.join(process.cwd(), '.env.local') });

export const env = {
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret',
  USER_EMAIL: process.env.USER_EMAIL || 'bestgr@example.com',
  USER_PASSWORD_HASH: process.env.USER_PASSWORD_HASH || '',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '',
};
