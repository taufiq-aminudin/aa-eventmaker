export type UserRole = 'ORGANIZER' | 'CLIENT' | 'VENDOR' | 'GUEST';

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

export type EventType =
  | 'Wedding'
  | 'Birthday'
  | 'Corporate'
  | 'Baby Shower'
  | 'Graduation'
  | 'Custom Event';

export interface EventProject {
  id: string;
  name: string;
  type: EventType;
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
  patternType?: 'floral' | 'batik' | 'siger' | 'balinese' | 'modern' | 'ballroom' | 'festive' | 'corporate' | 'stars';
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
