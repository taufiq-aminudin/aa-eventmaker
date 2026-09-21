import { SubscriptionTier, EventType } from '../types';

/**
 * Validates Indonesian and International phone number formats.
 * Accepts:
 * - Indonesian local format: 08xx (10 to 14 digits)
 * - Indonesian international format: +628xx or 628xx
 * - General international format with country code: +[1-9][0-9]{7,14}
 */
export const isValidPhoneNumber = (phone: string | undefined | null): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  const cleanPhone = phone.trim().replace(/[\s\-().]/g, '');
  if (!cleanPhone) return false;

  // Indonesian format: 08..., 628..., +628... (total 10-15 digits)
  const indoRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
  // General E.164 international format: +1 to +999 followed by 6-13 digits
  const intlRegex = /^\+?[1-9][0-9]{7,14}$/;

  return indoRegex.test(cleanPhone) || intlRegex.test(cleanPhone);
};

/**
 * Normalizes phone numbers to standard WhatsApp format (e.g. 6281382000412).
 */
export const normalizePhoneNumber = (phone: string): string => {
  let cleaned = phone.trim().replace(/[^0-9+]/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1);
  }
  if (cleaned.startsWith('08')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
};

/**
 * Validates standard email address format.
 */
export const isValidEmail = (email: string | undefined | null): boolean => {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim();
  if (!clean) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(clean);
};

/**
 * Validates date string format (YYYY-MM-DD) and checks valid calendar date.
 */
export const isValidDate = (dateStr: string | undefined | null): boolean => {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const trimmed = dateStr.trim();
  // Match YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return false;
  }

  const [yearStr, monthStr, dayStr] = trimmed.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (year < 2020 || year > 2100) return false;
  if (month < 1 || month > 12) return false;

  // Check days in month
  const daysInMonth = new Date(year, month, 0).getDate();
  return day >= 1 && day <= daysInMonth;
};

export interface InvitationFormValidationInput {
  title: string;
  hosts: string;
  date: string;
  time?: string;
  venue: string;
  address?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates invitation creation payload
 */
export const validateInvitationCreationForm = (
  data: InvitationFormValidationInput
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Judul acara wajib diisi (minimal 3 karakter).';
  }

  if (!data.hosts || data.hosts.trim().length < 3) {
    errors.hosts = 'Nama mempelai / tuan rumah wajib diisi (minimal 3 karakter).';
  }

  if (!data.date || !data.date.trim()) {
    errors.date = 'Tanggal acara wajib dipilih.';
  } else if (!isValidDate(data.date)) {
    errors.date = 'Format tanggal tidak valid (harus YYYY-MM-DD yang benar).';
  }

  if (!data.venue || data.venue.trim().length < 3) {
    errors.venue = 'Nama tempat / venue acara wajib diisi (minimal 3 karakter).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export interface RsvpFormValidationInput {
  guestName: string;
  status: 'Confirmed' | 'Declined' | 'Maybe' | 'Pending';
  pax?: number;
  phone?: string;
  email?: string;
  notes?: string;
}

/**
 * Validates RSVP submission payload
 */
export const validateRsvpForm = (
  data: RsvpFormValidationInput,
  options?: { requirePhone?: boolean }
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.guestName || data.guestName.trim().length < 2) {
    errors.guestName = 'Nama tamu wajib diisi (minimal 2 karakter).';
  }

  if (!['Confirmed', 'Declined', 'Maybe', 'Pending'].includes(data.status)) {
    errors.status = 'Status kehadiran tidak valid.';
  }

  if (data.status !== 'Declined') {
    if (data.pax === undefined || data.pax === null || isNaN(data.pax) || data.pax < 1) {
      errors.pax = 'Jumlah kehadiran minimal 1 orang.';
    } else if (data.pax > 10) {
      errors.pax = 'Jumlah kehadiran maksimal 10 orang per konfirmasi.';
    }
  }

  if (options?.requirePhone || (data.phone && data.phone.trim().length > 0)) {
    if (!data.phone || !data.phone.trim()) {
      errors.phone = 'Nomor WhatsApp / telepon wajib diisi.';
    } else if (!isValidPhoneNumber(data.phone)) {
      errors.phone = 'Nomor telepon tidak valid (contoh: 08123456789 atau +628123456789).';
    }
  }

  if (data.email && data.email.trim().length > 0) {
    if (!isValidEmail(data.email)) {
      errors.email = 'Format alamat email tidak valid.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Package limit calculation and subscription business logic
 */
export interface PackageLimitRule {
  maxProjects: number;
  maxGuests: number;
  allowVideoEmbed: boolean;
  allowCustomAudio: boolean;
  allowReportExport: boolean;
  allowAutomatedBlast: boolean;
  allowMultiEventSync: boolean;
}

export const PACKAGE_LIMIT_RULES: Record<SubscriptionTier, PackageLimitRule> = {
  starter: {
    maxProjects: 1,
    maxGuests: 100,
    allowVideoEmbed: false,
    allowCustomAudio: false,
    allowReportExport: false,
    allowAutomatedBlast: false,
    allowMultiEventSync: false,
  },
  professional: {
    maxProjects: 10,
    maxGuests: 1000,
    allowVideoEmbed: true,
    allowCustomAudio: true,
    allowReportExport: true,
    allowAutomatedBlast: true,
    allowMultiEventSync: true,
  },
  agency: {
    maxProjects: 999999, // Unlimited
    maxGuests: 999999, // Unlimited
    allowVideoEmbed: true,
    allowCustomAudio: true,
    allowReportExport: true,
    allowAutomatedBlast: true,
    allowMultiEventSync: true,
  },
};

export const getPackageLimits = (tier: SubscriptionTier): PackageLimitRule => {
  return PACKAGE_LIMIT_RULES[tier] || PACKAGE_LIMIT_RULES.starter;
};

export const checkCanCreateProject = (
  tier: SubscriptionTier,
  currentProjectsCount: number
): { canCreate: boolean; limit: number; remaining: number } => {
  const limits = getPackageLimits(tier);
  const remaining = Math.max(0, limits.maxProjects - currentProjectsCount);
  return {
    canCreate: currentProjectsCount < limits.maxProjects,
    limit: limits.maxProjects,
    remaining,
  };
};

export const checkCanAddGuests = (
  tier: SubscriptionTier,
  currentGuestsCount: number,
  guestsToAdd: number = 1
): { canAdd: boolean; limit: number; remaining: number } => {
  const limits = getPackageLimits(tier);
  const remaining = Math.max(0, limits.maxGuests - currentGuestsCount);
  return {
    canAdd: currentGuestsCount + guestsToAdd <= limits.maxGuests,
    limit: limits.maxGuests,
    remaining,
  };
};
