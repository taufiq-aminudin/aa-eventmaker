import { PackagePlan } from '../types';

export interface BankTransferAccount {
  type: 'bank';
  bankName: string;
  accountNumber: string;
  accountName: string;
  badge: string;
  instructions: string[];
}

export interface DanaAccount {
  type: 'ewallet';
  walletName: string;
  phoneNumber: string;
  accountName: string;
  badge: string;
  instructions: string[];
}

export const PAYMENT_CONFIG = {
  bankMandiri: {
    type: 'bank' as const,
    bankName: 'Bank Mandiri',
    accountNumber: '1850007334896',
    accountName: 'Taufiq Aminudin',
    badge: 'Transfer Bank Otomatis / Manual',
    instructions: [
      'Buka aplikasi Livin\' by Mandiri, ATM Mandiri, atau Internet Banking.',
      'Pilih menu Transfer > Transfer ke Rekening Mandiri.',
      'Masukkan nomor rekening 1850007334896.',
      'Pastikan nama penerima tertera: Taufiq Aminudin.',
      'Masukkan nominal sesuai paket yang dipilih.',
      'Simpan bukti transfer berupa struk / tangkapan layar (screenshot).'
    ]
  },
  dana: {
    type: 'ewallet' as const,
    walletName: 'DANA',
    phoneNumber: '081382000412',
    accountName: 'Taufiq Aminudin',
    badge: 'E-Wallet DANA Instan',
    instructions: [
      'Buka aplikasi DANA di smartphone Anda.',
      'Pilih menu Kirim (Send) > Kirim ke Nomor Telepon.',
      'Masukkan nomor 081382000412.',
      'Pastikan akun penerima bernama: Taufiq Aminudin.',
      'Masukkan nominal transfer sesuai paket yang dipilih.',
      'Simpan bukti pembayaran atau tangkapan layar transaksi berhasil.'
    ]
  },
  supportWhatsApp: {
    rawNumber: '6281382000412',
    displayNumber: '081382000412',
    getHelpUrl: (contextText = 'Halo tim AA Event Maker, saya butuh bantuan mengenai pembayaran paket:') => {
      const text = encodeURIComponent(`${contextText}`);
      return `https://wa.me/6281382000412?text=${text}`;
    }
  }
};

export const PRICING_PACKAGES: Record<string, PackagePlan> = {
  starter: {
    id: 'starter',
    name: 'Starter Free',
    badge: 'Syukuran & Keluarga',
    price: 0,
    priceFormatted: 'Rp 0',
    period: 'Gratis Selamanya',
    description: 'Cocok untuk acara keluarga kecil, syukuran khitanan, atau perayaan ulang tahun sederhana.',
    features: [
      '1 Acara / Proyek Aktif',
      'Hingga 100 Tamu Undangan',
      'Template Digital Standar',
      'Tiket QR E-Pass & Buku Tamu Standar',
      'Formulir RSVP Sederhana',
      'Petunjuk Lokasi Google Maps',
      'Masa Aktif Undangan 3 Bulan',
    ],
    cta: 'Mulai Gratis',
    isPopular: false,
  },
  professional: {
    id: 'professional',
    name: 'Wedding Professional',
    badge: 'Paling Favorit',
    price: 299000,
    priceFormatted: 'Rp 299.000',
    period: 'Sekali Bayar / Acara',
    description: 'Pilihan utama calon pengantin modern yang menginginkan kemewahan visual dan integrasi lengkap.',
    features: [
      'Unlimited Tamu Undangan',
      'Seluruh Template Sinematik & Adat Nusantara',
      'Custom Musik Latar & Audio Ambience',
      'Galeri Foto HD & Video Teaser Prewedding',
      'Auto Reminder RSVP Blast ke WhatsApp Tamu',
      'Scanner E-Pass Cepat 0.5 Detik (PWA Offline)',
      'Dasbor Khusus Pengantin & Rekap Angpao',
      'Masa Aktif Undangan 1 Tahun',
    ],
    cta: 'Pilih Professional',
    isPopular: true,
  },
  agency: {
    id: 'agency',
    name: 'EO & Agency',
    badge: 'Wedding Organizer',
    price: 899000,
    priceFormatted: 'Rp 899.000',
    period: 'Lisensi 1 Tahun / Organizer',
    description: 'Didesain untuk Wedding Organizer, Event Planner, dan Agensi yang menangani banyak klien sekaligus.',
    features: [
      'Kelola Banyak Proyek Acara Tanpa Batas',
      'Semua Fitur Wedding Professional',
      'Portal Kolaborasi Multi-Vendor (Foto, Catering)',
      'Ekspor Laporan Tamu & Kehadiran ke Excel/PDF',
      'Kalkulator Budgeting Multi-Mata Uang',
      'Bebas Watermark & Branding Fleksibel',
      'Dukungan Prioritas WhatsApp 24/7',
    ],
    cta: 'Pilih Agency',
    isPopular: false,
  },
};
