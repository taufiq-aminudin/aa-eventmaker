import crypto from 'crypto';

// Secret key for HMAC token signing (falls back to secure ephemeral random key if not set)
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const QR_SECRET = process.env.QR_SECRET || crypto.randomBytes(32).toString('hex');

export type UserRole = 'ADMIN' | 'ORGANIZER' | 'CLIENT' | 'GUEST';
export type SubscriptionTier = 'starter' | 'professional' | 'agency';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  issuedAt: number;
  expiresAt: number;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorEmail: string;
  action: string;
  resource: string;
  ip: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  details?: string;
}

// -------------------------------------------------------------
// 1. Password Hashing (scrypt with unique salt + timing-safe comparison)
// -------------------------------------------------------------

export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return {
    salt,
    hash: derivedKey.toString('hex'),
  };
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    if (keyBuffer.length !== hashBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(keyBuffer, hashBuffer);
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// 2. Cryptographically Signed Session Tokens (HMAC-SHA256)
// -------------------------------------------------------------

export function signSessionToken(payload: Omit<TokenPayload, 'issuedAt' | 'expiresAt'>, expiresInSeconds = 7 * 24 * 60 * 60): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + expiresInSeconds;
  const fullPayload: TokenPayload = { ...payload, issuedAt, expiresAt };

  const payloadEncoded = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadEncoded).digest('base64url');

  return `${payloadEncoded}.${signature}`;
}

export function verifySessionToken(token: string): TokenPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadEncoded, signature] = parts;

  try {
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadEncoded).digest('base64url');

    const sigBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const payloadJson = Buffer.from(payloadEncoded, 'base64url').toString('utf8');
    const payload: TokenPayload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (payload.expiresAt < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

// -------------------------------------------------------------
// 3. Expiring Single-Use Password Reset Tokens
// -------------------------------------------------------------

interface ResetTokenRecord {
  email: string;
  expiresAt: number;
  used: boolean;
}

const passwordResetTokens = new Map<string, ResetTokenRecord>();

export function createPasswordResetToken(email: string, expiresInMinutes = 15): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;

  // Clean old tokens
  const now = Date.now();
  for (const [t, record] of passwordResetTokens.entries()) {
    if (record.expiresAt < now || record.used) {
      passwordResetTokens.delete(t);
    }
  }

  passwordResetTokens.set(token, {
    email: email.toLowerCase().trim(),
    expiresAt,
    used: false,
  });

  return token;
}

export function verifyAndConsumePasswordResetToken(token: string): string | null {
  const record = passwordResetTokens.get(token);
  if (!record) return null;

  if (record.used || record.expiresAt < Date.now()) {
    passwordResetTokens.delete(token);
    return null;
  }

  // Mark as used
  record.used = true;
  passwordResetTokens.delete(token);
  return record.email;
}

// -------------------------------------------------------------
// 4. QR Check-In Ticket Signature & Tamper Detection
// -------------------------------------------------------------

export function generateQrTicketSignature(eventId: string, guestId: string, checkInCode: string): string {
  return crypto
    .createHmac('sha256', QR_SECRET)
    .update(`${eventId}:${guestId}:${checkInCode.toUpperCase().trim()}`)
    .digest('hex')
    .slice(0, 16);
}

export function verifyQrTicketSignature(eventId: string, guestId: string, checkInCode: string, signature: string): boolean {
  try {
    const expected = generateQrTicketSignature(eventId, guestId, checkInCode);
    const a = Buffer.from(expected, 'hex');
    const b = Buffer.from(signature, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// 5. Rate Limiter (Sliding Window in Memory)
// -------------------------------------------------------------

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Periodic cleanup of stale entries every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, timestamps] of this.requests.entries()) {
        const filtered = timestamps.filter((t) => now - t < this.windowMs);
        if (filtered.length === 0) {
          this.requests.delete(key);
        } else {
          this.requests.set(key, filtered);
        }
      }
    }, 5 * 60 * 1000).unref();
  }

  public check(key: string): { allowed: boolean; remaining: number; retryAfterSec?: number } {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    const recent = timestamps.filter((t) => now - t < this.windowMs);

    if (recent.length >= this.maxRequests) {
      const oldest = recent[0];
      const retryAfterSec = Math.ceil((this.windowMs - (now - oldest)) / 1000);
      return { allowed: false, remaining: 0, retryAfterSec: Math.max(1, retryAfterSec) };
    }

    recent.push(now);
    this.requests.set(key, recent);
    return { allowed: true, remaining: this.maxRequests - recent.length };
  }
}

