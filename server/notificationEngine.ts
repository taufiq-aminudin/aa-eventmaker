import {
  NotificationChannel,
  NotificationCategory,
  NotificationType,
  InAppNotification,
  EmailLogRecord,
  EmailDeliveryStatus,
  UserNotificationPreferences,
  AdminEmailConfig,
  AnnouncementPayload,
  UserRole,
  SubscriptionTier,
} from '../src/types';

// Default User Notification Preferences
export const DEFAULT_NOTIFICATION_PREFERENCES: UserNotificationPreferences = {
  email: {
    account: true,
    events: true,
    invitations: true,
    rsvp: true,
    payments: true,
    subscription: true,
    security: true, // Non-negotiable security notification
  },
  inApp: {
    account: true,
    events: true,
    invitations: true,
    rsvp: true,
    checkIn: true,
    payments: true,
    subscription: true,
    security: true,
    system: true,
  },
  whatsapp: {
    rsvp: true,
    checkIn: true,
    payments: true,
  },
};

// Safe Admin Email Configuration (Passwords stored server-side only in process.env or memory)
let adminEmailConfig: AdminEmailConfig = {
  senderName: 'AA Event Maker Notifikasi',
  senderEmail: 'no-reply@aa-eventmaker.my.id',
  replyToEmail: 'support@aa-eventmaker.my.id',
  smtpHost: process.env.SMTP_HOST || 'smtp.mailgun.org',
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpSecure: false,
  smtpUsername: process.env.SMTP_USER || 'postmaster@aa-eventmaker.my.id',
  smtpConfigured: Boolean(process.env.SMTP_PASS || process.env.SMTP_HOST),
  provider: 'BuiltInGateway',
  dailyQuota: 5000,
  usedQuotaToday: 48,
  enableEmailNotifications: true,
  enableInAppNotifications: true,
  enableWhatsAppNotifications: true,
  updatedAt: Date.now(),
  updatedBy: 'admin@aa-eventmaker.my.id',
};

// Private server-side storage for SMTP password (never sent to client)
let serverSmtpPassword = process.env.SMTP_PASS || 'AA_Server_Smtp_Secure_Key_2026';

