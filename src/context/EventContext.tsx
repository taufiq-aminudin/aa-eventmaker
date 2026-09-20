import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EventProject,
  InvitationData,
  Guest,
  TaskItem,
  BudgetItem,
  WeeklyExpenseRecord,
  CurrencyCode,
  VenueLocation,
  MemoryItem,
  TemplateItem,
  EmailTemplate,
  EmailScheduleCampaign,
  AutoRsvpSchedulerConfig,
  AiConceptResult,
  CampaignTarget,
  ScheduleTiming,
  CampaignStatus,
  AutoReminderRule,
  EventType,
  UserRole,
  AppUser,
  PaymentSubmission,
  PaymentStatus,
  PaymentMethodType,
} from '../types';
import {
  INITIAL_PROJECT,
  INITIAL_INVITATION,
  INITIAL_GUESTS,
  INITIAL_TASKS,
  INITIAL_BUDGETS,
  INITIAL_WEEKLY_EXPENSES,
  INITIAL_LOCATIONS,
  INITIAL_MEMORIES,
  TEMPLATES_DATA,
  DEFAULT_EMAIL_TEMPLATES,
  INITIAL_CAMPAIGNS,
  INITIAL_AUTO_RSVP_CONFIG,
  INITIAL_AI_CONCEPT,
} from '../data/initialData';
import { filterGuestsByTarget } from '../utils/templateEngine';
import { formatCurrency, formatCurrencyShort, getCurrencyConfig } from '../utils/currency';

interface EventContextType {
  // Navigation & View Modals
  activeTab: number;
  setActiveTab: (tab: number) => void;
  showPublicPreview: boolean;
  setShowPublicPreview: (show: boolean) => void;
  showQrCheckinModal: boolean;
  setShowQrCheckinModal: (show: boolean) => void;
  selectedGuestForPass: Guest | null;
  setSelectedGuestForPass: (guest: Guest | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Auth, Roles & Public Portal
  currentUser: AppUser | null;
  activeRole: UserRole;
  isAuthenticated: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'register' | 'registered_success';
  setAuthModalMode: (mode: 'login' | 'register' | 'registered_success') => void;
  showPublicLanding: boolean;
  setShowPublicLanding: (show: boolean) => void;
  lastRegisteredUser: AppUser | null;
  login: (email: string, role?: UserRole) => boolean;
  loginWithGoogle: (googleProfile?: { name: string; email: string; avatar?: string; role?: UserRole }) => boolean;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    organizationName?: string;
  }) => AppUser;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Project
  currentProject: EventProject;
  projects: EventProject[];
  selectProject: (proj: EventProject) => void;
  createProject: (
    name: string,
    type: EventType,
    date: string,
    time: string,
    location: string
  ) => EventProject;
  updateProject: (updated: EventProject) => void;

  // Invitation
  invitation: InvitationData;
  updateInvitation: (updated: Partial<InvitationData>) => void;
  selectTemplate: (templateName: string) => void;
  templates: TemplateItem[];

  // Guests
  guests: Guest[];
  addGuest: (data: {
    name: string;
    group: string;
    pax: number;
    phone: string;
    email: string;
    tableNumber: string;
    rsvpStatus?: 'Confirmed' | 'Pending' | 'Declined' | 'Maybe';
  }) => Guest;
  updateGuest: (updated: Guest) => void;
  deleteGuest: (guestId: string) => void;
  checkInGuest: (guestId: string) => Guest | null;
  checkInByCodeOrQr: (payload: string) => { success: boolean; message: string; guest?: Guest };
  submitRsvp: (guestName: string, status: 'Confirmed' | 'Declined' | 'Maybe', pax: number, notes: string) => void;

  // Tasks / Planner
  tasks: TaskItem[];
  addTask: (title: string, category: string, dueDate: string, assignee: string) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;

  // Budget
  budgets: BudgetItem[];
  addBudgetItem: (category: string, planned: number, actual: number, notes: string) => void;
  updateBudgetItem: (updated: BudgetItem) => void;
  deleteBudgetItem: (id: string) => void;
  weeklyExpenses: WeeklyExpenseRecord[];
  addWeeklyExpense: (item: {
    weekLabel: string;
    dateRange: string;
    amount: number;
    note: string;
    categories: string[];
  }) => void;
  deleteWeeklyExpense: (id: string) => void;

  // Currency Switcher
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatCost: (
    amountInIdr: number,
    options?: { showDecimals?: boolean; includeCode?: boolean }
  ) => string;
  formatCostShort: (amountInIdr: number) => string;

  // Locations & Memories
  locations: VenueLocation[];
  addLocation: (name: string, type: string, address: string, time: string, mapUrl: string) => void;
  memories: MemoryItem[];
  addMemory: (guestName: string, message: string) => void;

  // Email Campaigns
  emailTemplates: EmailTemplate[];
  saveEmailTemplate: (template: EmailTemplate) => void;
  deleteEmailTemplate: (templateId: string) => void;
  campaigns: EmailScheduleCampaign[];
  scheduleCampaign: (params: {
    title: string;
    templateId: string;
    subject: string;
    bodyTemplate: string;
    target: CampaignTarget;
    scheduleTiming: ScheduleTiming;
    customTimeDisplay?: string;
  }) => EmailScheduleCampaign;
  updateCampaignStatus: (id: string, newStatus: CampaignStatus) => void;
  deleteCampaign: (id: string) => void;

  // Auto RSVP Scheduler
  autoRsvpConfig: AutoRsvpSchedulerConfig;
  toggleAutoRsvpScheduler: (enabled: boolean) => void;
  toggleAutoReminderRule: (ruleId: string, enabled: boolean) => void;
  addOrUpdateAutoReminderRule: (rule: AutoReminderRule) => void;
  deleteAutoReminderRule: (ruleId: string) => void;
  updateAutoReminderTemplate: (subject: string, body: string) => void;
  triggerPendingRsvpRemindersNow: (triggerSource?: string) => { count: number; names: string[] };
  sendSingleRsvpReminder: (guestId: string) => Guest | null;

  // AI Concept Creator
  aiConcept: AiConceptResult;
  generateAiConcept: (prompt: string) => void;

  // Payment Management
  payments: PaymentSubmission[];
  activeSubscriptionTier: 'starter' | 'professional' | 'agency';
  submitPayment: (data: {
    customerName: string;
    email: string;
    phone: string;
    packageId: string;
    packageName: string;
    amount: number;
    amountFormatted: string;
    paymentMethod: PaymentMethodType;
    paymentDate: string;
    referenceNumber: string;
    proofDataUrl?: string;
    proofFileName?: string;
    proofFileType?: string;
    notes?: string;
  }) => PaymentSubmission;
  updatePaymentStatus: (paymentId: string, status: PaymentStatus, adminNotes?: string) => void;
  deletePayment: (paymentId: string) => void;
}

