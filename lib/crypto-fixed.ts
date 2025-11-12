import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const algorithm = 'aes-256-cbc';

function getValidKey(): Buffer {
  let keyString = ENCRYPTION_KEY;
  
  // Ensure key is exactly 64 hex characters (32 bytes)
  if (keyString.length < 64) {
    keyString = keyString.padEnd(64, '0');
  } else if (keyString.length > 64) {
    keyString = keyString.slice(0, 64);
  }
  
  return Buffer.from(keyString, 'hex');
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
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = textParts.join(':');
  const key = getValidKey();
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}