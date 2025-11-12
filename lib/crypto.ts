  import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const algorithm = 'aes-256-cbc';

function getValidKey(): Buffer {
  // Ensure we have a 32-byte key for AES-256
  if (ENCRYPTION_KEY.length >= 64) {
    // If hex string, convert first 64 chars (32 bytes)
    return Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');
  } else {
    // If regular string, hash it to get consistent 32 bytes
    return crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
  }
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = getValidKey();
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift()!, 'hex');
  const encryptedText = parts.join(':');
  const key = getValidKey();
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
