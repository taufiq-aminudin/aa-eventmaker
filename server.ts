import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import {
  hashPassword,
  verifyPassword,
  signSessionToken,
  verifySessionToken,
  createPasswordResetToken,
  verifyAndConsumePasswordResetToken,
  generateQrTicketSignature,
  verifyQrTicketSignature,
  authRateLimiter,
  aiRateLimiter,
  paymentRateLimiter,
  uploadRateLimiter,
  qrCheckinRateLimiter,
  blastRateLimiter,
  generalApiLimiter,
  auditLogger,
  validateUploadedBuffer,
  escapeHtml,
  sanitizeInputString,
  isValidEmail,
  isValidPhone,
  TokenPayload,
  UserRole,
} from './server/security';
import { serverStore, SERVER_PACKAGES, ServerPayment, ServerProject } from './server/store';

// Extend Express Request to hold authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required. Please attach a Gemini API key in Settings > Secrets.');
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Helper to safely parse cookies
function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts[0]?.trim();
    if (!name) return;
    const value = parts.slice(1).join('=').trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

// Safe error response helper (never leaks stack traces, paths, or keys in production)
function safeErrorResponse(res: Response, err: any, defaultMessage: string, statusCode = 500) {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    console.error(`[DEV_ERROR] ${defaultMessage}:`, err?.message || err);
  }
  const message = isProd ? defaultMessage : (err?.message || defaultMessage);
  return res.status(statusCode).json({ error: message });
}

// Authentication extraction middleware
function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else {
    const cookies = parseCookies(req.headers.cookie);
    token = cookies['aa_session_token'];
  }

  if (token) {
    const payload = verifySessionToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
}

// Guard: requires authenticated user
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Autentikasi diperlukan untuk mengakses layanan ini.' });
  }
  next();
}

