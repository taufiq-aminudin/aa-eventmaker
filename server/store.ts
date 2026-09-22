import { hashPassword, UserRole, SubscriptionTier } from './security';

export interface ServerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  passwordSalt?: string;
  passwordHash?: string;
  createdAt: number;
}

export interface ServerPayment {
  id: string;
  referenceNumber: string;
  packageId: string;
  packageName: string;
  amount: number;
  paymentMethod: string;
  accountName: string;
  accountNumber?: string;
  senderName: string;
  senderBankOrWallet: string;
  transferDate: string;
  proofUrl: string;
  proofFileName: string;
  notes?: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Paid' | 'Rejected' | 'Refunded';
  submittedAt: number;
  userId: string;
  userEmail: string;
  adminNote?: string;
  verifiedAt?: number;
  verifiedBy?: string;
}

export interface ServerProject {
  id: string;
  ownerId: string;
  name: string;
  date: string;
  location: string;
  createdAt: number;
}

export interface ServerCheckInRecord {
  id: string;
  eventId: string;
  guestId: string;
  checkInCode: string;
  checkedInAt: number;
  actor: string;
}

// Authoritative Pricing Packages (Server truth - cannot be forged by client)
export const SERVER_PACKAGES: Record<string, { id: string; name: string; price: number; maxProjects: number; maxGuests: number; allowAiVideo: boolean; allowAiMusic: boolean }> = {
  starter: {
    id: 'starter',
    name: 'Starter Free',
    price: 0,
    maxProjects: 1,
    maxGuests: 100,
    allowAiVideo: false,
    allowAiMusic: false,
  },
  professional: {
    id: 'professional',
    name: 'Wedding Professional',
    price: 299000,
    maxProjects: 3,
    maxGuests: 1000000,
    allowAiVideo: true,
    allowAiMusic: true,
  },
  agency: {
    id: 'agency',
    name: 'EO & Agency',
    price: 899000,
    maxProjects: 1000000,
    maxGuests: 1000000,
    allowAiVideo: true,
    allowAiMusic: true,
  },
};

class DataStore {
  private users: Map<string, ServerUser> = new Map();
  private payments: Map<string, ServerPayment> = new Map();
  private projects: Map<string, ServerProject> = new Map();
  private checkIns: Map<string, ServerCheckInRecord> = new Map();

  constructor() {
    this.seedDefaultUsers();
  }

  private seedDefaultUsers() {
    // 1. Admin account with hashed credentials
    const adminPass = hashPassword('Admin@AaEvent2026!');
    const adminUser: ServerUser = {
      id: 'usr_admin_001',
      name: 'Administrator AA Event Maker',
      email: 'admin@aa-eventmaker.my.id',
      phone: '081382000412',
      role: 'ADMIN',
      subscriptionTier: 'agency',
      passwordSalt: adminPass.salt,
      passwordHash: adminPass.hash,
      createdAt: Date.now() - 30 * 24 * 3600 * 1000,
    };
    this.users.set(adminUser.email.toLowerCase(), adminUser);

    // 2. Demo Organizer account
    const orgPass = hashPassword('Organizer@2026!');
    const orgUser: ServerUser = {
      id: 'usr_org_001',
      name: 'Taufiq Aminudin',
      email: 'taufiq.aminudin@gmail.com',
      phone: '081382000412',
      role: 'ORGANIZER',
      subscriptionTier: 'professional',
      passwordSalt: orgPass.salt,
      passwordHash: orgPass.hash,
      createdAt: Date.now() - 15 * 24 * 3600 * 1000,
    };
    this.users.set(orgUser.email.toLowerCase(), orgUser);

    // 3. Demo Client account
    const clientPass = hashPassword('Pengantin@2026!');
    const clientUser: ServerUser = {
      id: 'usr_client_001',
      name: 'Dimas & Ayu',
      email: 'dimas.ayu.wedding@gmail.com',
      phone: '081234567890',
      role: 'CLIENT',
      subscriptionTier: 'starter',
      passwordSalt: clientPass.salt,
      passwordHash: clientPass.hash,
      createdAt: Date.now() - 5 * 24 * 3600 * 1000,
    };
    this.users.set(clientUser.email.toLowerCase(), clientUser);

    // Seed initial project for orgUser
    const initialProject: ServerProject = {
      id: 'evt_andi_ayu_wedding',
      ownerId: orgUser.id,
      name: 'The Wedding of Andi & Ayu',
      date: '2026-10-24',
      location: 'Grand Ballroom Hotel Kempinski Jakarta',
      createdAt: Date.now() - 10 * 24 * 3600 * 1000,
    };
    this.projects.set(initialProject.id, initialProject);
  }

