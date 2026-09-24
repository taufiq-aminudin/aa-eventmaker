export type UserRole = 'ORGANIZER' | 'CLIENT' | 'VENDOR' | 'GUEST' | 'ADMIN';

export type PaymentStatus = 'Pending' | 'Under Review' | 'Approved' | 'Paid' | 'Rejected' | 'Refunded';

export type PaymentMethodType = 'Bank Mandiri' | 'DANA';

export interface PaymentSubmission {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  packageId: string;
  packageName: string;
  amount: number;
  amountFormatted: string;
  currency?: CurrencyCode;
  amountInIdr?: number;
  paymentMethod: PaymentMethodType;
  paymentDate: string;
  referenceNumber: string;
  proofDataUrl?: string;
  proofFileName?: string;
  proofFileType?: string;
  notes?: string;
  status: PaymentStatus;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: number;
}

export interface PackagePlan {
  id: string;
  name: string;
  badge: string;
  price: number;
  priceFormatted: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  isPopular?: boolean;
}

export type SubscriptionTier = 'starter' | 'professional' | 'agency';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  organizationName?: string;
  associatedEventId?: string;
  subscriptionTier?: SubscriptionTier;
  desiredPackageId?: string;
  createdAt: number;
}

export interface SavedDeviceAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  subscriptionTier?: SubscriptionTier;
  lastLoginAt: number;
}

export type EventType =
  | 'Wedding'
  | 'Birthday'
  | 'Corporate'
  | 'Baby Shower'
  | 'Graduation'
  | 'Custom Event'
  | string;

export type CulturalStyleType =
  | 'Modern'
  | 'Elegant'
  | 'Minimalist'
  | 'Traditional'
  | 'Islamic'
  | 'Javanese'
  | 'Sundanese'
  | 'Balinese'
  | 'Minangkabau'
  | 'Batak'
  | 'Bugis/Makassar'
  | 'Malay'
  | 'Contemporary Indonesian'
  | string;

export interface EventRecommendedSections {
  showCountdown: boolean;
  showLoveStory?: boolean;
  showAgenda?: boolean;
  showRsvp: boolean;
  showWishes: boolean;
  showDigitalGift: boolean;
  showMaps: boolean;
  showGallery: boolean;
  showVideo: boolean;
  customSectionTitle?: string;
}

export interface EventSpecificFieldDef {
  fieldKey: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'date' | 'select';
  options?: string[];
}

export interface EventTypeDefaultContent {
  titleTemplate: string;
  hostsLabel: string;
  defaultOpening: string;
  defaultQuote?: string;
  recommendedSections: EventRecommendedSections;
  eventSpecificFields?: EventSpecificFieldDef[];
}

export interface EventTypeDefinition {
  id: string;
  categoryId: string;
  name: string;
  subtypes?: string[];
  description: string;
  culturalTags?: string[];
  themeTags?: string[];
  defaultAnimation?: string;
  defaultColorPalette?: string[];
  defaultTypography?: string;
  defaultMusicStyle?: string;
  recommendedTemplates: string[];
  requiredTier?: SubscriptionTier;
  isPremium?: boolean;
  displayOrder: number;
  isActive: boolean;
  defaultContent: EventTypeDefaultContent;
}

export interface EventCategoryDefinition {
  id: string;
  name: string;
  indonesianName: string;
  icon: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  eventTypes: EventTypeDefinition[];
}

export interface EventProject {
  id: string;
  ownerId?: string;
  name: string;
  type: EventType;
  category?: string;
  eventType?: string;
  subtype?: string;
  culturalStyle?: string;
  date: string;
  time: string;
  location: string;
  status: string;
  notes: string;
  createdAt: number;
}

export interface InvitationData {
  id: string;
  projectId: string;
  title: string;
  hosts: string;
  opening: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  slug: string;
  templateName: string;
  isPublished: boolean;
  views: number;
  category?: string;
  eventType?: string;
  eventSubtype?: string;
  culturalStyle?: string;
  eventSpecificData?: Record<string, string>;
  coverPhoto?: string;
  couplePhoto?: string;
  groomPhoto?: string;
  bridePhoto?: string;
  galleryPhotos?: string[];
  videoUrl?: string;
  videoTitle?: string;
  quote?: string;
  loveStory?: { year: string; title: string; desc: string }[];
  musicUrl?: string;
}

export interface Guest {
  id: string;
  projectId: string;
  name: string;
  group: string; // 'VIP' | 'Family' | 'Friend' | 'Colleague' | 'General'
  pax: number;
  phone: string;
  email: string;
  tableNumber: string;
  rsvpStatus: 'Confirmed' | 'Pending' | 'Declined' | 'Maybe';
  isCheckedIn: boolean;
  checkInTime?: string | null;
  checkInCode: string;
}

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  category: string;
  dueDate: string;
  assignee: string;
  isCompleted: boolean;
}