// HTML Template Renderer for Professional AA Event Maker Branded Emails
export function renderEmailHtml(params: {
  title: string;
  recipientName: string;
  category: NotificationCategory;
  bodyHtml: string;
  actionUrl?: string;
  actionText?: string;
  secondaryNotice?: string;
}): string {
  const { title, recipientName, category, bodyHtml, actionUrl, actionText, secondaryNotice } = params;
  const currentYear = new Date().getFullYear();

  // Category Badge Colors
  const categoryColors: Record<NotificationCategory, { bg: string; text: string }> = {
    ACCOUNT: { bg: '#e0f2fe', text: '#0369a1' },
    EVENT: { bg: '#f3e8ff', text: '#6b21a8' },
    INVITATION: { bg: '#fae8ff', text: '#86198f' },
    GUEST: { bg: '#ecfdf5', text: '#047857' },
    RSVP: { bg: '#fef3c7', text: '#b45309' },
    CHECK_IN: { bg: '#dcfce7', text: '#15803d' },
    PAYMENT: { bg: '#fee2e2', text: '#b91c1c' },
    SUBSCRIPTION: { bg: '#ede9fe', text: '#5b21b6' },
    SECURITY: { bg: '#ffedd5', text: '#c2410c' },
    SYSTEM: { bg: '#f1f5f9', text: '#334155' },
  };

  const badge = categoryColors[category] || { bg: '#f1f5f9', text: '#334155' };

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f8fafc;
      padding: 30px 10px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #2563eb 100%);
      padding: 30px 24px;
      text-align: center;
      color: #ffffff;
    }
    .logo-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }
    .header-title {
      margin: 0;
      font-size: 22px;
      font-weight: 800;
      line-height: 1.3;
      color: #ffffff;
    }
    .header-sub {
      margin: 8px 0 0 0;
      font-size: 13px;
      color: #cbd5e1;
    }
    .content {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 16px;
    }
    .badge {
      display: inline-block;
      background-color: ${badge.bg};
      color: ${badge.text};
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 4px 10px;
      border-radius: 6px;
      margin-bottom: 18px;
    }
    .body-text {
      font-size: 14px;
      line-height: 1.65;
      color: #334155;
      margin-bottom: 24px;
    }
    .card-detail {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 16px 20px;
      margin-bottom: 24px;
      font-size: 13px;
      line-height: 1.6;
    }
    .button-container {
      text-align: center;
      margin: 28px 0;
    }
    .btn-primary {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    }
    .secondary-notice {
      background-color: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 12px 16px;
      font-size: 12px;
      color: #92400e;
      border-radius: 0 8px 8px 0;
      margin-top: 20px;
    }
    .footer {
      background-color: #f1f5f9;
      border-top: 1px solid #e2e8f0;
      padding: 24px 28px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      line-height: 1.6;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 24px 18px;
      }
      .btn-primary {
        display: block;
        width: 100%;
        box-sizing: border-box;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="logo-badge">✨ AA EVENT MAKER</div>
        <h1 class="header-title">${title}</h1>
        <p class="header-sub">Platform Undangan Digital & Manajemen Tamu Terpadu</p>
      </div>

      <!-- Main Content -->
      <div class="content">
        <span class="badge">${category}</span>
        <div class="greeting">Halo ${recipientName || 'Pengguna AA Event Maker'},</div>
        
        <div class="body-text">
          ${bodyHtml}
        </div>

        ${
          actionUrl && actionText
            ? `<div class="button-container">
                <a href="${actionUrl}" class="btn-primary" target="_blank" rel="noopener noreferrer">${actionText}</a>
              </div>`
            : ''
        }

        ${
          secondaryNotice
            ? `<div class="secondary-notice">${secondaryNotice}</div>`
            : ''
        }
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0 0 6px 0; font-weight: 700; color: #334155;">AA Event Maker — Undangan Sinematik, RSVP & Buku Tamu QR</p>
        <p style="margin: 0 0 10px 0;">
          Website Resmi: <a href="https://aa-eventmaker.my.id/">https://aa-eventmaker.my.id/</a> |
          Bantuan: <a href="mailto:support@aa-eventmaker.my.id">support@aa-eventmaker.my.id</a>
        </p>
        <p style="margin: 0; font-size: 11px; color: #94a3b8;">
          © ${currentYear} AA Event Maker. Hak cipta dilindungi undang-undang.<br>
          Email ini dikirim secara otomatis oleh sistem pemberitahuan resmi. Jangan membalas langsung ke alamat no-reply ini.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// In-Memory Notification Store (Server Single-Source-of-Truth)
class NotificationStore {
  private notifications: Map<string, InAppNotification> = new Map();
  private emailLogs: Map<string, EmailLogRecord> = new Map();
  private userPreferences: Map<string, UserNotificationPreferences> = new Map();
  private idempotencyRegistry: Map<string, { timestamp: number; logId: string }> = new Map();

  constructor() {
    // Clean state: no pre-seeded demo notifications
  }

  // Seed realistic notifications and logs for demo accounts (Disabled to ensure only real accounts exist)
  private seedInitialNotifications() {
    // Only real activity on the device/server will populate notifications and logs
  }

  // --- In-App Notifications ---
  public addInAppNotification(notif: InAppNotification): InAppNotification {
    this.notifications.set(notif.id, notif);
    return notif;
  }

  public getUserNotifications(userId: string, role?: UserRole): InAppNotification[] {
    const results: InAppNotification[] = [];
    for (const notif of this.notifications.values()) {
      if (notif.userId === userId || notif.targetRole === 'ALL' || (role && notif.targetRole === role)) {
        // Prevent leaking admin notifications to non-admins
        if (notif.targetRole === 'ADMIN' && role !== 'ADMIN') {
          continue;
        }
        results.push(notif);
      }
    }
    return results.sort((a, b) => b.createdAt - a.createdAt);
  }

  public markAsRead(id: string, userId: string): boolean {
    const notif = this.notifications.get(id);
    if (!notif) return false;
    notif.isRead = true;
    notif.readAt = Date.now();
    return true;
  }

  public markAllAsRead(userId: string, role?: UserRole): number {
    let count = 0;
    for (const notif of this.notifications.values()) {
      if ((notif.userId === userId || notif.targetRole === 'ALL' || (role && notif.targetRole === role)) && !notif.isRead) {
        notif.isRead = true;
        notif.readAt = Date.now();
        count++;
      }
    }
    return count;
  }

  public deleteNotification(id: string, userId: string): boolean {
    const notif = this.notifications.get(id);
    if (!notif) return false;
    this.notifications.delete(id);
    return true;
  }

  // --- User Preferences ---
  public getUserPreferences(userId: string): UserNotificationPreferences {
    return this.userPreferences.get(userId) || { ...DEFAULT_NOTIFICATION_PREFERENCES };
  }

  public updateUserPreferences(userId: string, prefs: Partial<UserNotificationPreferences>): UserNotificationPreferences {
    const current = this.getUserPreferences(userId);
    const updated: UserNotificationPreferences = {
      email: { ...current.email, ...(prefs.email || {}), security: true }, // Security always enforced
      inApp: { ...current.inApp, ...(prefs.inApp || {}), security: true },
      whatsapp: { ...current.whatsapp, ...(prefs.whatsapp || {}) },
    };
    this.userPreferences.set(userId, updated);
    return updated;
  }

  // --- Email Logs & Idempotency ---
  public checkIdempotency(key: string): { duplicate: boolean; existingLogId?: string } {
    if (!key) return { duplicate: false };
    const record = this.idempotencyRegistry.get(key);
    if (!record) return { duplicate: false };

    // Idempotency TTL: 24 hours
    if (Date.now() - record.timestamp < 24 * 3600 * 1000) {
      return { duplicate: true, existingLogId: record.logId };
    }
    return { duplicate: false };
  }

  public registerIdempotency(key: string, logId: string) {
    if (key) {
      this.idempotencyRegistry.set(key, { timestamp: Date.now(), logId });
    }
  }

  public addEmailLog(log: EmailLogRecord): EmailLogRecord {
    this.emailLogs.set(log.id, log);
    return log;
  }

  public getEmailLogs(filters?: {
    status?: EmailDeliveryStatus | 'all';
    category?: NotificationCategory | 'all';
    search?: string;
  }): EmailLogRecord[] {
    let list = Array.from(this.emailLogs.values());

    if (filters?.status && filters.status !== 'all') {
      list = list.filter((l) => l.status === filters.status);
    }
    if (filters?.category && filters.category !== 'all') {
      list = list.filter((l) => l.category === filters.category);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (l) =>
          l.recipient.toLowerCase().includes(q) ||
          l.subject.toLowerCase().includes(q) ||
          (l.recipientName && l.recipientName.toLowerCase().includes(q)) ||
          l.template.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => b.createdAt - a.createdAt);
  }

  public getEmailLogById(id: string): EmailLogRecord | undefined {
    return this.emailLogs.get(id);
  }

  public updateEmailLog(id: string, updates: Partial<EmailLogRecord>): EmailLogRecord | null {
    const log = this.emailLogs.get(id);
    if (!log) return null;
    Object.assign(log, updates);
    return log;
  }

  public getNotificationStats() {
    const logs = Array.from(this.emailLogs.values());
    const total = logs.length;
    const sent = logs.filter((l) => l.status === 'sent' || l.status === 'delivered').length;
    const failed = logs.filter((l) => l.status === 'failed' || l.status === 'bounced').length;
    const queued = logs.filter((l) => l.status === 'queued' || l.status === 'processing').length;

    const inAppTotal = this.notifications.size;
    const inAppUnread = Array.from(this.notifications.values()).filter((n) => !n.isRead).length;

    return {
      email: { total, sent, failed, queued },
      inApp: { total: inAppTotal, unread: inAppUnread },
      smtpConfigured: adminEmailConfig.smtpConfigured,
      dailyQuota: adminEmailConfig.dailyQuota,
      usedQuotaToday: adminEmailConfig.usedQuotaToday,
    };
  }
}

export const notificationStore = new NotificationStore();

// ==========================================
// Centralized Notification Dispatcher Engine
// ==========================================

export interface DispatchNotificationParams {
  userId?: string;
  targetRole?: UserRole | 'ALL';
  recipientEmail?: string;
  recipientName?: string;
  recipientPhone?: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  bodyHtml?: string;
  actionUrl?: string;
  actionLabel?: string;
  secondaryNotice?: string;
  idempotencyKey?: string;
  channels?: NotificationChannel[]; // Defaults to ['IN_APP', 'EMAIL']
  metadata?: Record<string, any>;
  skipPreferencesCheck?: boolean; // For security & admin alerts
}

export async function dispatchNotification(params: DispatchNotificationParams): Promise<{
  success: boolean;
  inAppNotification?: InAppNotification;
  emailLog?: EmailLogRecord;
  whatsappUrl?: string;
  skippedReason?: string;
}> {
  const {
    userId = 'guest',
    targetRole,
    recipientEmail,
    recipientName = 'Pengguna AA Event Maker',
    recipientPhone,
    type,
    category,
    title,
    message,
    bodyHtml,
    actionUrl,
    actionLabel,
    secondaryNotice,
    idempotencyKey,
    channels = ['IN_APP', 'EMAIL'],
    metadata = {},
    skipPreferencesCheck = false,
  } = params;

  // 1. Idempotency Check (Duplicate Prevention)
  if (idempotencyKey) {
    const { duplicate, existingLogId } = notificationStore.checkIdempotency(idempotencyKey);
    if (duplicate) {
      console.log(`[NOTIFICATION_IDEMPOTENT_SKIP] Duplicate notification prevented for key: ${idempotencyKey}`);
      const existing = existingLogId ? notificationStore.getEmailLogById(existingLogId) : undefined;
      return { success: true, emailLog: existing, skippedReason: 'IDEMPOTENT_DUPLICATE_PREVENTED' };
    }
  }

  // 2. User Preferences Check
  const userPrefs = notificationStore.getUserPreferences(userId);

  // 3. Process IN-APP Channel
  let createdInApp: InAppNotification | undefined;
  const shouldSendInApp =
    channels.includes('IN_APP') &&
    (skipPreferencesCheck || userPrefs.inApp.security || (userPrefs.inApp as any)[category.toLowerCase()] !== false);

  if (shouldSendInApp) {
    createdInApp = notificationStore.addInAppNotification({
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      targetRole,
      type,
      category,
      title,
      message,
      channel: 'IN_APP',
      isRead: false,
      actionUrl,
      actionLabel,
      metadata,
      createdAt: Date.now(),
    });
  }

  // 4. Process EMAIL Channel
  let createdEmailLog: EmailLogRecord | undefined;
  const shouldSendEmail =
    channels.includes('EMAIL') &&
    Boolean(recipientEmail) &&
    adminEmailConfig.enableEmailNotifications &&
    (skipPreferencesCheck || category === 'SECURITY' || (userPrefs.email as any)[category.toLowerCase()] !== false);

  if (shouldSendEmail && recipientEmail) {
    const logId = `elog_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // Render HTML preview
    const renderedHtml = renderEmailHtml({
      title,
      recipientName,
      category,
      bodyHtml: bodyHtml || `<p>${message}</p>`,
      actionUrl: actionUrl?.startsWith('http') ? actionUrl : `https://aa-eventmaker.my.id${actionUrl || ''}`,
      actionText: actionLabel,
      secondaryNotice,
    });

    createdEmailLog = notificationStore.addEmailLog({
      id: logId,
      idempotencyKey,
      userId,
      recipient: recipientEmail.toLowerCase().trim(),
      recipientName,
      subject: title,
      template: type,
      category,
      status: 'processing',
      provider: adminEmailConfig.provider === 'SMTP'
        ? `SMTP (${adminEmailConfig.smtpHost}:${adminEmailConfig.smtpPort})`
        : 'AA Mail Gateway / SMTP (Port 587)',
      attempts: 1,
      maxAttempts: 3,
      lastAttemptAt: Date.now(),
      metadata,
      htmlPreview: renderedHtml,
      createdAt: Date.now(),
    });

    if (idempotencyKey) {
      notificationStore.registerIdempotency(idempotencyKey, logId);
    }

    // Process delivery asynchronously with automatic retry logic
    processEmailDelivery(createdEmailLog.id).catch((err) => {
      console.error(`[NOTIFICATION_QUEUE_ERROR] Delivery failure for ${logId}:`, err);
    });
  }

  // 5. Process WHATSAPP Channel (Generates clean click-to-chat URL)
  let whatsappUrl: string | undefined;
  if (channels.includes('WHATSAPP') && recipientPhone) {
    const cleanPhone = recipientPhone.replace(/\D/g, '').replace(/^0/, '62');
    const waText = encodeURIComponent(`*AA Event Maker Notification*\n\n*${title}*\n${message}\n\nInfo selengkapnya: https://aa-eventmaker.my.id${actionUrl || ''}`);
    whatsappUrl = `https://wa.me/${cleanPhone}?text=${waText}`;
  }

  return {
    success: true,
    inAppNotification: createdInApp,
    emailLog: createdEmailLog,
    whatsappUrl,
  };
}

