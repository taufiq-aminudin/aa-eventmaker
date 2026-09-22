import {
  NotificationChannel,
  NotificationCategory,
  NotificationType,
  InAppNotification,
  EmailLogRecord,
  UserNotificationPreferences,
  AdminEmailConfig,
  AnnouncementPayload,
  UserRole,
} from '../types';

export interface SendEmailOptions {
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  template: NotificationType;
  category: NotificationCategory;
  bodyHtml?: string;
  message?: string;
  actionUrl?: string;
  actionLabel?: string;
  secondaryNotice?: string;
  idempotencyKey?: string;
  userId?: string;
}

export interface CreateInAppNotificationOptions {
  userId?: string;
  targetRole?: UserRole | 'ALL';
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

export interface SendWhatsAppOptions {
  phone: string;
  title: string;
  message: string;
  actionUrl?: string;
}

export interface NotifyUserOptions {
  userId: string;
  role?: UserRole;
  email?: string;
  name?: string;
  phone?: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  bodyHtml?: string;
  actionUrl?: string;
  actionLabel?: string;
  channels?: NotificationChannel[];
  idempotencyKey?: string;
  metadata?: Record<string, any>;
}

export interface NotifyAdminOptions {
  title: string;
  message: string;
  type?: NotificationType;
  category?: NotificationCategory;
  actionUrl?: string;
  actionLabel?: string;
  details?: Record<string, any>;
}

class NotificationServiceImpl {
  /**
   * Send an Email notification through server-side gateway
   */
  public async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; log?: EmailLogRecord; error?: string }> {
    try {
      const res = await fetch('/api/notifications/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: options.recipientEmail,
          recipientName: options.recipientName,
          title: options.subject,
          message: options.message || options.subject,
          bodyHtml: options.bodyHtml,
          type: options.template,
          category: options.category,
          actionUrl: options.actionUrl,
          actionLabel: options.actionLabel,
          secondaryNotice: options.secondaryNotice,
          idempotencyKey: options.idempotencyKey,
          userId: options.userId,
          channels: ['EMAIL'],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch email');
      return { success: true, log: data.emailLog };
    } catch (err: any) {
      console.warn('[NotificationService.sendEmail] Fallback or error:', err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * Create an in-app notification in user's notification center
   */
  public async createInAppNotification(
    options: CreateInAppNotificationOptions
  ): Promise<{ success: boolean; notification?: InAppNotification }> {
    try {
      const res = await fetch('/api/notifications/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: options.userId || 'current',
          targetRole: options.targetRole,
          title: options.title,
          message: options.message,
          type: options.type,
          category: options.category,
          actionUrl: options.actionUrl,
          actionLabel: options.actionLabel,
          metadata: options.metadata,
          channels: ['IN_APP'],
        }),
      });

      const data = await res.json();
      return { success: true, notification: data.inAppNotification };
    } catch (err: any) {
      console.warn('[NotificationService.createInAppNotification] Error:', err.message);
      return { success: false };
    }
  }

  /**
   * Generate official WhatsApp notification URL & preview
   */
  public sendWhatsAppNotification(options: SendWhatsAppOptions): { url: string; cleanPhone: string } {
    const cleanPhone = options.phone.replace(/\D/g, '').replace(/^0/, '62');
    const waText = encodeURIComponent(
      `*AA Event Maker Notification*\n\n*${options.title}*\n${options.message}\n\nSelengkapnya: https://aa-eventmaker.my.id${options.actionUrl || ''}`
    );
    const url = `https://wa.me/${cleanPhone}?text=${waText}`;
    return { url, cleanPhone };
  }

  /**
   * Centralized helper to notify user across appropriate channels
   */
  public async notifyUser(options: NotifyUserOptions): Promise<{ success: boolean }> {
    try {
      await fetch('/api/notifications/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: options.userId,
          targetRole: options.role,
          recipientEmail: options.email,
          recipientName: options.name,
          recipientPhone: options.phone,
          title: options.title,
          message: options.message,
          bodyHtml: options.bodyHtml,
          type: options.type,
          category: options.category,
          actionUrl: options.actionUrl,
          actionLabel: options.actionLabel,
          channels: options.channels || ['IN_APP', 'EMAIL'],
          idempotencyKey: options.idempotencyKey,
          metadata: options.metadata,
        }),
      });
      return { success: true };
    } catch (err: any) {
      console.warn('[NotificationService.notifyUser] Error:', err.message);
      return { success: false };
    }
  }

  /**
   * Centralized helper to alert Administrator
   */
  public async notifyAdmin(options: NotifyAdminOptions): Promise<{ success: boolean }> {
    try {
      await fetch('/api/notifications/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr_admin_001',
          targetRole: 'ADMIN',
          recipientEmail: 'admin@aa-eventmaker.my.id',
          recipientName: 'Administrator Platform',
          title: options.title,
          message: options.message,
          type: options.type || 'ADMIN_SECURITY_ALERT',
          category: options.category || 'SYSTEM',
          actionUrl: options.actionUrl || '/admin/dashboard',
          actionLabel: options.actionLabel || 'Buka Dasbor Admin',
          channels: ['IN_APP', 'EMAIL'],
          metadata: options.details,
          skipPreferencesCheck: true,
        }),
      });
      return { success: true };
    } catch (err: any) {
      console.warn('[NotificationService.notifyAdmin] Error:', err.message);
      return { success: false };
    }
  }

  // --- High-Level Domain Events ---

  public async notifyUserRegistered(user: { id: string; name: string; email: string; phone?: string; role: UserRole }) {
    return this.notifyUser({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      phone: user.phone,
      type: 'REGISTRATION_SUCCESS',
      category: 'ACCOUNT',
      title: 'Welcome to AA Event Maker — Registration Successful',
      message: `Selamat datang ${user.name}! Akun Anda berhasil dibuat. Silakan jelajahi fitur pembuatan undangan digital Anda.`,
      actionUrl: '/dashboard',
      actionLabel: 'Mulai Buat Undangan',
      idempotencyKey: `reg_${user.id}_${user.email}`,
      channels: ['IN_APP', 'EMAIL'],
    });
  }

  public async requestEmailVerification(email: string) {
    const res = await fetch('/api/notifications/verify-email/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  }

  public async confirmEmailVerification(token: string, email: string) {
    const res = await fetch('/api/notifications/verify-email/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email }),
    });
    return res.json();
  }

  public async requestPasswordReset(email: string) {
    const res = await fetch('/api/notifications/password-reset/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  }

  public async confirmPasswordReset(token: string, email: string, newPassword: string) {
    const res = await fetch('/api/notifications/password-reset/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email, newPassword }),
    });
    return res.json();
  }

  public async submitSupportRequest(ticket: { subject: string; message: string; userEmail: string; userName: string }) {
    const res = await fetch('/api/support/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    });
    return res.json();
  }

  // --- Fetch In-App Notifications for Current User ---
  public async fetchNotifications(params?: { unreadOnly?: boolean; category?: string }): Promise<InAppNotification[]> {
    try {
      const q = new URLSearchParams();
      if (params?.unreadOnly) q.set('unreadOnly', 'true');
      if (params?.category && params.category !== 'ALL') q.set('category', params.category);

      const res = await fetch(`/api/notifications?${q.toString()}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.notifications || [];
    } catch {
      return [];
    }
  }

  public async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async markAllAsRead(): Promise<boolean> {
    try {
      const res = await fetch('/api/notifications/read-all', { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/notifications/${notificationId}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- Preferences ---
  public async fetchPreferences(): Promise<UserNotificationPreferences | null> {
    try {
      const res = await fetch('/api/notifications/preferences');
      if (!res.ok) return null;
      const data = await res.json();
      return data.preferences;
    } catch {
      return null;
    }
  }

  public async updatePreferences(prefs: Partial<UserNotificationPreferences>): Promise<boolean> {
    try {
      const res = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- Admin Methods ---
  public async fetchAdminEmailLogs(filters?: { status?: string; category?: string; search?: string }): Promise<EmailLogRecord[]> {
    try {
      const q = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') q.set('status', filters.status);
      if (filters?.category && filters.category !== 'all') q.set('category', filters.category);
      if (filters?.search) q.set('search', filters.search);

      const res = await fetch(`/api/admin/notifications/logs?${q.toString()}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.logs || [];
    } catch {
      return [];
    }
  }

  public async fetchAdminStats() {
    try {
      const res = await fetch('/api/admin/notifications/stats');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public async resendEmailLog(logId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/notifications/resend/${logId}`, { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async fetchAdminEmailConfig(): Promise<AdminEmailConfig | null> {
    try {
      const res = await fetch('/api/admin/email-config');
      if (!res.ok) return null;
      const data = await res.json();
      return data.config;
    } catch {
      return null;
    }
  }

  public async updateAdminEmailConfig(updates: Partial<AdminEmailConfig> & { smtpPassword?: string }): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/email-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async broadcastAnnouncement(announcement: Partial<AnnouncementPayload>): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/announcements/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcement),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const NotificationService = new NotificationServiceImpl();