export type CurrencyCode = 'IDR' | 'USD' | 'EUR' | 'SGD' | 'MYR' | 'GBP' | 'AUD' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rateAgainstIdr: number;
  locale: string;
  decimalPlaces: number;
}

export interface BudgetItem {
  id: string;
  projectId: string;
  category: string;
  plannedAmount: number;
  actualAmount: number;
  notes: string;
}

export interface WeeklyExpenseRecord {
  id: string;
  projectId: string;
  weekNumber: number;
  weekLabel: string;
  dateRange: string;
  amount: number;
  note: string;
  categories: string[];
}

export interface VenueLocation {
  id: string;
  projectId: string;
  name: string;
  type: string;
  address: string;
  time: string;
  mapUrl: string;
}

export interface MemoryItem {
  id: string;
  projectId: string;
  guestName: string;
  message: string;
  timestamp: string;
  photoCount?: number;
}

export interface TemplateItem {
  id: string;
  title: string;
  category: string;
  eventTypeId?: string;
  culturalStyle?: string;
  colorName?: string;
  isPopular?: boolean;
  isNewest?: boolean;
  styleTag: string;
  gradientTheme: string;
  gradientColors: string[];
  description: string;
  svgAsset?: string;
  sampleHosts?: string;
  sampleDate?: string;
  sampleVenue?: string;
  sampleOpening?: string;
  sampleQuote?: string;
  defaultCoverPhoto?: string;
  defaultCouplePhoto?: string;
  defaultGallery?: string[];
  accentColor?: string;
  patternType?:
    | 'floral'
    | 'batik'
    | 'siger'
    | 'balinese'
    | 'modern'
    | 'ballroom'
    | 'festive'
    | 'corporate'
    | 'stars'
    | 'traditional'
    | 'geometric'
    | 'islamic'
    | string;
  requiredTier?: SubscriptionTier;
  badge?: string;
  previewVideoUrl?: string;
  videoAspect?: '9:16' | '16:9';
  animationStyle?: string;
}

export interface PhotoPresetItem {
  id: string;
  name: string;
  toneTag: string;
  temp: string;
  tint: string;
  exposure: string;
  contrast: string;
  highlights: string;
  shadows: string;
  tintColorHex: string;
  tintAlpha: number;
  description: string;
}

export interface VideoSceneBeat {
  timestamp: string;
  action: string;
  shotType: string;
  transition: string;
}

export interface VideoTemplateItem {
  id: string;
  title: string;
  format: string;
  duration: string;
  bpm: string;
  musicStyle: string;
  description: string;
  cameraGear: string;
  colorLut: string;
  sceneBeats: VideoSceneBeat[];
}

export type EmailTemplateCategory =
  | 'INVITATION'
  | 'RSVP_REMINDER'
  | 'VENUE_GUIDE'
  | 'THANK_YOU';

export interface EmailTemplate {
  id: string;
  name: string;
  category: EmailTemplateCategory;
  subject: string;
  body: string;
  isDefault?: boolean;
  updatedAt?: number;
}

export type CampaignTarget =
  | 'ALL'
  | 'PENDING_RSVP'
  | 'CONFIRMED_RSVP'
  | 'VIP_FAMILY';

export type ScheduleTiming =
  | 'IMMEDIATE'
  | 'H_MINUS_7'
  | 'H_MINUS_3'
  | 'H_MINUS_1'
  | 'CUSTOM';

export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENT';

export interface EmailScheduleCampaign {
  id: string;
  projectId: string;
  title: string;
  templateId: string;
  subject: string;
  bodyTemplate: string;
  target: CampaignTarget;
  scheduleTiming: ScheduleTiming;
  scheduledTimeDisplay: string;
  status: CampaignStatus;
  recipientCount: number;
  sentAt?: string | null;
  createdAt: number;
}

export interface AutoReminderRule {
  id: string;
  title: string;
  timing: ScheduleTiming;
  scheduledTimeDisplay: string;
  isEnabled: boolean;
  lastTriggered?: string | null;
  totalDispatched: number;
}

export interface AutoReminderLog {
  id: string;
  timestamp: string;
  recipientCount: number;
  recipientNames: string[];
  triggerSource: string;
  summary: string;
}

export interface AutoRsvpSchedulerConfig {
  projectId: string;
  isEnabled: boolean;
  rules: AutoReminderRule[];
  emailSubject: string;
  emailBody: string;
  lastTriggeredTime?: string | null;
  totalRemindersSent: number;
  logs: AutoReminderLog[];
}

export interface AiConceptResult {
  prompt: string;
  themeTitle: string;
  palette: string[];
  typography: string;
  copywriting: string;
  photoDirection: string;
}