// Background Queue & Retry Worker for Email Delivery
async function processEmailDelivery(logId: string) {
  const log = notificationStore.getEmailLogById(logId);
  if (!log) return;

  try {
    // Increment daily quota count
    adminEmailConfig.usedQuotaToday += 1;

    // Simulate robust transmission time and provider response
    // In production, nodemailer or HTTP API (Resend/SendGrid) is connected here
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Simulated provider message ID
    const providerMessageId = `msg_aa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    notificationStore.updateEmailLog(logId, {
      status: 'delivered',
      providerMessageId,
      sentAt: Date.now(),
      errorMessage: undefined,
    });
  } catch (err: any) {
    const nextAttempt = log.attempts + 1;
    if (nextAttempt <= log.maxAttempts) {
      // Retry with backoff
      notificationStore.updateEmailLog(logId, {
        status: 'queued',
        attempts: nextAttempt,
        errorMessage: `Percobaan #${log.attempts} gagal: ${err.message || 'Timeout jaringan'}. Dijadwalkan coba ulang.`,
      });

      setTimeout(() => {
        processEmailDelivery(logId);
      }, nextAttempt * 1000);
    } else {
      // Mark as failed and notify administrator
      notificationStore.updateEmailLog(logId, {
        status: 'failed',
        errorMessage: `Gagal setelah ${log.maxAttempts} kali percobaan: ${err.message || 'Server SMTP tidak merespons.'}`,
      });

      // Admin alert on repeated delivery failure
      notificationStore.addInAppNotification({
        id: `notif_adm_fail_${Date.now()}`,
        userId: 'usr_admin_001',
        targetRole: 'ADMIN',
        type: 'ADMIN_SECURITY_ALERT',
        category: 'SYSTEM',
        title: 'Kegagalan Pengiriman Email (Delivery Alert)',
        message: `Pengiriman email "${log.subject}" ke ${log.recipient} gagal setelah ${log.maxAttempts} kali percobaan.`,
        channel: 'IN_APP',
        isRead: false,
        actionUrl: '/admin/notifications',
        actionLabel: 'Buka Log Notifikasi',
        createdAt: Date.now(),
      });
    }
  }
}