  // --- Users ---
  public findUserByEmail(email: string): ServerUser | undefined {
    return this.users.get(email.toLowerCase().trim());
  }

  public findUserById(id: string): ServerUser | undefined {
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return undefined;
  }

  public createUser(user: ServerUser): ServerUser {
    this.users.set(user.email.toLowerCase().trim(), user);
    return user;
  }

  public updateUserSubscription(userId: string, tier: SubscriptionTier): boolean {
    const user = this.findUserById(userId);
    if (!user) return false;
    user.subscriptionTier = tier;
    return true;
  }

  public updateUserPassword(email: string, salt: string, hash: string): boolean {
    const user = this.findUserByEmail(email);
    if (!user) return false;
    user.passwordSalt = salt;
    user.passwordHash = hash;
    return true;
  }

  // --- Projects (IDOR Protection) ---
  public getProject(projectId: string): ServerProject | undefined {
    return this.projects.get(projectId);
  }

  public getUserProjects(ownerId: string): ServerProject[] {
    return Array.from(this.projects.values()).filter((p) => p.ownerId === ownerId);
  }

  public createProject(project: ServerProject): ServerProject {
    this.projects.set(project.id, project);
    return project;
  }

  public updateProject(projectId: string, ownerId: string, updates: Partial<ServerProject>): ServerProject | null {
    const project = this.projects.get(projectId);
    if (!project) return null;
    if (project.ownerId !== ownerId) return null; // IDOR check
    Object.assign(project, updates);
    return project;
  }

  public deleteProject(projectId: string, ownerId: string): boolean {
    const project = this.projects.get(projectId);
    if (!project) return false;
    if (project.ownerId !== ownerId) return false; // IDOR check
    this.projects.delete(projectId);
    return true;
  }

  // --- Payments ---
  public createPayment(payment: ServerPayment): ServerPayment {
    this.payments.set(payment.id, payment);
    return payment;
  }

  public getPayments(): ServerPayment[] {
    return Array.from(this.payments.values()).sort((a, b) => b.submittedAt - a.submittedAt);
  }

  public getPaymentById(id: string): ServerPayment | undefined {
    return this.payments.get(id);
  }

  public updatePaymentStatus(
    id: string,
    status: ServerPayment['status'],
    adminNote: string,
    verifiedBy: string
  ): ServerPayment | null {
    const payment = this.payments.get(id);
    if (!payment) return null;

    payment.status = status;
    payment.adminNote = adminNote;
    payment.verifiedBy = verifiedBy;
    payment.verifiedAt = Date.now();

    // If approved or paid, upgrade the user's subscription tier
    if (status === 'Approved' || status === 'Paid') {
      const targetUser = this.findUserById(payment.userId);
      if (targetUser) {
        targetUser.subscriptionTier = payment.packageId === 'agency' ? 'agency' : 'professional';
      }
    }

    return payment;
  }

  // --- QR Check-Ins ---
  public checkInGuest(eventId: string, guestId: string, checkInCode: string, actor: string): { success: boolean; message: string; record?: ServerCheckInRecord } {
    const key = `${eventId}:${guestId}`;
    if (this.checkIns.has(key)) {
      const existing = this.checkIns.get(key)!;
      return {
        success: false,
        message: `Tamu sudah pernah check-in sebelumnya pada ${new Date(existing.checkedInAt).toLocaleTimeString('id-ID')}.`,
        record: existing,
      };
    }

    const record: ServerCheckInRecord = {
      id: `chk_${Date.now()}`,
      eventId,
      guestId,
      checkInCode,
      checkedInAt: Date.now(),
      actor,
    };

    this.checkIns.set(key, record);
    return {
      success: true,
      message: 'Check-in tamu berhasil diverifikasi dan dicatat.',
      record,
    };
  }
}

export const serverStore = new DataStore();