export const DEFAULT_USERS: Record<UserRole, AppUser> = {
  ORGANIZER: {
    id: 'user_eo_01',
    name: 'Dimas & Sinta Wedding Organizer',
    email: 'organizer@aa-eventmaker.my.id',
    phone: '+6281234567890',
    role: 'ORGANIZER',
    organizationName: 'Pratama Event & Wedding Planner',
    associatedEventId: 'proj-1',
    createdAt: 1715000000000,
  },
  CLIENT: {
    id: 'user_client_01',
    name: 'Dimas & Sinta (Calon Pengantin)',
    email: 'klien@aa-eventmaker.my.id',
    phone: '+6281987654321',
    role: 'CLIENT',
    associatedEventId: 'proj-1',
    createdAt: 1716000000000,
  },
  VENDOR: {
    id: 'user_vendor_01',
    name: 'Mahkota Fotografi & Catering',
    email: 'vendor@aa-eventmaker.my.id',
    phone: '+6285712345678',
    role: 'VENDOR',
    organizationName: 'Mahkota Wedding Artistry & Culinary',
    associatedEventId: 'proj-1',
    createdAt: 1715500000000,
  },
  GUEST: {
    id: 'user_guest_01',
    name: 'Bpk. Hendra Gunawan & Partner',
    email: 'tamu@aa-eventmaker.my.id',
    phone: '+6281398765432',
    role: 'GUEST',
    associatedEventId: 'proj-1',
    createdAt: 1717000000000,
  },
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showPublicPreview, setShowPublicPreview] = useState<boolean>(false);
  const [showQrCheckinModal, setShowQrCheckinModal] = useState<boolean>(false);
  const [selectedGuestForPass, setSelectedGuestForPass] = useState<Guest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auth & Roles State: Default to null for public visitor experience
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('aa_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('aa_active_role') as UserRole | null;
    return saved || 'ORGANIZER';
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'registered_success'>('login');
  const [showPublicLanding, setShowPublicLanding] = useState<boolean>(() => {
    // If no logged in user, show public landing page by default
    const saved = localStorage.getItem('aa_current_user');
    return !saved;
  });
  const [lastRegisteredUser, setLastRegisteredUser] = useState<AppUser | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  const loginWithGoogle = (googleProfile?: { name: string; email: string; avatar?: string; role?: UserRole }): boolean => {
    const profile = googleProfile || {
      name: 'Taufiq Aminudin',
      email: 'taufiq.aminudin@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role: 'ORGANIZER' as UserRole,
    };

    const targetRole = profile.role || 'ORGANIZER';
    const googleUser: AppUser = {
      id: `usr_google_${Date.now()}`,
      name: profile.name,
      email: profile.email,
      phone: '+6281234567890',
      role: targetRole,
      organizationName: 'Event Planner & Organizer',
      associatedEventId: currentProject.id,
      createdAt: Date.now(),
    };

    setCurrentUser(googleUser);
    setActiveRole(targetRole);
    localStorage.setItem('aa_current_user', JSON.stringify(googleUser));
    localStorage.setItem('aa_active_role', targetRole);
    setShowAuthModal(false);
    setShowPublicLanding(false);
    showToast(`Berhasil masuk dengan Google sebagai ${googleUser.name}!`);
    return true;
  };

  const login = (email: string, role?: UserRole): boolean => {
    const targetRole = role || 'ORGANIZER';
    const matchedUser: AppUser = DEFAULT_USERS[targetRole] || {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      phone: '+6281234567890',
      role: targetRole,
      createdAt: Date.now(),
    };

    setCurrentUser(matchedUser);
    setActiveRole(targetRole);
    localStorage.setItem('aa_current_user', JSON.stringify(matchedUser));
    localStorage.setItem('aa_active_role', targetRole);
    setShowAuthModal(false);
    setShowPublicLanding(false);
    showToast(`Selamat datang kembali, ${matchedUser.name}!`);
    return true;
  };

  const register = (data: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    organizationName?: string;
  }): AppUser => {
    const newUser: AppUser = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      organizationName: data.organizationName,
      associatedEventId: currentProject.id,
      createdAt: Date.now(),
    };

    setCurrentUser(newUser);
    setActiveRole(newUser.role);
    setLastRegisteredUser(newUser);
    localStorage.setItem('aa_current_user', JSON.stringify(newUser));
    localStorage.setItem('aa_active_role', newUser.role);
    setShowPublicLanding(false);
    setShowAuthModal(false);
    showToast(`Pendaftaran berhasil! Akun ${newUser.role} Anda telah aktif.`);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aa_current_user');
    setShowPublicLanding(true);
    showToast('Anda telah keluar dari akun.');
  };

  const switchRole = (newRole: UserRole) => {
    setActiveRole(newRole);
    localStorage.setItem('aa_active_role', newRole);
    if (DEFAULT_USERS[newRole]) {
      setCurrentUser(DEFAULT_USERS[newRole]);
      localStorage.setItem('aa_current_user', JSON.stringify(DEFAULT_USERS[newRole]));
    }
    showToast(`Beralih ke Dashboard ${newRole}`);
  };

  // State with LocalStorage fallback
  const [projects, setProjects] = useState<EventProject[]>(() => {
    const saved = localStorage.getItem('aa_event_projects');
    return saved ? JSON.parse(saved) : [INITIAL_PROJECT];
  });

  const [currentProject, setCurrentProject] = useState<EventProject>(() => {
    const saved = localStorage.getItem('aa_current_project');
    return saved ? JSON.parse(saved) : INITIAL_PROJECT;
  });

  const [invitation, setInvitation] = useState<InvitationData>(() => {
    const saved = localStorage.getItem('aa_invitation');
    return saved ? JSON.parse(saved) : INITIAL_INVITATION;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('aa_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('aa_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [budgets, setBudgets] = useState<BudgetItem[]>(() => {
    const saved = localStorage.getItem('aa_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [weeklyExpenses, setWeeklyExpenses] = useState<WeeklyExpenseRecord[]>(() => {
    const saved = localStorage.getItem('aa_weekly_expenses');
    return saved ? JSON.parse(saved) : INITIAL_WEEKLY_EXPENSES;
  });

  const [locations, setLocations] = useState<VenueLocation[]>(() => {
    const saved = localStorage.getItem('aa_locations');
    return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
  });

  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    const saved = localStorage.getItem('aa_memories');
    return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
  });

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(() => {
    const saved = localStorage.getItem('aa_email_templates');
    return saved ? JSON.parse(saved) : DEFAULT_EMAIL_TEMPLATES;
  });

  const [campaigns, setCampaigns] = useState<EmailScheduleCampaign[]>(() => {
    const saved = localStorage.getItem('aa_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [autoRsvpConfig, setAutoRsvpConfig] = useState<AutoRsvpSchedulerConfig>(() => {
    const saved = localStorage.getItem('aa_auto_rsvp_config');
    return saved ? JSON.parse(saved) : INITIAL_AUTO_RSVP_CONFIG;
  });

  const [aiConcept, setAiConcept] = useState<AiConceptResult>(() => {
    const saved = localStorage.getItem('aa_ai_concept');
    return saved ? JSON.parse(saved) : INITIAL_AI_CONCEPT;
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('aa_selected_currency');
    return (saved as CurrencyCode) || 'IDR';
  });

  const INITIAL_PAYMENTS: PaymentSubmission[] = [
    {
      id: 'pay_sub_01',
      orderId: 'AA-PAY-2026-9182',
      customerName: 'Bagas Prasetyo & Annisa',
      email: 'bagas.annisa@gmail.com',
      phone: '081289123456',
      packageId: 'professional',
      packageName: 'Wedding Professional',
      amount: 299000,
      amountFormatted: 'Rp 299.000',
      paymentMethod: 'Bank Mandiri',
      paymentDate: '2026-09-18',
      referenceNumber: 'MDR-8823901429',
      proofFileName: 'bukti_transfer_mandiri_bagas.jpg',
      proofFileType: 'image/jpeg',
      notes: 'Mohon verifikasi segera untuk persiapan resepsi November 2026.',
      status: 'Pending',
      createdAt: 1726650000000,
    },
    {
      id: 'pay_sub_02',
      orderId: 'AA-PAY-2026-8741',
      customerName: 'Citra Kirana & Reza',
      email: 'citra.reza@gmail.com',
      phone: '081377889900',
      packageId: 'professional',
      packageName: 'Wedding Professional',
      amount: 299000,
      amountFormatted: 'Rp 299.000',
      paymentMethod: 'DANA',
      paymentDate: '2026-09-19',
      referenceNumber: 'DANA-20260919102948',
      proofFileName: 'dana_transfer_citra.png',
      proofFileType: 'image/png',
      notes: 'Transfer via dompet DANA ke nomor 081382000412.',
      status: 'Under Review',
      adminNotes: 'Sedang dicek mutasi saldo masuk ke DANA Taufiq Aminudin.',
      createdAt: 1726730000000,
    },
    {
      id: 'pay_sub_03',
      orderId: 'AA-PAY-2026-7612',
      customerName: 'Pratama Wedding Planner (Rian)',
      email: 'rian@pratamaplanner.com',
      phone: '081122334455',
      packageId: 'agency',
      packageName: 'EO & Agency',
      amount: 899000,
      amountFormatted: 'Rp 899.000',
      paymentMethod: 'Bank Mandiri',
      paymentDate: '2026-09-15',
      referenceNumber: 'MDR-9901823712',
      proofFileName: 'mandiri_livin_agency_rian.jpg',
      proofFileType: 'image/jpeg',
      notes: 'Upgrade lisensi tahunan EO & Agency untuk 5 event klien.',
      status: 'Paid',
      adminNotes: 'Dana sudah terverifikasi di mutasi Mandiri Taufiq Aminudin. Akun Agency aktif.',
      reviewedBy: 'Taufiq Aminudin (Admin)',
      reviewedAt: '15/09/2026, 14:20 WIB',
      createdAt: 1726380000000,
    },
  ];

  const [payments, setPayments] = useState<PaymentSubmission[]>(() => {
    const saved = localStorage.getItem('aa_payments_data');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [activeSubscriptionTier, setActiveSubscriptionTier] = useState<'starter' | 'professional' | 'agency'>(() => {
    const saved = localStorage.getItem('aa_active_subscription_tier');
    return (saved as 'starter' | 'professional' | 'agency') || 'starter';
  });

  // Sync payments & subscription
  useEffect(() => {
    localStorage.setItem('aa_payments_data', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('aa_active_subscription_tier', activeSubscriptionTier);
  }, [activeSubscriptionTier]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('aa_event_projects', JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem('aa_current_project', JSON.stringify(currentProject));
  }, [currentProject]);
  useEffect(() => {
    localStorage.setItem('aa_invitation', JSON.stringify(invitation));
  }, [invitation]);
  useEffect(() => {
    localStorage.setItem('aa_guests', JSON.stringify(guests));
  }, [guests]);
  useEffect(() => {
    localStorage.setItem('aa_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem('aa_budgets', JSON.stringify(budgets));
  }, [budgets]);
  useEffect(() => {
    localStorage.setItem('aa_weekly_expenses', JSON.stringify(weeklyExpenses));
  }, [weeklyExpenses]);
  useEffect(() => {
    localStorage.setItem('aa_locations', JSON.stringify(locations));
  }, [locations]);
  useEffect(() => {
    localStorage.setItem('aa_memories', JSON.stringify(memories));
  }, [memories]);
  useEffect(() => {
    localStorage.setItem('aa_email_templates', JSON.stringify(emailTemplates));
  }, [emailTemplates]);
  useEffect(() => {
    localStorage.setItem('aa_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);
  useEffect(() => {
    localStorage.setItem('aa_auto_rsvp_config', JSON.stringify(autoRsvpConfig));
  }, [autoRsvpConfig]);
  useEffect(() => {
    localStorage.setItem('aa_ai_concept', JSON.stringify(aiConcept));
  }, [aiConcept]);

  // Project functions
  const selectProject = (proj: EventProject) => {
    setCurrentProject(proj);
    showToast(`Beralih ke proyek: ${proj.name}`);
  };

  const createProject = (
    name: string,
    type: EventType,
    date: string,
    time: string,
    location: string
  ): EventProject => {
    const newProj: EventProject = {
      id: `proj-${Date.now()}`,
      name,
      type,
      date,
      time,
      location,
      status: 'Planning',
      notes: '',
      createdAt: Date.now(),
    };
    setProjects((prev) => [newProj, ...prev]);
    setCurrentProject(newProj);
    setInvitation((prev) => ({
      ...prev,
      projectId: newProj.id,
      title: name,
      date,
      time,
      venue: location,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }));
    showToast(`Proyek baru "${name}" berhasil dibuat!`);
    return newProj;
  };

  const updateProject = (updated: EventProject) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (currentProject.id === updated.id) {
      setCurrentProject(updated);
    }
    showToast('Detail proyek diperbarui.');
  };

  // Invitation functions
  const updateInvitation = (updated: Partial<InvitationData>) => {
    setInvitation((prev) => ({ ...prev, ...updated }));
    showToast('Pengaturan undangan berhasil disimpan.');
  };

  const selectTemplate = (templateName: string) => {
    setInvitation((prev) => ({ ...prev, templateName }));
    showToast(`Tema undangan diubah ke: ${templateName}`);
  };

  // Guests functions
  const addGuest = (data: {
    name: string;
    group: string;
    pax: number;
    phone: string;
    email: string;
    tableNumber: string;
    rsvpStatus?: 'Confirmed' | 'Pending' | 'Declined' | 'Maybe';
  }): Guest => {
    const id = `guest-${Date.now()}`;
    const codeHash = Math.abs(id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0))
      .toString(36)
      .toUpperCase()
      .slice(0, 4);
    const newGuest: Guest = {
      id,
      projectId: currentProject.id,
      name: data.name,
      group: data.group || 'General',
      pax: data.pax || 1,
      phone: data.phone || '',
      email: data.email || '',
      tableNumber: data.tableNumber || 'VIP 01',
      rsvpStatus: data.rsvpStatus || 'Confirmed',
      isCheckedIn: false,
      checkInCode: `AA-${codeHash || 'OK88'}`,
    };
    setGuests((prev) => [newGuest, ...prev]);
    showToast(`Tamu "${data.name}" berhasil ditambahkan.`);
    return newGuest;
  };

  const updateGuest = (updated: Guest) => {
    setGuests((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    showToast(`Data tamu "${updated.name}" diperbarui.`);
  };

  const deleteGuest = (guestId: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
    showToast('Tamu berhasil dihapus dari daftar.');
  };

  const checkInGuest = (guestId: string): Guest | null => {
    const guest = guests.find((g) => g.id === guestId);
    if (!guest) return null;
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const updated: Guest = { ...guest, isCheckedIn: true, checkInTime: timeNow };
    setGuests((prev) => prev.map((g) => (g.id === guestId ? updated : g)));
    showToast(`Check-In Berhasil: ${updated.name} (${updated.pax} Pax) • Meja: ${updated.tableNumber}`);
    return updated;
  };

  const checkInByCodeOrQr = (
    payload: string
  ): { success: boolean; message: string; guest?: Guest } => {
    const clean = payload.trim();
    let targetGuest: Guest | undefined;

    // Try parsing as JSON EVENT_PASS
    try {
      const parsed = JSON.parse(clean);
      if (parsed.id) {
        targetGuest = guests.find((g) => g.id === parsed.id || g.name === parsed.name);
      }
    } catch {
      // not JSON
    }

    if (!targetGuest) {
      targetGuest = guests.find((g) => {
        return (
          g.checkInCode.toLowerCase() === clean.toLowerCase() ||
          g.id === clean ||
          clean.toLowerCase().includes(`code=${g.checkInCode.toLowerCase()}`) ||
          clean.includes(`id=${g.id}`) ||
          (clean.length >= 3 && g.name.toLowerCase().includes(clean.toLowerCase())) ||
          (g.phone && clean.includes(g.phone))
        );
      });
    }

    if (!targetGuest) {
      return {
        success: false,
        message: 'Kode E-Pass tidak dikenali atau tamu tidak terdaftar.',
      };
    }

    if (targetGuest.isCheckedIn) {
      return {
        success: true,
        message: `${targetGuest.name} sudah check-in sebelumnya pada pukul ${targetGuest.checkInTime}.`,
        guest: targetGuest,
      };
    }

    const checked = checkInGuest(targetGuest.id);
    return {
      success: true,
      message: `Berhasil Check-In: ${targetGuest.name} (${targetGuest.pax} Pax) • Meja: ${targetGuest.tableNumber}`,
      guest: checked || targetGuest,
    };
  };

  const submitRsvp = (
    guestName: string,
    status: 'Confirmed' | 'Declined' | 'Maybe',
    pax: number,
    notes: string
  ) => {
    const existing = guests.find((g) => g.name.toLowerCase() === guestName.toLowerCase());
    if (existing) {
      setGuests((prev) =>
        prev.map((g) => (g.id === existing.id ? { ...g, rsvpStatus: status, pax } : g))
      );
    } else {
      addGuest({
        name: guestName,
        group: 'General',
        pax,
        phone: '',
        email: '',
        tableNumber: 'Table 10',
        rsvpStatus: status,
      });
    }

    if (notes.trim()) {
      addMemory(guestName, notes);
    }
    showToast(`RSVP "${guestName}" status: ${status} berhasil dikonfirmasi!`);
  };

  // Planner functions
  const addTask = (title: string, category: string, dueDate: string, assignee: string) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      projectId: currentProject.id,
      title,
      category: category || 'General',
      dueDate: dueDate || 'Segera',
      assignee: assignee || 'Unassigned',
      isCompleted: false,
    };
    setTasks((prev) => [...prev, newTask]);
    showToast(`Tugas "${title}" berhasil ditambahkan.`);
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Tugas dihapus.');
  };

  // Budget functions
  const addBudgetItem = (category: string, planned: number, actual: number, notes: string) => {
    const item: BudgetItem = {
      id: `budget-${Date.now()}`,
      projectId: currentProject.id,
      category,
      plannedAmount: planned,
      actualAmount: actual,
      notes,
    };
    setBudgets((prev) => [...prev, item]);
    showToast(`Item anggaran "${category}" ditambahkan.`);
  };

  const updateBudgetItem = (updated: BudgetItem) => {
    setBudgets((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    showToast(`Item anggaran "${updated.category}" diperbarui.`);
  };

  const deleteBudgetItem = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    showToast('Item anggaran dihapus.');
  };

  const addWeeklyExpense = (item: {
    weekLabel: string;
    dateRange: string;
    amount: number;
    note: string;
    categories: string[];
  }) => {
    const nextNum = weeklyExpenses.length + 1;
    const newRecord: WeeklyExpenseRecord = {
      id: `wexp-${Date.now()}`,
      projectId: currentProject.id,
      weekNumber: nextNum,
      weekLabel: item.weekLabel || `Minggu ${nextNum}`,
      dateRange: item.dateRange || 'Baru',
      amount: item.amount,
      note: item.note,
      categories: item.categories.length > 0 ? item.categories : ['Vendor Acara'],
    };
    setWeeklyExpenses((prev) => [...prev, newRecord]);
    showToast(`Pengeluaran ${newRecord.weekLabel} berhasil dicatat.`);
  };

  const deleteWeeklyExpense = (id: string) => {
    setWeeklyExpenses((prev) => prev.filter((w) => w.id !== id));
    showToast('Catatan pengeluaran mingguan dihapus.');
  };

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem('aa_selected_currency', c);
    const cfg = getCurrencyConfig(c);
    showToast(`Format mata uang diubah ke ${cfg.name} (${cfg.code} ${cfg.symbol})`);
  };

  const formatCost = (
    amountInIdr: number,
    options?: { showDecimals?: boolean; includeCode?: boolean }
  ) => {
    return formatCurrency(amountInIdr, currency, options);
  };

  const formatCostShort = (amountInIdr: number) => {
    return formatCurrencyShort(amountInIdr, currency);
  };

  // Locations & Memories
  const addLocation = (
    name: string,
    type: string,
    address: string,
    time: string,
    mapUrl: string
  ) => {
    const loc: VenueLocation = {
      id: `loc-${Date.now()}`,
      projectId: currentProject.id,
      name,
      type,
      address,
      time,
      mapUrl: mapUrl || `https://maps.google.com/?q=${encodeURIComponent(name + ' ' + address)}`,
    };
    setLocations((prev) => [...prev, loc]);
    showToast(`Lokasi acara "${name}" ditambahkan.`);
  };

  const addMemory = (guestName: string, message: string) => {
    const now = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const mem: MemoryItem = {
      id: `mem-${Date.now()}`,
      projectId: currentProject.id,
      guestName,
      message,
      timestamp: now,
    };
    setMemories((prev) => [mem, ...prev]);
    showToast(`Ucapan & memori dari "${guestName}" tersimpan.`);
  };

  // Email Campaign functions
  const saveEmailTemplate = (template: EmailTemplate) => {
    setEmailTemplates((prev) => {
      const exists = prev.some((t) => t.id === template.id);
      if (exists) {
        return prev.map((t) => (t.id === template.id ? template : t));
      }
      return [...prev, template];
    });
    showToast(`Templat email "${template.name}" berhasil disimpan.`);
  };

  const deleteEmailTemplate = (templateId: string) => {
    setEmailTemplates((prev) => prev.filter((t) => t.id !== templateId));
    showToast('Templat email dihapus.');
  };

  const scheduleCampaign = (params: {
    title: string;
    templateId: string;
    subject: string;
    bodyTemplate: string;
    target: CampaignTarget;
    scheduleTiming: ScheduleTiming;
    customTimeDisplay?: string;
  }): EmailScheduleCampaign => {
    const targetGuests = filterGuestsByTarget(params.target, guests);
    const isImmediate = params.scheduleTiming === 'IMMEDIATE';
    const nowStr =
      new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB';

    const timingDisplay =
      params.scheduleTiming === 'IMMEDIATE'
        ? 'Langsung Dikirim'
        : params.scheduleTiming === 'H_MINUS_7'
        ? 'H-7 Sebelum Acara (09:00 WIB)'
        : params.scheduleTiming === 'H_MINUS_3'
        ? 'H-3 Sebelum Acara (10:00 WIB)'
        : params.scheduleTiming === 'H_MINUS_1'
        ? 'H-1 Hari-H (08:00 WIB)'
        : params.customTimeDisplay || 'Kustom';

    const newCamp: EmailScheduleCampaign = {
      id: `camp-${Date.now()}`,
      projectId: currentProject.id,
      title: params.title,
      templateId: params.templateId,
      subject: params.subject,
      bodyTemplate: params.bodyTemplate,
      target: params.target,
      scheduleTiming: params.scheduleTiming,
      scheduledTimeDisplay: timingDisplay,
      status: isImmediate ? 'SENT' : 'SCHEDULED',
      recipientCount: targetGuests.length,
      sentAt: isImmediate ? nowStr : null,
      createdAt: Date.now(),
    };

    setCampaigns((prev) => [newCamp, ...prev]);
    showToast(
      isImmediate
        ? `Kampanye broadcast berhasil dikirimkan ke ${targetGuests.length} tamu!`
        : `Jadwal kampanye broadcast "${params.title}" berhasil disimpan.`
    );
    return newCamp;
  };

  const updateCampaignStatus = (id: string, newStatus: CampaignStatus) => {
    const nowStr =
      new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB';
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: newStatus,
              sentAt: newStatus === 'SENT' ? nowStr : c.sentAt,
            }
          : c
      )
    );
    showToast(`Status kampanye diubah menjadi: ${newStatus}`);
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    showToast('Kampanye broadcast dihapus.');
  };

  // Auto RSVP Scheduler functions
  const toggleAutoRsvpScheduler = (enabled: boolean) => {
    setAutoRsvpConfig((prev) => ({ ...prev, isEnabled: enabled }));
    showToast(enabled ? 'Otomatisasi RSVP diaktifkan.' : 'Otomatisasi RSVP dinonaktifkan.');
  };

  const toggleAutoReminderRule = (ruleId: string, enabled: boolean) => {
    setAutoRsvpConfig((prev) => ({
      ...prev,
      rules: prev.rules.map((r) => (r.id === ruleId ? { ...r, isEnabled: enabled } : r)),
    }));
    showToast(`Pengaturan pengingat otomatis diperbarui.`);
  };

  const addOrUpdateAutoReminderRule = (rule: AutoReminderRule) => {
    setAutoRsvpConfig((prev) => {
      const exists = prev.rules.some((r) => r.id === rule.id);
      return {
        ...prev,
        rules: exists ? prev.rules.map((r) => (r.id === rule.id ? rule : r)) : [...prev.rules, rule],
      };
    });
    showToast(`Aturan pengingat "${rule.title}" disimpan.`);
  };

  const deleteAutoReminderRule = (ruleId: string) => {
    setAutoRsvpConfig((prev) => ({
      ...prev,
      rules: prev.rules.filter((r) => r.id !== ruleId),
    }));
    showToast('Aturan pengingat dihapus.');
  };

  const updateAutoReminderTemplate = (subject: string, body: string) => {
    setAutoRsvpConfig((prev) => ({
      ...prev,
      emailSubject: subject,
      emailBody: body,
    }));
    showToast('Format pesan pengingat otomatis disimpan.');
  };

  const triggerPendingRsvpRemindersNow = (
    triggerSource = 'Trigger Manual Planners'
  ): { count: number; names: string[] } => {
    const pendingGuests = guests.filter(
      (g) => g.rsvpStatus.toLowerCase() === 'pending' || g.rsvpStatus.toLowerCase() === 'maybe'
    );
    const nowStr =
      new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB';

    const count = pendingGuests.length;
    const names = pendingGuests.map((g) => g.name);

    if (count > 0) {
      const campaign: EmailScheduleCampaign = {
        id: `camp-auto-${Date.now()}`,
        projectId: currentProject.id,
        title: `Otomatisasi RSVP: Pengingat untuk ${count} Tamu Pending`,
        templateId: 'tmpl_rsvp_reminder',
        subject: autoRsvpConfig.emailSubject,
        bodyTemplate: autoRsvpConfig.emailBody,
        target: 'PENDING_RSVP',
        scheduleTiming: 'IMMEDIATE',
        scheduledTimeDisplay: `Dieksekusi (${nowStr})`,
        status: 'SENT',
        recipientCount: count,
        sentAt: nowStr,
        createdAt: Date.now(),
      };
      setCampaigns((prev) => [campaign, ...prev]);

      setAutoRsvpConfig((prev) => ({
        ...prev,
        lastTriggeredTime: nowStr,
        totalRemindersSent: prev.totalRemindersSent + count,
        logs: [
          {
            id: `log-${Date.now()}`,
            timestamp: nowStr,
            recipientCount: count,
            recipientNames: names,
            triggerSource,
            summary: `Berhasil mengirim pengingat RSVP pesan ke ${count} tamu yang belum merespon.`,
          },
          ...prev.logs,
        ],
      }));
      showToast(`Pengingat RSVP otomatis berhasil dikirimkan ke ${count} tamu!`);
    } else {
      showToast('Tidak ada tamu dengan status RSVP pending.');
    }

    return { count, names };
  };

  const sendSingleRsvpReminder = (guestId: string): Guest | null => {
    const guest = guests.find((g) => g.id === guestId);
    if (!guest) return null;

    const nowStr =
      new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB';

    const campaign: EmailScheduleCampaign = {
      id: `camp-single-${Date.now()}`,
      projectId: currentProject.id,
      title: `Pengingat RSVP Personal: ${guest.name}`,
      templateId: 'tmpl_rsvp_reminder',
      subject: autoRsvpConfig.emailSubject,
      bodyTemplate: autoRsvpConfig.emailBody,
      target: 'PENDING_RSVP',
      scheduleTiming: 'IMMEDIATE',
      scheduledTimeDisplay: `Direct (${nowStr})`,
      status: 'SENT',
      recipientCount: 1,
      sentAt: nowStr,
      createdAt: Date.now(),
    };
    setCampaigns((prev) => [campaign, ...prev]);

    setAutoRsvpConfig((prev) => ({
      ...prev,
      lastTriggeredTime: nowStr,
      totalRemindersSent: prev.totalRemindersSent + 1,
      logs: [
        {
          id: `log-single-${Date.now()}`,
          timestamp: nowStr,
          recipientCount: 1,
          recipientNames: [guest.name],
          triggerSource: 'Nudge Personal Tamu',
          summary: `Pengingat RSVP personal dikirim khusus ke ${guest.name}`,
        },
        ...prev.logs,
      ],
    }));
    showToast(`Pengingat personal RSVP terkirim ke: ${guest.name}`);
    return guest;
  };

  // AI Concept Creator
  const generateAiConcept = (prompt: string) => {
    const clean = prompt.trim() || 'Pernikahan adat modern elegan';
    const words = clean.split(' ').slice(0, 3).join(' ');
    const titleCaseWords = words.charAt(0).toUpperCase() + words.slice(1);

    const generated: AiConceptResult = {
      prompt: clean,
      themeTitle: `Concept: ${titleCaseWords} Royale`,
      palette: [
        'Velvet Plum #4C1D95',
        'Blush Rose #EC4899',
        'Warm Ivory #FFFBEB',
        'Antique Gold #D97706',
      ],
      typography: 'Playfair Display (Display Serif) + Plus Jakarta Sans (Clean Modern)',
      copywriting:
        'Dengan penuh rasa syukur atas kebaikan dan anugerah cinta, kami mengundang kehadiran Bapak/Ibu/Saudara/i untuk melengkapi kebahagiaan kami.',
      photoDirection:
        'Soft cinematic portraiture, warm tungsten illumination, editorial framing dengan busana modern',
    };
    setAiConcept(generated);
    showToast(`Konsep tema AI "${generated.themeTitle}" berhasil dirumuskan!`);
  };

  // Payment Actions
  const submitPayment = (data: {
    customerName: string;
    email: string;
    phone: string;
    packageId: string;
    packageName: string;
    amount: number;
    amountFormatted: string;
    paymentMethod: PaymentMethodType;
    paymentDate: string;
    referenceNumber: string;
    proofDataUrl?: string;
    proofFileName?: string;
    proofFileType?: string;
    notes?: string;
  }): PaymentSubmission => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `AA-PAY-${new Date().getFullYear()}-${randomSuffix}`;
    const newSubmission: PaymentSubmission = {
      ...data,
      id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      orderId,
      status: 'Pending',
      createdAt: Date.now(),
    };

    setPayments((prev) => [newSubmission, ...prev]);
    showToast(`Konfirmasi pembayaran berhasil dikirim! ID Pesanan: ${orderId}`);
    return newSubmission;
  };

  const updatePaymentStatus = (paymentId: string, status: PaymentStatus, adminNotes?: string) => {
    setPayments((prev) =>
      prev.map((item) => {
        if (item.id === paymentId) {
          const nowStr = new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) + ' WIB';
          const updated: PaymentSubmission = {
            ...item,
            status,
            adminNotes: adminNotes !== undefined ? adminNotes : item.adminNotes,
            reviewedBy: currentUser ? currentUser.name : 'Taufiq Aminudin (Admin)',
            reviewedAt: nowStr,
          };

          // If approved & Paid, activate the appropriate paid package
          if (status === 'Paid' || status === 'Approved') {
            if (item.packageId === 'agency') {
              setActiveSubscriptionTier('agency');
            } else if (item.packageId === 'professional' && activeSubscriptionTier !== 'agency') {
              setActiveSubscriptionTier('professional');
            }
          }

          return updated;
        }
        return item;
      })
    );
    showToast(`Status pembayaran diperbarui: ${status}`);
  };

  const deletePayment = (paymentId: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== paymentId));
    showToast('Data pembayaran berhasil dihapus.');
  };

  return (
    <EventContext.Provider
      value={{
        activeTab,
        setActiveTab,
        showPublicPreview,
        setShowPublicPreview,
        showQrCheckinModal,
        setShowQrCheckinModal,
        selectedGuestForPass,
        setSelectedGuestForPass,
        toastMessage,
        showToast,

        // Auth & Roles
        currentUser,
        activeRole,
        isAuthenticated: !!currentUser,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode,
        showPublicLanding,
        setShowPublicLanding,
        lastRegisteredUser,
        login,
        loginWithGoogle,
        register,
        logout,
        switchRole,

        currentProject,
        projects,
        selectProject,
        createProject,
        updateProject,

        invitation,
        updateInvitation,
        selectTemplate,
        templates: TEMPLATES_DATA,

        guests,
        addGuest,
        updateGuest,
        deleteGuest,
        checkInGuest,
        checkInByCodeOrQr,
        submitRsvp,

        tasks,
        addTask,
        toggleTask,
        deleteTask,

        budgets,
        addBudgetItem,
        updateBudgetItem,
        deleteBudgetItem,
        weeklyExpenses,
        addWeeklyExpense,
        deleteWeeklyExpense,
        currency,
        setCurrency,
        formatCost,
        formatCostShort,

        locations,
        addLocation,
        memories,
        addMemory,

        emailTemplates,
        saveEmailTemplate,
        deleteEmailTemplate,
        campaigns,
        scheduleCampaign,
        updateCampaignStatus,
        deleteCampaign,

        autoRsvpConfig,
        toggleAutoRsvpScheduler,
        toggleAutoReminderRule,
        addOrUpdateAutoReminderRule,
        deleteAutoReminderRule,
        updateAutoReminderTemplate,
        triggerPendingRsvpRemindersNow,
        sendSingleRsvpReminder,

        aiConcept,
        generateAiConcept,

        payments,
        activeSubscriptionTier,
        submitPayment,
        updatePaymentStatus,
        deletePayment,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