// Re-send failed email by admin
export async function resendEmailLog(logId: string): Promise<boolean> {
  const log = notificationStore.getEmailLogById(logId);
  if (!log) return false;

  notificationStore.updateEmailLog(logId, {
    status: 'processing',
    attempts: log.attempts + 1,
    lastAttemptAt: Date.now(),
    errorMessage: undefined,
  });

  await processEmailDelivery(logId);
  return true;
}

// Broadcast Announcement to Targeted Audience
export async function broadcastAnnouncement(payload: AnnouncementPayload): Promise<number> {
  let targetUsersCount = 0;
  const now = Date.now();

  // Create in-app announcement for target audience
  if (payload.sendInApp) {
    notificationStore.addInAppNotification({
      id: `annc_${now}_${Math.random().toString(36).slice(2, 6)}`,
      userId: 'broadcast_all',
      targetRole: payload.target === 'ROLE' ? payload.targetRole : 'ALL',
      type: 'SYSTEM_ANNOUNCEMENT',
      category: payload.category || 'SYSTEM',
      title: `📢 ${payload.title}`,
      message: payload.message,
      channel: 'IN_APP',
      isRead: false,
      actionUrl: payload.actionUrl || '/dashboard',
      actionLabel: payload.actionLabel || 'Lihat Pengumuman',
      metadata: { target: payload.target, targetRole: payload.targetRole, targetTier: payload.targetTier },
      createdAt: now,
    });
    targetUsersCount += 1;
  }

  // Create sample broadcast email log if email is enabled
  if (payload.sendEmail) {
    const emailLogId = `elog_annc_${now}`;
    const previewHtml = renderEmailHtml({
      title: payload.title,
      recipientName: 'Pengguna Setia AA Event Maker',
      category: payload.category || 'SYSTEM',
      bodyHtml: `<p>${payload.message}</p>`,
      actionUrl: payload.actionUrl ? `https://aa-eventmaker.my.id${payload.actionUrl}` : 'https://aa-eventmaker.my.id/dashboard',
      actionText: payload.actionLabel || 'Kunjungi AA Event Maker',
      secondaryNotice: 'Pengumuman resmi dari Tim Manajemen AA Event Maker.',
    });

    notificationStore.addEmailLog({
      id: emailLogId,
      recipient: 'all-users@aa-eventmaker.my.id',
      recipientName: 'Seluruh Pengguna Terdaftar (Broadcast)',
      subject: `[Pengumuman] ${payload.title}`,
      template: 'SYSTEM_ANNOUNCEMENT',
      category: payload.category || 'SYSTEM',
      status: 'delivered',
      provider: 'AA Mail Gateway / SMTP (Port 587)',
      providerMessageId: `msg_annc_${now}`,
      attempts: 1,
      maxAttempts: 3,
      sentAt: now,
      htmlPreview: previewHtml,
      createdAt: now,
    });
    targetUsersCount += 1;
  }

  return targetUsersCount;
}

// Get and Update Admin Email Config
export function getAdminEmailConfig(): AdminEmailConfig {
  return { ...adminEmailConfig };
}

export function updateAdminEmailConfig(updates: Partial<AdminEmailConfig> & { smtpPassword?: string }): AdminEmailConfig {
  if (updates.smtpPassword) {
    serverSmtpPassword = updates.smtpPassword;
    adminEmailConfig.smtpConfigured = true;
  }

  const { smtpPassword, ...safeUpdates } = updates;
  adminEmailConfig = {
    ...adminEmailConfig,
    ...safeUpdates,
    updatedAt: Date.now(),
  };

  return { ...adminEmailConfig };
}
