import React, { useState } from 'react';
import {
  CreditCard,
  Building2,
  Smartphone,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  MessageCircle,
  Download,
  FileText,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  ArrowUpDown,
  Check,
  RefreshCw,
  Sparkles,
  DollarSign,
  UserCheck,
  X,
  LayoutDashboard,
  Users,
  Mail,
  Receipt,
  FolderTree,
  BarChart3,
  TrendingUp,
  Settings,
  Copy,
  ChevronRight,
  ArrowRight,
  ZoomIn,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { useRouter } from '../../context/RouterContext';
import { AdminLayout, AdminTab } from '../../components/admin/AdminLayout';
import { SeoMetadata } from '../../components/SeoMetadata';
import { PaymentMethodType, PaymentStatus, PaymentSubmission } from '../../types';
import { PAYMENT_CONFIG, PRICING_PACKAGES } from '../../data/paymentConfig';
import { EventCategoryAdmin } from '../../components/admin/EventCategoryAdmin';
import { AdminNotificationSuite } from '../../components/admin/AdminNotificationSuite';

interface AdminSuiteScreenProps {
  initialTab?: AdminTab;
}

export const AdminSuiteScreen: React.FC<AdminSuiteScreenProps> = ({ initialTab = 'dashboard' }) => {
  const {
    payments,
    updatePaymentStatus,
    deletePayment,
    projects,
    invitation,
    showToast,
    currency,
    formatCost,
  } = useEvent();
  const { navigate } = useRouter();

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  // Payments / Verification State
  const [activeFilter, setActiveFilter] = useState<'ALL' | PaymentStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<PaymentSubmission | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [reviewStatusChoice, setReviewStatusChoice] = useState<PaymentStatus>('Pending');

  // Proof Inspection Modal State
  const [inspectProofSubmission, setInspectProofSubmission] = useState<PaymentSubmission | null>(null);

  // Statistics calculation
  const totalSubmissions = payments.length;
  const pendingCount = payments.filter((p) => p.status === 'Pending').length;
  const underReviewCount = payments.filter((p) => p.status === 'Under Review').length;
  const approvedCount = payments.filter((p) => p.status === 'Approved' || p.status === 'Paid').length;
  const rejectedCount = payments.filter((p) => p.status === 'Rejected').length;
  const refundedCount = payments.filter((p) => p.status === 'Refunded').length;

  const totalVerifiedRevenue = payments
    .filter((p) => p.status === 'Paid' || p.status === 'Approved')
    .reduce((sum, curr) => sum + curr.amount, 0);

  const formattedRevenue = `Rp ${Math.round(totalVerifiedRevenue).toLocaleString('id-ID')}`;

  // Filter and search payments
  const filteredPayments = payments.filter((item) => {
    let matchesFilter = activeFilter === 'ALL' || item.status === activeFilter;
    if (activeFilter === 'Approved') {
      matchesFilter = item.status === 'Approved' || item.status === 'Paid';
    } else if (activeFilter === 'Paid') {
      matchesFilter = item.status === 'Approved' || item.status === 'Paid';
    }
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.orderId.toLowerCase().includes(q) ||
      item.customerName.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.phone.includes(q) ||
      item.referenceNumber.toLowerCase().includes(q) ||
      item.packageName.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const openReviewModal = (item: PaymentSubmission) => {
    setSelectedSubmissionForReview(item);
    setReviewStatusChoice(item.status);
    setAdminNoteInput(item.adminNotes || '');
  };

  const handleSaveReview = () => {
    if (!selectedSubmissionForReview) return;
    updatePaymentStatus(selectedSubmissionForReview.id, reviewStatusChoice, adminNoteInput.trim());
    setSelectedSubmissionForReview(null);
  };

  const handleQuickApprove = (item: PaymentSubmission) => {
    updatePaymentStatus(
      item.id,
      'Approved',
      item.adminNotes || 'Verifikasi otomatis disetujui oleh Administrator Platform.'
    );
  };

  const handleQuickReject = (item: PaymentSubmission) => {
    const reason = prompt('Masukkan alasan penolakan bukti pembayaran:', 'Bukti transfer tidak terbaca / nominal tidak sesuai.');
    if (reason !== null) {
      updatePaymentStatus(item.id, 'Rejected', reason);
    }
  };

  const handleExportCsv = () => {
    if (payments.length === 0) {
      showToast('Belum ada data transaksi untuk diekspor.');
      return;
    }
    const headers = [
      'Order ID',
      'Pelanggan',
      'Email',
      'No. WhatsApp',
      'Paket',
      'Nominal (IDR)',
      'Metode Transfer',
      'Nomor Referensi',
      'Tanggal Bayar',
      'Status',
      'Catatan Admin',
    ];
    const rows = payments.map((p) => [
      `"${p.orderId}"`,
      `"${p.customerName}"`,
      `"${p.email}"`,
      `"${p.phone}"`,
      `"${p.packageName}"`,
      p.amount,
      `"${p.paymentMethod}"`,
      `"${p.referenceNumber}"`,
      `"${p.paymentDate}"`,
      `"${p.status}"`,
      `"${p.adminNotes || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AA_Event_Maker_Transaksi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data transaksi berhasil diekspor ke format CSV.');
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'Approved':
      case 'Paid':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Disetujui</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Menunggu</span>
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30 whitespace-nowrap">
            <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" />
            <span>Direview</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 whitespace-nowrap">
            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Ditolak</span>
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 whitespace-nowrap">
            <AlertCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Refund</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
            <span>{status}</span>
          </span>
        );
    }
  };

  // Customers data synthesized from payments and projects
  const uniqueCustomerMap = new Map<string, {
    name: string;
    email: string;
    phone: string;
    packageName: string;
    totalSpend: number;
    transactionsCount: number;
    lastPaymentDate: string;
    status: string;
  }>();

  payments.forEach((p) => {
    const key = p.email.toLowerCase() || p.phone;
    const existing = uniqueCustomerMap.get(key);
    if (existing) {
      existing.totalSpend += (p.status === 'Paid' || p.status === 'Approved') ? p.amount : 0;
      existing.transactionsCount += 1;
      existing.packageName = p.packageName;
    } else {
      uniqueCustomerMap.set(key, {
        name: p.customerName,
        email: p.email,
        phone: p.phone,
        packageName: p.packageName,
        totalSpend: (p.status === 'Paid' || p.status === 'Approved') ? p.amount : 0,
        transactionsCount: 1,
        lastPaymentDate: p.paymentDate,
        status: p.status === 'Paid' || p.status === 'Approved' ? 'Aktif' : 'Menunggu',
      });
    }
  });

  const customerList = Array.from(uniqueCustomerMap.values());

  return (
    <AdminLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      <SeoMetadata
        title="Admin Console – AA Event Maker"
        description="Pusat pengelolaan transaksi, verifikasi pembayaran, katalog acara, dan manajemen pengguna AA Event Maker."
        canonicalPath="/admin"
        type="website"
      />

      {/* 1. DASHBOARD VIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
                <LayoutDashboard className="w-7 h-7 text-blue-500" />
                <span>Ringkasan Konsol Admin</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Pantau omzet platform, antrean verifikasi pembayaran, dan statistik pengguna secara real-time.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('payments')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Verifikasi Pembayaran ({pendingCount})</span>
              </button>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Omzet Terverifikasi</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-white">{formattedRevenue}</div>
              <div className="text-[11px] text-emerald-400 flex items-center space-x-1">
                <span>{approvedCount} transaksi disetujui &amp; aktif</span>
              </div>
            </div>

            {/* Pending Verifications */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Antrean Verifikasi</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-400">{pendingCount + underReviewCount}</div>
              <div className="text-[11px] text-slate-400">
                {pendingCount} menunggu konfirmasi, {underReviewCount} direview
              </div>
            </div>

            {/* Total Customers */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pelanggan</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-white">{customerList.length || 1}</div>
              <div className="text-[11px] text-slate-400">
                Pasangan calon pengantin &amp; organizer terdaftar
              </div>
            </div>

            {/* Total Projects / Events */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Proyek Acara Aktif</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-white">{projects.length}</div>
              <div className="text-[11px] text-slate-400">
                Undangan digital beroperasi
              </div>
            </div>
          </div>

          {/* Quick Actions & Pending Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Reviews Box */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-bold text-white">Antrean Konfirmasi Pembayaran Terbaru</h2>
                </div>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                >
                  <span>Lihat Semua</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {payments.filter((p) => p.status === 'Pending' || p.status === 'Under Review').length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="text-xs font-bold text-slate-200">Semua Konfirmasi Pembayaran Telah Diproses</div>
                  <p className="text-[11px] text-slate-400">
                    Tidak ada antrean tertunda saat ini. Anda dapat memeriksa riwayat transaksi lengkap di tab Transaksi.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {payments
                    .filter((p) => p.status === 'Pending' || p.status === 'Under Review')
                    .slice(0, 4)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-blue-400">{item.orderId}</span>
                            {getStatusBadge(item.status)}
                          </div>
                          <div className="text-xs font-bold text-white">{item.customerName}</div>
                          <div className="text-[11px] text-slate-400">
                            {item.packageName} • {item.amountFormatted} • {item.paymentMethod}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => setInspectProofSubmission(item)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat Struk</span>
                          </button>
                          <button
                            onClick={() => openReviewModal(item)}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1"
                          >
                            <span>Proses</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Quick Links / Official Accounts */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <span>Rekening Tujuan Resmi</span>
              </h2>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/90 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-400 flex items-center space-x-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Bank Mandiri</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">Aktif</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-white tracking-wider">
                    {PAYMENT_CONFIG.bankMandiri.accountNumber}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    a.n. {PAYMENT_CONFIG.bankMandiri.accountName}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/90 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-400 flex items-center space-x-1.5">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>E-Wallet DANA</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">Aktif</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-white tracking-wider">
                    {PAYMENT_CONFIG.dana.phoneNumber}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    a.n. {PAYMENT_CONFIG.dana.accountName}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/90 space-y-1 text-xs">
                  <div className="text-[11px] font-bold text-slate-300">WhatsApp Dukungan Admin</div>
                  <div className="font-mono text-xs text-white">
                    {PAYMENT_CONFIG.supportWhatsApp.displayNumber}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PAYMENT VERIFICATION & TRANSACTIONS VIEW */}
      {(activeTab === 'payments' || activeTab === 'transactions') && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
                <CreditCard className="w-7 h-7 text-blue-500" />
                <span>
                  {activeTab === 'payments' ? 'Verifikasi Bukti Pembayaran' : 'Riwayat Seluruh Transaksi'}
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Tinjau struk transfer, nomor referensi perbankan, dan aktifkan paket langganan pelanggan.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportCsv}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor CSV</span>
              </button>
            </div>
          </div>

          {/* Filter Pills & Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Filter Status Pills */}
            <div className="flex items-center overflow-x-auto py-1 space-x-1.5 scrollbar-none">
              {(['ALL', 'Pending', 'Under Review', 'Approved', 'Rejected', 'Refunded'] as const).map((status) => {
                const isActive = activeFilter === status;
                const count =
                  status === 'ALL'
                    ? payments.length
                    : status === 'Approved'
                    ? approvedCount
                    : payments.filter((p) => p.status === status).length;

                return (
                  <button
                    key={status}
                    onClick={() => setActiveFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>
                      {status === 'ALL'
                        ? 'Semua'
                        : status === 'Pending'
                        ? 'Menunggu'
                        : status === 'Under Review'
                        ? 'Direview'
                        : status === 'Approved'
                        ? 'Disetujui'
                        : status === 'Rejected'
                        ? 'Ditolak'
                        : 'Refund'}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari ID, Nama, Email, No. Ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4">Order ID &amp; Waktu</th>
                    <th className="py-3.5 px-4">Pelanggan</th>
                    <th className="py-3.5 px-4">Paket &amp; Jumlah</th>
                    <th className="py-3.5 px-4">Metode &amp; No. Ref</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                        <div className="font-bold text-slate-300">Tidak ada transaksi ditemukan</div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Coba ubah kata kunci pencarian atau filter status transaksi di atas.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-blue-400">{item.orderId}</div>
                          <div className="text-[11px] text-slate-400">{item.paymentDate}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{item.customerName}</div>
                          <div className="text-[11px] text-slate-400">{item.email}</div>
                          <div className="text-[10px] text-slate-500">{item.phone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-200">{item.packageName}</div>
                          <div className="font-mono text-emerald-400 font-bold">{item.amountFormatted}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-1.5 font-medium text-slate-300">
                            {item.paymentMethod === 'Bank Mandiri' ? (
                              <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            ) : (
                              <Smartphone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            )}
                            <span>{item.paymentMethod}</span>
                          </div>
                          <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                            Ref: {item.referenceNumber}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(item.status)}
                          {item.adminNotes && (
                            <div className="text-[10px] text-slate-400 italic mt-1 max-w-[160px] truncate" title={item.adminNotes}>
                              &quot;{item.adminNotes}&quot;
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* Inspect Proof Button */}
                            <button
                              onClick={() => setInspectProofSubmission(item)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="Lihat Bukti Transfer"
                            >
                              <Eye className="w-4 h-4 text-blue-400" />
                            </button>

                            {/* WhatsApp Customer Shortcut */}
                            <a
                              href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Halo ${item.customerName}, ini tim AA Event Maker terkait konfirmasi pembayaran paket ${item.packageName} (${item.orderId}).`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
                              title="Hubungi Pelanggan via WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>

                            {/* Quick Review / Modal */}
                            <button
                              onClick={() => openReviewModal(item)}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all text-xs"
                            >
                              Kelola
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. CUSTOMER MANAGEMENT VIEW */}
      {activeTab === 'customers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
                <Users className="w-7 h-7 text-blue-500" />
                <span>Manajemen Pelanggan</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Daftar pasangan pengantin, event organizer, dan vendor yang menggunakan AA Event Maker.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4">Nama Pelanggan</th>
                    <th className="py-3.5 px-4">Kontak (Email &amp; WA)</th>
                    <th className="py-3.5 px-4">Paket Terdaftar</th>
                    <th className="py-3.5 px-4">Total Belanja</th>
                    <th className="py-3.5 px-4">Jumlah Transaksi</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {customerList.map((customer, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{customer.name}</div>
                        <div className="text-[10px] text-slate-500">Terdaftar via sistem</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-300">{customer.email}</div>
                        <div className="font-mono text-[11px] text-slate-400">{customer.phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                          {customer.packageName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        Rp {Math.round(customer.totalSpend).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-semibold">
                        {customer.transactionsCount} transaksi
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{customer.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Hubungi</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. INVITATIONS & EVENTS VIEW */}
      {activeTab === 'invitations' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
                <Mail className="w-7 h-7 text-blue-500" />
                <span>Undangan &amp; Acara Terdaftar</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Seluruh proyek acara dan tautan undangan digital yang aktif di sistem AA Event Maker.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      ID: {proj.id}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{proj.name}</h3>
                    <p className="text-xs text-slate-400">{proj.type} • {proj.location}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Aktif
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Tanggal Acara</span>
                    <span className="font-semibold text-slate-300">{proj.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Kota / Venue</span>
                    <span className="font-semibold text-slate-300 truncate block">{proj.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href={`/invitation/${invitation?.slug || 'dimas-sinta'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
                  >
                    <span>Lihat Halaman Publik</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://aa-eventmaker.my.id/invitation/${invitation?.slug || 'dimas-sinta'}`);
                      showToast('Tautan undangan berhasil disalin!');
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    title="Salin Tautan"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PACKAGES & PRICING CONFIG VIEW */}
      {activeTab === 'packages' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
                <Sparkles className="w-7 h-7 text-blue-500" />
                <span>Paket Layanan &amp; Biaya</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Konfigurasi batas kuota tamu, fitur aktif, dan nominal paket langganan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(PRICING_PACKAGES).map(([key, pkg]) => (
              <div
                key={key}
                className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{key}</span>
                    {key === 'professional' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        PALING POPULER
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-white">{pkg.name}</h3>
                  <div className="font-mono text-2xl font-black text-emerald-400">
                    {pkg.price === 0 ? 'Gratis' : `Rp ${pkg.price.toLocaleString('id-ID')}`}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{pkg.description}</p>

                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="text-[11px] font-bold text-slate-300">Fitur Termasuk:</div>
                    <ul className="text-xs text-slate-400 space-y-1.5">
                      {pkg.features.slice(0, 4).map((feat, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="text-[11px] text-slate-500 text-center font-semibold">
                    Status: Aktif di Web Publik
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TEMPLATES & EVENT CATEGORY CATALOG (Direct EventCategoryAdmin integration) */}
      {activeTab === 'templates' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-800 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
              <FolderTree className="w-7 h-7 text-blue-500" />
              <span>Katalog Kategori Acara &amp; Template</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Kelola kategori acara, jenis perayaan, gaya adat budaya Indonesia, dan kaitan template desain.
            </p>
          </div>

          {/* Integrated EventCategoryAdmin Component */}
          <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800">
            <EventCategoryAdmin />
          </div>
        </div>
      )}

      {/* 7. REVENUE & FINANCIAL REPORTS VIEW */}
      {activeTab === 'revenue' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
                <BarChart3 className="w-7 h-7 text-blue-500" />
                <span>Laporan Omzet &amp; Keuangan</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Rincian omzet masuk berdasarkan metode pembayaran transfer Bank Mandiri vs DANA.
              </p>
            </div>

            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Laporan Keuangan (CSV)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bank Mandiri Box */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Bank Mandiri</h3>
                    <div className="text-xs text-slate-400 font-mono">1850007334896</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400">
                  Transfer Bank
                </span>
              </div>

              <div className="text-2xl font-black text-white">
                Rp {Math.round(
                  payments
                    .filter((p) => p.paymentMethod === 'Bank Mandiri' && (p.status === 'Paid' || p.status === 'Approved'))
                    .reduce((sum, curr) => sum + curr.amount, 0)
                ).toLocaleString('id-ID')}
              </div>

              <div className="text-xs text-slate-400">
                Total {payments.filter((p) => p.paymentMethod === 'Bank Mandiri' && (p.status === 'Paid' || p.status === 'Approved')).length} transaksi berhasil terverifikasi.
              </div>
            </div>

            {/* DANA E-Wallet Box */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">DANA E-Wallet</h3>
                    <div className="text-xs text-slate-400 font-mono">081382000412</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400">
                  Dompet Digital
                </span>
              </div>

              <div className="text-2xl font-black text-white">
                Rp {Math.round(
                  payments
                    .filter((p) => p.paymentMethod === 'DANA' && (p.status === 'Paid' || p.status === 'Approved'))
                    .reduce((sum, curr) => sum + curr.amount, 0)
                ).toLocaleString('id-ID')}
              </div>

              <div className="text-xs text-slate-400">
                Total {payments.filter((p) => p.paymentMethod === 'DANA' && (p.status === 'Paid' || p.status === 'Approved')).length} transaksi berhasil terverifikasi.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. SETTINGS VIEW */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-800 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
              <Settings className="w-7 h-7 text-blue-500" />
              <span>Pengaturan Administrator</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Konfigurasi nomor kontak dukungan resmi dan parameter keamanan platform.
            </p>
          </div>

          <div className="max-w-2xl bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Domain Resmi Platform</label>
              <input
                type="text"
                readOnly
                value="https://aa-eventmaker.my.id"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Email Administrator</label>
              <input
                type="text"
                readOnly
                value="admin@aa-eventmaker.my.id"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">WhatsApp Dukungan Pembayaran</label>
              <input
                type="text"
                readOnly
                value={PAYMENT_CONFIG.supportWhatsApp.displayNumber}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
              />
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
              <span>Keamanan: Route-level Authorization &amp; Server-side Guard Active</span>
              <span className="text-emerald-400 font-bold">100% Secure</span>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS & EMAIL SYSTEM TAB */}
      {activeTab === 'notifications' && <AdminNotificationSuite />}

      {/* PROOF INSPECTION MODAL */}
      {inspectProofSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-sm">
                  Bukti Transfer – {inspectProofSubmission.orderId}
                </h3>
              </div>
              <button
                onClick={() => setInspectProofSubmission(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Proof Image Box */}
            <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-[420px]">
              {inspectProofSubmission.proofDataUrl ? (
                <img
                  src={inspectProofSubmission.proofDataUrl}
                  alt={`Bukti Transfer ${inspectProofSubmission.orderId}`}
                  className="max-h-[400px] w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="p-12 text-center text-slate-500 text-xs">
                  Tidak ada berkas bukti gambar terunggah.
                </div>
              )}
            </div>

            {/* Transaction Data Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 block">Pelanggan</span>
                <span className="font-bold text-white">{inspectProofSubmission.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Nominal</span>
                <span className="font-mono font-bold text-emerald-400">{inspectProofSubmission.amountFormatted}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Metode</span>
                <span className="font-bold text-slate-200">{inspectProofSubmission.paymentMethod}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">No. Referensi</span>
                <span className="font-mono text-slate-300">{inspectProofSubmission.referenceNumber}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              {inspectProofSubmission.proofDataUrl ? (
                <a
                  href={inspectProofSubmission.proofDataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`Bukti_${inspectProofSubmission.orderId}.jpg`}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Buka Ukuran Penuh</span>
                </a>
              ) : (
                <span className="text-xs text-slate-500 italic">Berkas bukti tidak tersedia</span>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const item = inspectProofSubmission;
                    setInspectProofSubmission(null);
                    openReviewModal(item);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Ubah Status &amp; Catatan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW & STATUS UPDATE MODAL */}
      {selectedSubmissionForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">Kelola Status Transaksi</h3>
                <span className="font-mono text-xs text-blue-400">{selectedSubmissionForReview.orderId}</span>
              </div>
              <button
                onClick={() => setSelectedSubmissionForReview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1.5">Pilih Status Baru:</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Approved', 'Pending', 'Under Review', 'Rejected', 'Refunded'] as PaymentStatus[]).map((status) => {
                    const isSelected = reviewStatusChoice === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setReviewStatusChoice(status)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <span>
                          {status === 'Approved'
                            ? 'Disetujui (Approved)'
                            : status === 'Pending'
                            ? 'Menunggu'
                            : status === 'Under Review'
                            ? 'Sedang Direview'
                            : status === 'Rejected'
                            ? 'Ditolak'
                            : 'Refund'}
                        </span>
                        {isSelected && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1.5">Catatan Verifikator (Admin Notes):</label>
                <textarea
                  rows={3}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Tambahkan catatan verifikasi atau alasan status (akan tampil pada halaman pelacakan pelanggan)..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedSubmissionForReview(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveReview}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