export const authRateLimiter = new RateLimiter(12, 5 * 60 * 1000); // 12 attempts / 5 mins
export const adminAuthRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts / 15 mins for Admin Console
export const aiRateLimiter = new RateLimiter(20, 60 * 1000); // 20 requests / 1 min
export const paymentRateLimiter = new RateLimiter(10, 5 * 60 * 1000); // 10 / 5 mins
export const uploadRateLimiter = new RateLimiter(25, 5 * 60 * 1000); // 25 / 5 mins
export const qrCheckinRateLimiter = new RateLimiter(60, 60 * 1000); // 60 / 1 min
export const blastRateLimiter = new RateLimiter(15, 5 * 60 * 1000); // 15 / 5 mins
export const generalApiLimiter = new RateLimiter(300, 60 * 1000); // 300 / 1 min

// -------------------------------------------------------------
// 6. Security Audit Logger (In-Memory Ring Buffer)
// -------------------------------------------------------------

class AuditLogger {
  private logs: SecurityAuditLog[] = [];
  private maxLogs = 1000;

  public log(entry: Omit<SecurityAuditLog, 'id' | 'timestamp'>) {
    const record: SecurityAuditLog = {
      id: `audit_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };

    this.logs.unshift(record);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
  }

  public getRecent(limit = 100): SecurityAuditLog[] {
    return this.logs.slice(0, limit);
  }
}

export const auditLogger = new AuditLogger();

// -------------------------------------------------------------
// 7. Strict File Upload & Media Validation
// -------------------------------------------------------------

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/webm',
  'application/pdf',
]);

const BANNED_EXTENSIONS = new Set([
  '.exe', '.bat', '.cmd', '.sh', '.php', '.phtml', '.py', '.pl',
  '.js', '.mjs', '.cjs', '.ts', '.html', '.htm', '.xhtml', '.vbs',
  '.scr', '.jar', '.com', '.msi', '.dll', '.bin', '.cgi', '.svg',
]);

export interface UploadValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
  detectedMime?: string;
}

export function validateUploadedBuffer(
  buffer: Buffer,
  declaredMimeType: string,
  originalFilename: string,
  maxSizeBytes: number = 10 * 1024 * 1024
): UploadValidationResult {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'File data is empty.' };
  }

  if (buffer.length > maxSizeBytes) {
    const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `Ukuran file melebihi batas maksimal (${maxMb}MB).` };
  }

  const cleanMime = declaredMimeType.toLowerCase().trim();
  if (!ALLOWED_MIME_TYPES.has(cleanMime)) {
    return { valid: false, error: `Tipe file '${cleanMime}' tidak diizinkan. Hanya JPEG, PNG, WebP, MP4, WebM, dan PDF yang didukung.` };
  }

  // Check file extension
  const ext = (originalFilename.slice(originalFilename.lastIndexOf('.')) || '').toLowerCase();
  if (BANNED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `Ekstensi file '${ext}' dilarang demi keamanan sistem.` };
  }

  // Magic bytes inspection
  // JPEG: FF D8 FF
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  // WebP: RIFF .... WEBP
  // PDF: %PDF
  // MP4: .... ftyp
  let matchesMagic = false;

  if (cleanMime === 'image/jpeg' || cleanMime === 'image/jpg') {
    matchesMagic = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  } else if (cleanMime === 'image/png') {
    matchesMagic =
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a;
  } else if (cleanMime === 'image/webp') {
    matchesMagic =
      buffer.length >= 12 &&
      buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP';
  } else if (cleanMime === 'application/pdf') {
    matchesMagic = buffer.length >= 4 && buffer.toString('ascii', 0, 4) === '%PDF';
  } else if (cleanMime === 'video/mp4' || cleanMime === 'video/webm') {
    // Check for MP4 ftyp marker in first 32 bytes or WebM 1A 45 DF A3
    const headerStr = buffer.toString('binary', 0, Math.min(64, buffer.length));
    matchesMagic =
      headerStr.includes('ftyp') ||
      (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3);
  }

  if (!matchesMagic) {
    return { valid: false, error: 'Format biner file tidak cocok dengan tipe MIME yang dideklarasikan.' };
  }

  // Generate safe non-colliding randomized filename
  const safeExt = ext && !BANNED_EXTENSIONS.has(ext) ? ext : (cleanMime === 'image/jpeg' ? '.jpg' : cleanMime === 'image/png' ? '.png' : cleanMime === 'image/webp' ? '.webp' : cleanMime === 'video/mp4' ? '.mp4' : '.bin');
  const sanitizedFilename = `upload_${Date.now()}_${crypto.randomUUID()}${safeExt}`;

  return {
    valid: true,
    sanitizedFilename,
    detectedMime: cleanMime,
  };
}

// -------------------------------------------------------------
// 8. HTML Escaping & Input Sanitization
// -------------------------------------------------------------

export function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeInputString(str: any, maxLength = 250): string {
  if (typeof str !== 'string') return '';
  // Strip control characters
  return str.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, maxLength);
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const clean = phone.replace(/[\s\-().]/g, '');
  return /^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(clean) || /^\+?[1-9][0-9]{7,14}$/.test(clean);
}