// ==========================================
// NOTIFICATION & EMAIL SYSTEM ARCHITECTURE
// ==========================================

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'WHATSAPP';

export type NotificationCategory =
  | 'ACCOUNT'
  | 'EVENT'
  | 'INVITATION'
  | 'GUEST'
  | 'RSVP'
  | 'CHECK_IN'
  | 'PAYMENT'
  | 'SUBSCRIPTION'
  | 'SECURITY'
  | 'SYSTEM';

export type NotificationType =
  | 'REGISTRATION_SUCCESS'
  | 'EMAIL_VERIFICATION_REQUEST'
  | 'EMAIL_VERIFIED'
  | 'LOGIN_ALERT'
  | 'PASSWORD_RESET_REQUEST'
  | 'PASSWORD_CHANGED'
  | 'PROFILE_UPDATED'
  | 'EVENT_CREATED'
  | 'INVITATION_CREATED'
  | 'INVITATION_PUBLISHED'
  | 'INVITATION_UPDATED'
  | 'GUEST_LIST_UPDATED'
  | 'RSVP_RECEIVED'
  | 'RSVP_CONFIRMATION'
  | 'QR_CHECKIN_SUCCESS'
  | 'GUEST_CHECKED_IN'
  | 'PAYMENT_SUBMITTED'
  | 'PAYMENT_APPROVED'
  | 'PAYMENT_REJECTED'
  | 'PACKAGE_UPGRADED'
  | 'SUBSCRIPTION_EXPIRING'
  | 'SUBSCRIPTION_EXPIRED'
  | 'SUPPORT_REQUEST_RECEIVED'
  | 'ADMIN_SUPPORT_REQUEST'
  | 'ADMIN_NEW_USER'
  | 'ADMIN_PAYMENT_ALERT'
  | 'ADMIN_SECURITY_ALERT'
  | 'SYSTEM_ANNOUNCEMENT';

export interface InAppNotification {
  id: string;
  userId: string;
  targetRole?: UserRole | 'ALL';
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  channel: NotificationChannel;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  createdAt: number;
  readAt?: number;
}

export type EmailDeliveryStatus =
  | 'queued'
  | 'processing'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'bounced';

export interface EmailLogRecord {
  id: string;
  idempotencyKey?: string;
  userId?: string;
  recipient: string;
  recipientName?: string;
  subject: string;
  template: string;
  category: NotificationCategory;
  status: EmailDeliveryStatus;
  provider: string;
  providerMessageId?: string;
  attempts: number;
  maxAttempts: number;
  lastAttemptAt?: number;
  errorMessage?: string;
  metadata?: Record<string, any>;
  htmlPreview?: string;
  sentAt?: number;
  createdAt: number;
}

export type EmailDeliveryLog = EmailLogRecord;

export interface UserNotificationPreferences {
  userId?: string;
  channels: {
    inApp: boolean;
    email: boolean;
    whatsapp: boolean;
  };
  categories: {
    account: boolean;
    event: boolean;
    invitation: boolean;
    guest: boolean;
    rsvp: boolean;
    payment: boolean;
    subscription: boolean;
    security: boolean;
    system: boolean;
  };
  email?: {
    account: boolean;
    events: boolean;
    invitations: boolean;
    rsvp: boolean;
    payments: boolean;
    subscription: boolean;
    security: boolean; // Security emails cannot be disabled
  };
  inApp?: {
    account: boolean;
    events: boolean;
    invitations: boolean;
    rsvp: boolean;
    checkIn: boolean;
    payments: boolean;
    subscription: boolean;
    security: boolean;
    system: boolean;
  };
  whatsapp?: {
    rsvp: boolean;
    checkIn: boolean;
    payments: boolean;
  };
  updatedAt?: number;
}

export interface AdminEmailConfig {
  senderName: string;
  senderEmail: string;
  replyToEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUsername: string;
  smtpConfigured: boolean;
  provider: 'BuiltInGateway' | 'SMTP' | 'Resend' | 'SendGrid';
  dailyQuota: number;
  usedQuotaToday: number;
  enableEmailNotifications: boolean;
  enableInAppNotifications: boolean;
  enableWhatsAppNotifications: boolean;
  updatedAt?: number;
  updatedBy?: string;
}

export interface AnnouncementPayload {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  target: 'ALL' | 'ROLE' | 'TIER' | 'EVENT_OWNERS';
  targetRole?: UserRole;
  targetTier?: SubscriptionTier;
  channels: NotificationChannel[];
  sendEmail: boolean;
  sendInApp: boolean;
  sendWhatsApp: boolean;
  actionUrl?: string;
  actionLabel?: string;
  scheduledAt?: string | null;
  createdAt: number;
  sentCount: number;
}