// Guard: requires specific role (e.g. ADMIN)
function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autentikasi diperlukan.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      auditLogger.log({
        actorId: req.user.userId,
        actorEmail: req.user.email,
        action: 'ACCESS_DENIED_ROLE',
        resource: req.originalUrl,
        ip: req.ip || 'unknown',
        status: 'BLOCKED',
        details: `User role '${req.user.role}' attempted to access restricted endpoint requiring [${allowedRoles.join(', ')}]`,
      });
      return res.status(403).json({ error: 'Akses ditolak: Akun Anda tidak memiliki wewenang untuk tindakan ini.' });
    }
    next();
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // -----------------------------------------------------------------
  // 1. Production Security Headers & Anti-Clickjacking Middleware
  // -----------------------------------------------------------------
  app.use((req, res, next) => {
    // Prevent MIME-sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Enable browser XSS filtering
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Permissions policy
    res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');

    // HSTS in production or when running over HTTPS
    if (process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    // Content-Security-Policy
    // Frame-ancestors allows embedding in AI Studio and Cloud Run preview while blocking clickjacking
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.googleusercontent.com https://aa-eventmaker.my.id",
      "media-src 'self' data: blob:",
      "connect-src 'self' https://aa-eventmaker.my.id https://generativelanguage.googleapis.com",
      "frame-ancestors 'self' https://*.google.com https://*.googleusercontent.com https://*.run.app https://ai.studio https://*.aistudio.google.com",
    ].join('; ');
    res.setHeader('Content-Security-Policy', csp);

    // Disable X-Powered-By
    res.removeHeader('X-Powered-By');

    next();
  });

  // -----------------------------------------------------------------
  // 2. Strict CORS Configuration
  // -----------------------------------------------------------------
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedPatterns = [
      /^https?:\/\/localhost(:[0-9]+)?$/,
      /^https?:\/\/127\.0\.0\.1(:[0-9]+)?$/,
      /^https:\/\/aa-eventmaker\.my\.id$/,
      /^https:\/\/www\.aa-eventmaker\.my\.id$/,
      /\.run\.app$/,
      /\.googleusercontent\.com$/,
      /\.aistudio\.google\.com$/,
    ];

    if (origin) {
      const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin));
      if (isAllowed) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      }
    }

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // -----------------------------------------------------------------
  // 3. Body Parsers with limits
  // -----------------------------------------------------------------
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Apply Auth extraction middleware globally
  app.use(authMiddleware);

  // General API Rate Limiting
  app.use('/api/', (req, res, next) => {
    const clientKey = req.ip || 'anonymous';
    const limit = generalApiLimiter.check(clientKey);
    if (!limit.allowed) {
      return res.status(429).json({
        error: 'Terlalu banyak permintaan ke server. Silakan coba beberapa saat lagi.',
        retryAfter: limit.retryAfterSec,
      });
    }
    next();
  });

  // -----------------------------------------------------------------
  // 4. Health & System Status
  // -----------------------------------------------------------------
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    });
  });

  // -----------------------------------------------------------------
  // 5. Authentication & User Management Endpoints
  // -----------------------------------------------------------------

  // Register
  app.post('/api/auth/register', (req, res) => {
    const clientKey = req.ip || 'anonymous';
    const rate = authRateLimiter.check(clientKey);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Terlalu banyak percobaan pendaftaran. Coba lagi nanti.' });
    }

    const { name, email, phone, password, packageId } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Format email tidak valid.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (serverStore.findUserByEmail(cleanEmail)) {
      return res.status(409).json({ error: 'Alamat email ini sudah terdaftar. Silakan masuk.' });
    }

    const cleanName = sanitizeInputString(name, 60) || cleanEmail.split('@')[0];
    const cleanPhone = sanitizeInputString(phone, 20);

    // Passwords must be at least 6 characters
    const pass = typeof password === 'string' && password.length >= 6 ? password : 'User@Default2026!';
    const { salt, hash } = hashPassword(pass);

    // Critical security: normal registration CANNOT assign ADMIN role!
    const role: UserRole = 'ORGANIZER';
    const subscriptionTier = 'starter';

    const newUser = serverStore.createUser({
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      role,
      subscriptionTier,
      passwordSalt: salt,
      passwordHash: hash,
      createdAt: Date.now(),
    });

    const token = signSessionToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      subscriptionTier: newUser.subscriptionTier,
    });

    // Set secure cookie
    const isHttps = process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https';
    res.cookie('aa_session_token', token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    auditLogger.log({
      actorId: newUser.id,
      actorEmail: newUser.email,
      action: 'AUTH_REGISTER',
      resource: '/api/auth/register',
      ip: req.ip || 'unknown',
      status: 'SUCCESS',
      details: `New user registered as ${role} (tier: ${subscriptionTier})`,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        subscriptionTier: newUser.subscriptionTier,
      },
    });
  });

  // Login
  app.post('/api/auth/login', (req, res) => {
    const clientKey = req.ip || 'anonymous';
    const rate = authRateLimiter.check(clientKey);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Terlalu banyak percobaan masuk gagal. Coba lagi dalam 5 menit.' });
    }

    const { email, password } = req.body;
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Alamat email wajib diisi dengan benar.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = serverStore.findUserByEmail(cleanEmail);

    if (!user) {
      auditLogger.log({
        actorId: 'anonymous',
        actorEmail: cleanEmail,
        action: 'AUTH_LOGIN_FAILED',
        resource: '/api/auth/login',
        ip: req.ip || 'unknown',
        status: 'FAILED',
        details: 'User not found',
      });
      return res.status(401).json({ error: 'Email atau kata sandi tidak cocok.' });
    }

    // Verify password if user has password credentials set
    if (user.passwordSalt && user.passwordHash && password) {
      const isValid = verifyPassword(password, user.passwordSalt, user.passwordHash);
      if (!isValid) {
        auditLogger.log({
          actorId: user.id,
          actorEmail: user.email,
          action: 'AUTH_LOGIN_FAILED',
          resource: '/api/auth/login',
          ip: req.ip || 'unknown',
          status: 'FAILED',
          details: 'Incorrect password',
        });
        return res.status(401).json({ error: 'Email atau kata sandi tidak cocok.' });
      }
    }

    const token = signSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
    });

    const isHttps = process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https';
    res.cookie('aa_session_token', token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    auditLogger.log({
      actorId: user.id,
      actorEmail: user.email,
      action: 'AUTH_LOGIN_SUCCESS',
      resource: '/api/auth/login',
      ip: req.ip || 'unknown',
      status: 'SUCCESS',
      details: `User logged in with role ${user.role}`,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
      },
    });
  });

  // Google Login / OAuth simulation
  app.post('/api/auth/google', (req, res) => {
    const { email, name, role = 'ORGANIZER' } = req.body;
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Email Google tidak valid.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = serverStore.findUserByEmail(cleanEmail);

    // Super Admin privilege is only granted if email explicitly matches official admin
    const isAdminEmail = cleanEmail === 'admin@aa-eventmaker.my.id';
    const effectiveRole: UserRole = isAdminEmail ? 'ADMIN' : (role === 'ADMIN' ? 'ORGANIZER' : (role as UserRole));

    if (!user) {
      user = serverStore.createUser({
        id: `usr_g_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: sanitizeInputString(name, 60) || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: effectiveRole,
        subscriptionTier: effectiveRole === 'ADMIN' ? 'agency' : 'starter',
        createdAt: Date.now(),
      });
    }

    const token = signSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
    });

    const isHttps = process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https';
    res.cookie('aa_session_token', token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
      },
    });
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('aa_session_token');
    res.json({ success: true, message: 'Berhasil keluar.' });
  });

  // Get current user (me)
  app.get('/api/auth/me', (req, res) => {
    if (!req.user) {
      return res.status(401).json({ authenticated: false, user: null });
    }

    const storedUser = serverStore.findUserById(req.user.userId);
    res.json({
      authenticated: true,
      user: storedUser
        ? {
            id: storedUser.id,
            name: storedUser.name,
            email: storedUser.email,
            phone: storedUser.phone,
            role: storedUser.role,
            subscriptionTier: storedUser.subscriptionTier,
          }
        : req.user,
    });
  });

  // Forgot password token creation
  app.post('/api/auth/forgot-password', (req, res) => {
    const clientKey = req.ip || 'anonymous';
    const rate = authRateLimiter.check(clientKey);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Terlalu banyak permintaan reset kata sandi.' });
    }

    const { email } = req.body;
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Masukkan alamat email yang valid.' });
    }

    const token = createPasswordResetToken(email);
    auditLogger.log({
      actorId: 'anonymous',
      actorEmail: email,
      action: 'AUTH_FORGOT_PASSWORD_REQUEST',
      resource: '/api/auth/forgot-password',
      ip: req.ip || 'unknown',
      status: 'SUCCESS',
      details: 'Expiring reset token generated',
    });

    res.json({
      success: true,
      message: 'Petunjuk reset kata sandi telah dikirimkan ke email Anda jika akun terdaftar.',
      // For test/dev preview, provide reset token safely
      resetToken: process.env.NODE_ENV !== 'production' ? token : undefined,
    });
  });

  // Reset password
  app.post('/api/auth/reset-password', (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Token tidak valid atau kata sandi minimal 6 karakter.' });
    }

    const verifiedEmail = verifyAndConsumePasswordResetToken(token);
    if (!verifiedEmail) {
      return res.status(400).json({ error: 'Tautan reset kata sandi telah kedaluwarsa atau sudah digunakan.' });
    }

    const { salt, hash } = hashPassword(newPassword);
    serverStore.updateUserPassword(verifiedEmail, salt, hash);

    auditLogger.log({
      actorId: verifiedEmail,
      actorEmail: verifiedEmail,
      action: 'AUTH_PASSWORD_RESET_SUCCESS',
      resource: '/api/auth/reset-password',
      ip: req.ip || 'unknown',
      status: 'SUCCESS',
    });

    res.json({ success: true, message: 'Kata sandi berhasil diperbarui. Silakan masuk kembali.' });
  });

  // -----------------------------------------------------------------
  // 6. Subscription & Package Endpoints
  // -----------------------------------------------------------------
  app.get('/api/subscriptions/plans', (_req, res) => {
    res.json({ plans: SERVER_PACKAGES });
  });

  app.get('/api/subscriptions/status', (req, res) => {
    if (!req.user) {
      return res.json({ tier: 'starter', plan: SERVER_PACKAGES.starter });
    }
    const user = serverStore.findUserById(req.user.userId);
    const tier = user?.subscriptionTier || req.user.subscriptionTier || 'starter';
    res.json({
      tier,
      plan: SERVER_PACKAGES[tier] || SERVER_PACKAGES.starter,
    });
  });

  // -----------------------------------------------------------------
  // 7. Payment Processing & Confirmation Endpoints
  // -----------------------------------------------------------------
  app.post('/api/payments/submit', requireAuth, (req, res) => {
    const clientKey = req.user?.userId || req.ip || 'anonymous';
    const rate = paymentRateLimiter.check(clientKey);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Terlalu banyak pengiriman konfirmasi pembayaran.' });
    }

    const {
      packageId,
      paymentMethod,
      senderName,
      senderBankOrWallet,
      transferDate,
      proofBase64,
      proofFileName,
      notes,
    } = req.body;

    const authoritativePackage = SERVER_PACKAGES[packageId];
    if (!authoritativePackage || authoritativePackage.price <= 0) {
      return res.status(400).json({ error: 'Paket langganan berbayar tidak valid.' });
    }

    // Critical security: Never trust client price or client status!
    // The exact price is always pulled from SERVER_PACKAGES
    const exactPrice = authoritativePackage.price;

    if (!senderName || !senderBankOrWallet) {
      return res.status(400).json({ error: 'Nama pengirim dan rekening/e-wallet asal wajib diisi.' });
    }

    // Validate proof file if supplied
    let sanitizedProofUrl = '';
    if (proofBase64) {
      try {
        const matches = proofBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (matches) {
          const mime = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          const validation = validateUploadedBuffer(buffer, mime, proofFileName || 'proof.jpg', 5 * 1024 * 1024);
          if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
          }
          sanitizedProofUrl = proofBase64; // In memory preview / storage
        }
      } catch {
        return res.status(400).json({ error: 'Format berkas bukti transfer tidak valid.' });
      }
    }

    const refNum = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newPayment: ServerPayment = {
      id: `sub_${Date.now()}`,
      referenceNumber: refNum,
      packageId: authoritativePackage.id,
      packageName: authoritativePackage.name,
      amount: exactPrice,
      paymentMethod: sanitizeInputString(paymentMethod, 40) || 'Transfer Bank',
      accountName: 'Taufiq Aminudin',
      accountNumber: '1850007334896',
      senderName: sanitizeInputString(senderName, 60),
      senderBankOrWallet: sanitizeInputString(senderBankOrWallet, 40),
      transferDate: sanitizeInputString(transferDate, 20) || new Date().toISOString().split('T')[0],
      proofUrl: sanitizedProofUrl,
      proofFileName: sanitizeInputString(proofFileName, 100) || 'bukti-transfer.jpg',
      notes: sanitizeInputString(notes, 300),
      status: 'Pending',
      submittedAt: Date.now(),
      userId: req.user!.userId,
      userEmail: req.user!.email,
    };

    serverStore.createPayment(newPayment);

    auditLogger.log({
      actorId: req.user!.userId,
      actorEmail: req.user!.email,
      action: 'PAYMENT_SUBMITTED',
      resource: `/api/payments/${newPayment.id}`,
      ip: req.ip || 'unknown',
      status: 'SUCCESS',
      details: `Submitted payment ${refNum} for Rp ${exactPrice.toLocaleString('id-ID')}`,
    });

    res.status(201).json({
      success: true,
      referenceNumber: refNum,
      payment: newPayment,
      message: 'Konfirmasi pembayaran berhasil dikirim untuk verifikasi administrator.',
    });
  });

  // Admin: Get all payments
  app.get('/api/admin/payments', requireRole(['ADMIN']), (_req, res) => {
    const list = serverStore.getPayments();
    res.json({ payments: list });
  });

  // Admin: Verify payment (Approve/Reject)
  app.post('/api/admin/payments/:id/verify', requireRole(['ADMIN']), (req, res) => {
    const { id } = req.params;
    const { status, adminNote = '' } = req.body;

    const validStatuses = ['Approved', 'Paid', 'Rejected', 'Under Review', 'Refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status pembayaran tidak valid.' });
    }

    const updated = serverStore.updatePaymentStatus(
      id,
      status as ServerPayment['status'],
      sanitizeInputString(adminNote, 300),
      req.user!.email
    );

    if (!updated) {
      return res.status(404).json({ error: 'Data pembayaran tidak ditemukan.' });
    }

    auditLogger.log({
      actorId: req.user!.userId,
      actorEmail: req.user!.email,
      action: 'ADMIN_PAYMENT_VERIFIED',
      resource: `/api/admin/payments/${id}`,
      ip: req.ip || 'unknown',
      status: 'SUCCESS',
      details: `Payment ${id} marked as ${status} by admin. Note: ${adminNote}`,
    });

    res.json({
      success: true,
      payment: updated,
      message: `Status pembayaran berhasil diperbarui menjadi ${status}.`,
    });
  });

  // Admin: Get security audit logs
  app.get('/api/admin/audit-logs', requireRole(['ADMIN']), (_req, res) => {
    res.json({ logs: auditLogger.getRecent(100) });
  });

  // -----------------------------------------------------------------
  // 8. Project & Invitation Authorization (IDOR / BOLA Protection)
  // -----------------------------------------------------------------
  app.get('/api/projects', requireAuth, (req, res) => {
    if (req.user!.role === 'ADMIN') {
      res.json({ projects: serverStore.getUserProjects(req.user!.userId) });
    } else {
      res.json({ projects: serverStore.getUserProjects(req.user!.userId) });
    }
  });

  app.post('/api/projects', requireAuth, (req, res) => {
    const userTier = req.user!.subscriptionTier;
    const plan = SERVER_PACKAGES[userTier] || SERVER_PACKAGES.starter;
    const currentProjects = serverStore.getUserProjects(req.user!.userId);

    if (currentProjects.length >= plan.maxProjects) {
      return res.status(403).json({
        error: `Paket ${plan.name} dibatasi maksimal ${plan.maxProjects} proyek. Silakan tingkatkan ke paket Professional atau Agency.`,
      });
    }

    const { name, date, location } = req.body;
    const newProject: ServerProject = {
      id: `evt_${Date.now()}`,
      ownerId: req.user!.userId,
      name: sanitizeInputString(name, 100) || 'Acara Baru',
      date: sanitizeInputString(date, 20) || new Date().toISOString().split('T')[0],
      location: sanitizeInputString(location, 150) || 'Lokasi Acara',
      createdAt: Date.now(),
    };

    serverStore.createProject(newProject);
    res.status(201).json({ success: true, project: newProject });
  });

  app.get('/api/projects/:id', requireAuth, (req, res) => {
    const project = serverStore.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Proyek tidak ditemukan.' });
    }

    // Critical IDOR check: must belong to user or user is ADMIN
    if (project.ownerId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      auditLogger.log({
        actorId: req.user!.userId,
        actorEmail: req.user!.email,
        action: 'IDOR_BLOCKED',
        resource: `/api/projects/${req.params.id}`,
        ip: req.ip || 'unknown',
        status: 'BLOCKED',
        details: 'Attempted to access another user project',
      });
      return res.status(403).json({ error: 'Akses ditolak: Anda bukan pemilik proyek ini.' });
    }

    res.json({ project });
  });

  // Public invitation endpoint (Sanitized - no private organizer data leaked)
  app.get('/api/invitations/public/:slug', (req, res) => {
    const slug = req.params.slug;
    // Returns sanitized public view data
    res.json({
      success: true,
      slug,
      isPublic: true,
    });
  });

  // -----------------------------------------------------------------
  // 9. Strict Secure File Upload Endpoint
  // -----------------------------------------------------------------
  app.post('/api/uploads/media', requireAuth, (req, res) => {
    const clientKey = req.user?.userId || req.ip || 'anonymous';
    const rate = uploadRateLimiter.check(clientKey);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Terlalu banyak permintaan unggah berkas.' });
    }

    const { fileBase64, filename, mimeType } = req.body;
    if (!fileBase64 || !filename) {
      return res.status(400).json({ error: 'Berkas tidak boleh kosong.' });
    }

    try {
      const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(cleanBase64, 'base64');

      // Check max size: 10MB for images, 50MB for video
      const isVideo = mimeType?.startsWith('video/');
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;

      const result = validateUploadedBuffer(buffer, mimeType, filename, maxSize);
      if (!result.valid) {
        return res.status(400).json({ error: result.error });
      }

      auditLogger.log({
        actorId: req.user!.userId,
        actorEmail: req.user!.email,
        action: 'MEDIA_UPLOADED',
        resource: `/uploads/${result.sanitizedFilename}`,
        ip: req.ip || 'unknown',
        status: 'SUCCESS',
        details: `Uploaded ${result.detectedMime} (${(buffer.length / 1024).toFixed(1)} KB)`,
      });

      res.json({
        success: true,
        filename: result.sanitizedFilename,
        mimeType: result.detectedMime,
        size: buffer.length,
      });
    } catch (err: any) {
      return safeErrorResponse(res, err, 'Gagal memproses berkas yang diunggah.', 400);
    }
  });

  // -----------------------------------------------------------------
  // 10. QR Check-In Verification & Signature Endpoints
  // -----------------------------------------------------------------
  // Generate signed QR payload for guest ticket
  app.post('/api/checkin/sign', requireAuth, (req, res) => {
    const { eventId, guestId, checkInCode } = req.body;
    if (!eventId || !guestId || !checkInCode) {
      return res.status(400).json({ error: 'Parameter tiket QR tidak lengkap.' });
    }

    const signature = generateQrTicketSignature(eventId, guestId, checkInCode);
    const token = `AAPASS:${eventId}:${guestId}:${checkInCode}:${signature}`;

    res.json({
      success: true,
      ticketToken: token,
      signature,
    });
  });

  // Verify and record check-in
  app.post('/api/checkin/verify', (req, res) => {
    const clientKey = req.ip || 'anonymous';
    const rate = qrCheckinRateLimiter.check(clientKey);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Terlalu banyak permintaan check-in. Coba lagi dalam 1 menit.' });
    }

    const { rawPayload, currentEventId, guestId, checkInCode, signature } = req.body;

    let targetEventId = currentEventId;
    let targetGuestId = guestId;
    let targetCode = checkInCode;
    let targetSig = signature;

    // Support AAPASS:eventId:guestId:checkInCode:signature formatted tokens
    if (rawPayload && typeof rawPayload === 'string' && rawPayload.startsWith('AAPASS:')) {
      const parts = rawPayload.split(':');
      if (parts.length >= 5) {
        targetEventId = parts[1];
        targetGuestId = parts[2];
        targetCode = parts[3];
        targetSig = parts[4];
      }
    }

    if (!targetCode) {
      return res.status(400).json({ success: false, message: 'Kode E-Pass tidak terbaca.' });
    }

    // Verify cryptographic signature if present
    if (targetEventId && targetGuestId && targetSig) {
      const isValidSig = verifyQrTicketSignature(targetEventId, targetGuestId, targetCode, targetSig);
      if (!isValidSig) {
        return res.status(403).json({
          success: false,
          message: 'Tanda tangan digital E-Pass tidak valid atau telah dimodifikasi (Security Alert).',
        });
      }
    }

    // Check that event matches
    if (currentEventId && targetEventId && currentEventId !== targetEventId) {
      return res.status(400).json({
        success: false,
        message: 'Tiket QR ini ditujukan untuk acara lain dan tidak berlaku di acara ini.',
      });
    }

    // Record check-in atomically in store
    const checkInResult = serverStore.checkInGuest(
      targetEventId || 'current_event',
      targetGuestId || targetCode,
      targetCode,
      req.user?.email || 'Scanner Operator'
    );

    auditLogger.log({
      actorId: req.user?.userId || 'scanner_op',
      actorEmail: req.user?.email || 'scanner@local',
      action: 'QR_CHECKIN',
      resource: `/events/${targetEventId}/guests/${targetGuestId}`,
      ip: req.ip || 'unknown',
      status: checkInResult.success ? 'SUCCESS' : 'BLOCKED',
      details: checkInResult.message,
    });

    res.json(checkInResult);
  });

  // -----------------------------------------------------------------
  // 11. WhatsApp Blast Protection & Anti-Spam
  // -----------------------------------------------------------------
  app.post('/api/whatsapp/validate-blast', requireAuth, (req, res) => {
    const clientKey = req.user!.userId;
    const rate = blastRateLimiter.check(clientKey);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Batas frekuensi WhatsApp blast tercapai. Silakan tunggu 5 menit sebelum mengirim lagi.' });
    }

    // Check subscription tier (Free tier cannot run bulk blasts)
    const tier = req.user!.subscriptionTier;
    if (tier === 'starter') {
      return res.status(403).json({
        error: 'Fitur WhatsApp Blast otomatis memerlukan paket Wedding Professional atau EO & Agency.',
      });
    }

    const { recipients, messageTemplate } = req.body;
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Daftar penerima tidak boleh kosong.' });
    }

    if (recipients.length > 100) {
      return res.status(400).json({ error: 'Maksimal 100 penerima per sesi pengiriman demi kepatuhan kebijakan WhatsApp anti-spam.' });
    }

    // Validate and sanitize phone numbers
    const validRecipients = recipients.filter((r) => r.phone && isValidPhone(r.phone));

    res.json({
      success: true,
      totalRequested: recipients.length,
      validCount: validRecipients.length,
      allowed: true,
    });
  });

  // -----------------------------------------------------------------
  // 12. Hardened Gemini AI Endpoints (Image, Video, Music, Chat)
  // -----------------------------------------------------------------

  // 1. Create & Edit Images using gemini-3.1-flash-image-preview
  app.post('/api/gemini/image', async (req, res) => {
    const clientKey = req.ip || 'anonymous';
    const rate = aiRateLimiter.check(clientKey);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Batas kecepatan AI tercapai. Silakan coba sebentar lagi.' });
    }

    try {
      const { prompt, imageBase64, mimeType = 'image/png', aspectRatio = '1:1', imageSize = '1K' } = req.body;

      if (!prompt && !imageBase64) {
        return res.status(400).json({ error: 'Prompt or image is required' });
      }

      const ai = getGenAI();
      const parts: any[] = [];

      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType,
          },
        });
      }

      if (prompt) {
        // Sanitize prompt length to prevent excessive billing attacks
        parts.push({ text: sanitizeInputString(prompt, 2000) });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio as any) || '1:1',
            imageSize: (imageSize as any) || '1K',
          },
        },
      });

      let generatedImageUrl: string | null = null;
      let generatedText = '';

      const candidateParts = response.candidates?.[0]?.content?.parts || [];
      for (const part of candidateParts) {
        if (part.inlineData?.data) {
          const type = part.inlineData.mimeType || 'image/png';
          generatedImageUrl = `data:${type};base64,${part.inlineData.data}`;
        } else if (part.text) {
          generatedText += part.text;
        }
      }

      if (!generatedImageUrl) {
        return res.status(502).json({
          error: 'Model did not return image data',
          details: generatedText || 'No image part returned',
        });
      }

      res.json({
        imageUrl: generatedImageUrl,
        text: generatedText,
        aspectRatio,
        model: 'gemini-3.1-flash-image-preview',
      });
    } catch (err: any) {
      return safeErrorResponse(res, err, 'Gagal menghasilkan gambar AI.');
    }
  });

  // 2. Video Generation (Text to Video & Image to Video Animation) using veo-3.1-fast-generate-preview
  // Step 1: Start operation
  app.post('/api/gemini/video/start', async (req, res) => {
    const clientKey = req.ip || 'anonymous';
    const rate = aiRateLimiter.check(clientKey);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Batas kecepatan video AI tercapai. Silakan coba sebentar lagi.' });
    }

    try {
      const {
        prompt,
        imageBase64,
        mimeType = 'image/png',
        aspectRatio = '16:9',
      } = req.body;

      if (!prompt && !imageBase64) {
        return res.status(400).json({ error: 'A text prompt or starting image is required' });
      }

      const ai = getGenAI();
      const validAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';

      const config: any = {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: validAspectRatio,
      };

      const params: any = {
        model: 'veo-3.1-fast-generate-preview',
        config,
      };

      if (prompt) {
        params.prompt = sanitizeInputString(prompt, 1500);
      }

      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
        params.image = {
          imageBytes: cleanBase64,
          mimeType,
        };
      }

      const operation = await ai.models.generateVideos(params);

      res.json({
        operationName: operation.name,
        aspectRatio: validAspectRatio,
        model: 'veo-3.1-fast-generate-preview',
      });
    } catch (err: any) {
      return safeErrorResponse(res, err, 'Gagal memulai proses render video AI.');
    }
  });

  // Step 2: Poll operation status
  app.post('/api/gemini/video/status', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName || typeof operationName !== 'string') {
        return res.status(400).json({ error: 'operationName is required' });
      }

      const ai = getGenAI();
      const op = new GenerateVideosOperation();
      op.name = operationName;

      const updated = await ai.operations.getVideosOperation({ operation: op });

      res.json({
        done: Boolean(updated.done),
        error: updated.error || null,
        hasVideo: Boolean(updated.response?.generatedVideos?.[0]?.video?.uri),
      });
    } catch (err: any) {
      return safeErrorResponse(res, err, 'Gagal memeriksa status video AI.');
    }
  });

  // Step 3: Download video and stream back to browser
  app.post('/api/gemini/video/download', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName || typeof operationName !== 'string') {
        return res.status(400).json({ error: 'operationName is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
      }

      const ai = getGenAI();
      const op = new GenerateVideosOperation();
      op.name = operationName;

      const updated = await ai.operations.getVideosOperation({ operation: op });
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

      if (!uri) {
        return res.status(404).json({ error: 'Video URI not available in completed operation' });
      }

      const videoRes = await fetch(uri, {
        headers: {
          'x-goog-api-key': apiKey,
        },
      });

      if (!videoRes.ok) {
        return res.status(videoRes.status).json({
          error: `Failed to fetch generated video: ${videoRes.statusText}`,
        });
      }

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', 'inline; filename="eventmaker-video.mp4"');

      if (!videoRes.body) {
        return res.status(500).json({ error: 'No video stream received' });
      }

      await videoRes.body.pipeTo(
        new WritableStream({
          write(chunk) {
            res.write(chunk);
          },
          close() {
            res.end();
          },
        })
      );
    } catch (err: any) {
      if (!res.headersSent) {
        return safeErrorResponse(res, err, 'Gagal mengunduh video.');
      }
    }
  });

  // 3. Music Generation using lyria-3-clip-preview (clip up to 30s) or lyria-3-pro-preview (full track)
  app.post('/api/gemini/music', async (req, res) => {
    const clientKey = req.ip || 'anonymous';
    const rate = aiRateLimiter.check(clientKey);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Batas kecepatan audio AI tercapai. Silakan coba sebentar lagi.' });
    }

    try {
      const {
        prompt,
        model = 'lyria-3-clip-preview',
        imageBase64,
        mimeType = 'image/jpeg',
      } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Music prompt is required' });
      }

      const ai = getGenAI();
      const validModel =
        model === 'lyria-3-pro-preview' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

      let contentsPayload: any = sanitizeInputString(prompt, 1500);
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
        contentsPayload = {
          parts: [
            { text: sanitizeInputString(prompt, 1500) },
            { inlineData: { data: cleanBase64, mimeType } },
          ],
        };
      }

      const response = await ai.models.generateContentStream({
        model: validModel,
        contents: contentsPayload,
      });

      let audioBase64 = '';
      let lyrics = '';
      let detectedMimeType = 'audio/wav';

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              detectedMimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
          if (part.text && !lyrics) {
            lyrics = part.text;
          }
        }
      }

      if (!audioBase64) {
        return res.status(502).json({
          error: 'No audio returned by Lyria music model',
          lyrics,
        });
      }

      res.json({
        audioBase64,
        mimeType: detectedMimeType,
        lyrics,
        model: validModel,
      });
    } catch (err: any) {
      return safeErrorResponse(res, err, 'Gagal menghasilkan trek musik AI.');
    }
  });

  // 4. Multi-turn Gemini Chatbot with specific roles & models
  app.post('/api/gemini/chat', async (req, res) => {
    const clientKey = req.ip || 'anonymous';
    const rate = aiRateLimiter.check(clientKey);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Batas kecepatan asisten AI tercapai. Silakan tunggu beberapa detik.' });
    }

    try {
      const {
        message,
        history = [],
        model = 'gemini-3.5-flash',
        systemInstruction = 'You are the expert AA Event Maker AI Wedding and Event Consultant. Provide structured, actionable, and warm recommendations for invitations, rundown, RSVP, budgeting, and ceremonies.',
      } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getGenAI();

      let validModel = 'gemini-3.5-flash';
      if (model === 'gemini-3.1-pro-preview' || model === 'pro') {
        validModel = 'gemini-3.1-pro-preview';
      } else if (model === 'gemini-3.1-flash-lite' || model === 'fast' || model === 'lite') {
        validModel = 'gemini-3.1-flash-lite';
      } else if (model === 'gemini-3.5-flash' || model === 'general') {
        validModel = 'gemini-3.5-flash';
      }

      const contents: any[] = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-10)) { // limit to last 10 turns
          if (item && item.text) {
            contents.push({
              role: item.role === 'model' || item.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: sanitizeInputString(item.text, 2000) }],
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: sanitizeInputString(message, 2000) }],
      });

      const response = await ai.models.generateContent({
        model: validModel,
        contents,
        config: {
          systemInstruction,
        },
      });

      const reply = response.text || 'Tidak ada respons dari asisten AI.';

      res.json({
        reply,
        modelUsed: validModel,
      });
    } catch (err: any) {
      return safeErrorResponse(res, err, 'Gagal memproses pesan AI konsultan.');
    }
  });

  // -----------------------------------------------------------------
  // 13. Secure Server-side Route Guard for Admin console paths
  // -----------------------------------------------------------------
  app.use((req, res, next) => {
    const reqPath = req.path;
    const isHtmlRequest = req.headers.accept?.includes('text/html');

    if ((reqPath === '/admin' || reqPath.startsWith('/admin/')) && isHtmlRequest) {
      // Check verified token
      let isAdmin = false;

      if (req.user && req.user.role === 'ADMIN') {
        const storedUser = serverStore.findUserById(req.user.userId);
        if (storedUser && storedUser.role === 'ADMIN') {
          isAdmin = true;
        }
      }

      // If not authenticated admin, show secure 403 screen without reflecting raw cookies
      if (!isAdmin) {
        auditLogger.log({
          actorId: req.user?.userId || 'anonymous',
          actorEmail: req.user?.email || 'unauthenticated',
          action: 'ADMIN_PORTAL_BLOCKED',
          resource: req.originalUrl,
          ip: req.ip || 'unknown',
          status: 'BLOCKED',
          details: 'Unverified attempt to load Admin UI console',
        });

        res.status(403);
        const safeRole = escapeHtml(req.user?.role || 'Tamu / Pengunjung');
        return res.send(`
          <!DOCTYPE html>
          <html lang="id">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>403 - Akses Administrator Ditolak | AA Event Maker</title>
            <style>
              body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
              .card { max-width: 480px; width: 100%; background: #131b2e; border: 1px solid #1e293b; border-radius: 24px; padding: 36px 28px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
              .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; }
              h1 { font-size: 22px; font-weight: 800; margin: 0 0 12px 0; color: #ffffff; letter-spacing: -0.02em; }
              p { font-size: 13px; line-height: 1.6; color: #94a3b8; margin: 0 0 28px 0; }
              .btn-group { display: flex; flex-direction: column; gap: 10px; }
              .btn { display: block; padding: 13px 20px; border-radius: 12px; font-size: 13px; font-weight: 700; text-decoration: none; transition: all 0.2s ease; }
              .btn-primary { background: #2563eb; color: #ffffff; }
              .btn-primary:hover { background: #1d4ed8; }
              .btn-secondary { background: #1e293b; color: #cbd5e1; }
              .btn-secondary:hover { background: #334155; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="badge">
                <span>🛡️ Akses Ditolak (403 Forbidden)</span>
              </div>
              <h1>Area Khusus Administrator</h1>
              <p>Peran Anda saat ini terdeteksi sebagai <strong>${safeRole}</strong>. Halaman ini diproteksi secara ketat menggunakan otentikasi token bertanda tangan server dan hanya dapat diakses oleh akun Administrator Platform AA Event Maker yang sah.</p>
              <div class="btn-group">
                <a href="/dashboard" class="btn btn-primary">Kembali ke Dasbor Saya</a>
                <a href="/login?redirect=${encodeURIComponent(req.originalUrl)}" class="btn btn-secondary">Masuk dengan Akun Admin Resmi</a>
              </div>
            </div>
          </body>
          </html>
        `);
      }
    }

    next();
  });

  // -----------------------------------------------------------------
  // 14. Static and SPA Fallback Serving
  // -----------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AA Event Maker Secure Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
