import crypto from 'crypto';

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, key] = combinedHash.split(':');
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH);
    const keyBuffer = Buffer.from(key, 'hex');
    return crypto.timingSafeEqual(derivedKey, keyBuffer);
  } catch {
    return false;
  }
}

function getSecret(): string {
  return process.env.APP_SESSION_SECRET || 'wildwood-woodland-enchanted-salt-9281749218471';
}

export function createToken(payload: Record<string, any>, expiresInHours = 72): string {
  const expiresAt = Date.now() + expiresInHours * 60 * 60 * 1000;
  const data = JSON.stringify({ ...payload, exp: expiresAt });
  const b64 = Buffer.from(data).toString('base64url');
  const signature = crypto.createHmac('sha256', getSecret()).update(b64).digest('base64url');
  return `${b64}.${signature}`;
}

export function verifyToken(token: string): { valid: boolean; payload?: any } {
  try {
    const [b64, signature] = token.split('.');
    if (!b64 || !signature) return { valid: false };

    const expectedSig = crypto.createHmac('sha256', getSecret()).update(b64).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return { valid: false };
    }

    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) {
      return { valid: false }; // Expired
    }

    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}
