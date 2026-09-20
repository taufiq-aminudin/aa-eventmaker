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
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { useRouter } from '../../context/RouterContext';
import { Navbar } from '../../components/Navbar';
import { SeoMetadata } from '../../components/SeoMetadata';
import { PaymentMethodType, PaymentStatus, PaymentSubmission } from '../../types';
import { PAYMENT_CONFIG } from '../../data/paymentConfig';

export const AdminPaymentManagementScreen: React.FC = () => {
  const {
    payments,
    updatePaymentStatus,
    deletePayment,
    activeRole,
    switchRole,
    currentUser,
    activeSubscriptionTier,
    showToast,
  } = useEvent();
  const { navigate } = useRouter();

  // Active filter tab: 'ALL' | PaymentStatus
  const [activeFilter, setActiveFilter] = useState<'ALL' | PaymentStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<PaymentSubmission | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [reviewStatusChoice, setReviewStatusChoice] = useState<PaymentStatus>('Pending');

  // Proof inspection modal state
  const [inspectProofSubmission, setInspectProofSubmission] = useState<PaymentSubmission | null>(null);

  // Check access permission: Only ORGANIZER role can access
  const isAuthorizedAdmin = activeRole === 'ORGANIZER';

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4">
        <SeoMetadata
          title="Akses Dibatasi – Admin Payment AA Event Maker"
          description="Area khusus administrator pengelola pembayaran AA Event Maker."
          canonicalPath="/admin/payments"
          type="website"
        />
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white">Akses Terbatas Administrator</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Halaman manajemen pembayaran &amp; verifikasi bukti transfer hanya dapat diakses oleh peran <span className="font-bold text-white">Organizer / Administrator</span>.
          </p>
          <div className="mt-6 space-y-2">
            <button
              onClick={() => switchRole('ORGANIZER')}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Beralih ke Peran EO / Admin
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              Kembali ke Halaman Utama
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  // Calculate statistics
  const totalSubmissions = payments.length;
  const pendingCount = payments.filter((p) => p.status === 'Pending').length;
  const underReviewCount = payments.filter((p) => p.status === 'Under Review').length;
  const approvedCount = payments.filter((p) => p.status === 'Approved' || p.status === 'Paid').length;
  const rejectedCount = payments.filter((p) => p.status === 'Rejected').length;
  const refundedCount = payments.filter((p) => p.status === 'Refunded').length;

  const totalVerifiedRevenue = payments
    .filter((p) => p.status === 'Paid' || p.status === 'Approved')
    .reduce((sum, curr) => sum + curr.amount, 0);

  const formattedRevenue = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(totalVerifiedRevenue);

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
      `Disetujui otomatis oleh ${currentUser?.name || 'Admin'} pada mutasi rekening masuk.`
    );
  };

  const handleQuickPending = (item: PaymentSubmission) => {
    updatePaymentStatus(
      item.id,
      'Pending',
      `Status dikembalikan ke antrean Pending oleh ${currentUser?.name || 'Admin'}.`
    );
  };

  const handleQuickReject = (item: PaymentSubmission) => {
    const reason = prompt(
      'Masukkan alasan penolakan (misal: Bukti transfer tidak valid atau dana belum masuk):',
      'Bukti transfer tidak terbaca / dana belum masuk ke mutasi rekening.'
    );
    if (reason !== null) {
      updatePaymentStatus(item.id, 'Rejected', reason);
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'Approved':
      case 'Paid':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Approved</span>
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Under Review</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Rejected</span>
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <span>Refunded</span>
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <SeoMetadata
        title="Admin Panel: Verifikasi Pembayaran – AA Event Maker"
        description="Dasbor verifikasi dan manajemen konfirmasi pembayaran pelanggan AA Event Maker."
        canonicalPath="/admin/payments"
        type="website"
      />

      <Navbar />

      <main className="flex-1 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Quick Links */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Panel Khusus Administrator EO</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Verifikasi &amp; Manajemen Pembayaran
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Kelola konfirmasi transfer Bank Mandiri &amp; DANA, periksa bukti pembayaran, dan aktifkan paket pelanggan.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/payment')}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>Lihat Form Publik /payment</span>
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Dasbor Event</span>
              </button>
            </div>
          </div>

          {/* Stat Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                Total Masuk
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalSubmissions}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Semua Transaksi</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs bg-gradient-to-br from-white to-blue-50/40">
              <span className="text-[11px] font-bold text-blue-600 block uppercase tracking-wider">
                Pending Review
              </span>
              <div className="text-2xl font-black text-blue-600 mt-1">{pendingCount}</div>
              <div className="text-[10px] text-blue-500 mt-0.5">Perlu Tindakan</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs bg-gradient-to-br from-white to-amber-50/40">
              <span className="text-[11px] font-bold text-amber-600 block uppercase tracking-wider">
                Under Review
              </span>
              <div className="text-2xl font-black text-amber-600 mt-1">{underReviewCount}</div>
              <div className="text-[10px] text-amber-500 mt-0.5">Cek Mutasi Saldo</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs bg-gradient-to-br from-white to-emerald-50/40">
              <span className="text-[11px] font-bold text-emerald-600 block uppercase tracking-wider">
                Approved
              </span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{approvedCount}</div>
              <div className="text-[10px] text-emerald-500 mt-0.5">Paket Aktif</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs bg-gradient-to-br from-white to-rose-50/40">
              <span className="text-[11px] font-bold text-rose-600 block uppercase tracking-wider">
                Ditolak
              </span>
              <div className="text-2xl font-black text-rose-600 mt-1">{rejectedCount}</div>
              <div className="text-[10px] text-rose-500 mt-0.5">Tidak Valid</div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-xs">
              <span className="text-[11px] font-bold text-blue-300 block uppercase tracking-wider">
                Total Omset
              </span>
              <div className="text-lg font-black text-white mt-1 truncate">{formattedRevenue}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Dari Status Approved</div>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Filter Tabs */}
              <div className="flex items-center space-x-1 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                {(
                  [
                    { id: 'ALL', label: 'Semua', count: totalSubmissions },
                    { id: 'Pending', label: 'Pending', count: pendingCount },
                    { id: 'Approved', label: 'Approved', count: approvedCount },
                    { id: 'Rejected', label: 'Rejected', count: rejectedCount },
                    { id: 'Under Review', label: 'Under Review', count: underReviewCount },
                    { id: 'Refunded', label: 'Refunded', count: refundedCount },
                  ] as const
                ).map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                          isActive ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari ID, nama, email, ref..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 outline-hidden bg-slate-50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Submissions List Table / Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            {filteredPayments.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                Tidak ada data pembayaran yang sesuai dengan kriteria filter atau pencarian saat ini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-6">Payment ID &amp; Tanggal</th>
                      <th className="py-3.5 px-6">Pelanggan</th>
                      <th className="py-3.5 px-6">Paket &amp; Nominal</th>
                      <th className="py-3.5 px-6">Metode &amp; No. Ref</th>
                      <th className="py-3.5 px-4 text-center">Bukti Bayar</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-6 text-right">Tindakan Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPayments.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* ID & Date */}
                        <td className="py-4 px-6">
                          <div className="font-mono font-black text-slate-900 text-xs">
                            {item.orderId}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {item.paymentDate}
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900 text-xs">
                            {item.customerName}
                          </div>
                          <div className="text-[11px] text-slate-500">{item.email}</div>
                          <div className="flex items-center space-x-1 mt-0.5">
                            <span className="text-[10px] text-slate-400">{item.phone}</span>
                            <a
                              href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Halo ${item.customerName}, kami dari AA Event Maker mengenai verifikasi pembayaran paket ${item.packageName}...`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700"
                              title="Chat WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </a>
                          </div>
                        </td>

                        {/* Package & Amount */}
                        <td className="py-4 px-6">
                          <div className="font-black text-blue-700">{item.amountFormatted}</div>
                          <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                            {item.packageName}
                          </span>
                        </td>

                        {/* Method & Ref */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-900 flex items-center space-x-1">
                            {item.paymentMethod === 'Bank Mandiri' ? (
                              <Building2 className="w-3.5 h-3.5 text-blue-600" />
                            ) : (
                              <Smartphone className="w-3.5 h-3.5 text-sky-500" />
                            )}
                            <span>{item.paymentMethod}</span>
                          </div>
                          <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                            Ref: {item.referenceNumber}
                          </div>
                          {item.notes && (
                            <div className="text-[10px] text-slate-400 italic truncate max-w-xs mt-0.5">
                              &quot;{item.notes}&quot;
                            </div>
                          )}
                        </td>

                        {/* Proof */}
                        <td className="py-4 px-4 text-center">
                          {item.proofDataUrl || item.proofFileName ? (
                            <button
                              type="button"
                              onClick={() => setInspectProofSubmission(item)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-700 text-[11px] font-bold transition-colors cursor-pointer border border-slate-200"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Lihat Bukti</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Tanpa Lampiran</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 text-center">
                          {getStatusBadge(item.status)}
                          {item.adminNotes && (
                            <div
                              className="text-[10px] text-slate-500 mt-1 max-w-[140px] truncate mx-auto"
                              title={item.adminNotes}
                            >
                              {item.adminNotes}
                            </div>
                          )}
                        </td>

                        {/* Review Action Controls */}
                        <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                          {item.status !== 'Approved' && item.status !== 'Paid' && (
                            <button
                              onClick={() => handleQuickApprove(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                              title="Setujui (Approved) dan Aktifkan Paket"
                            >
                              Approve
                            </button>
                          )}

                          {item.status !== 'Rejected' && (
                            <button
                              onClick={() => handleQuickReject(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 transition-colors cursor-pointer"
                              title="Tolak Pembayaran (Rejected)"
                            >
                              Reject
                            </button>
                          )}

                          {item.status !== 'Pending' && (
                            <button
                              onClick={() => handleQuickPending(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold border border-blue-200 transition-colors cursor-pointer"
                              title="Kembalikan ke antrean Pending"
                            >
                              Pending
                            </button>
                          )}

                          <button
                            onClick={() => openReviewModal(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                            title="Edit Status & Catatan"
                          >
                            Review...
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Hapus data pembayaran ID: ${item.orderId}?`)) {
                                deletePayment(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Hapus Submission"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL 1: PROOF INSPECTION MODAL (Secure admin viewing) */}
      {inspectProofSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Verifikasi Dokumen
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Bukti Pembayaran: {inspectProofSubmission.orderId}
                </h3>
              </div>
              <button
                onClick={() => setInspectProofSubmission(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div>
                  <span className="font-semibold text-slate-500">Pelanggan:</span>{' '}
                  <span className="font-bold text-slate-900">{inspectProofSubmission.customerName}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Paket:</span>{' '}
                  <span className="font-bold text-blue-700">{inspectProofSubmission.packageName} ({inspectProofSubmission.amountFormatted})</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Metode:</span>{' '}
                  <span className="font-bold text-slate-900">{inspectProofSubmission.paymentMethod}</span> (Ref: {inspectProofSubmission.referenceNumber})
                </div>
              </div>

              {/* Display Proof preview */}
              <div className="rounded-2xl border border-slate-200 bg-slate-100/70 overflow-hidden flex items-center justify-center min-h-[220px]">
                {inspectProofSubmission.proofDataUrl ? (
                  inspectProofSubmission.proofFileType === 'application/pdf' ? (
                    <div className="p-8 text-center space-y-3">
                      <FileText className="w-12 h-12 text-rose-500 mx-auto" />
                      <div className="text-xs font-bold text-slate-700">
                        {inspectProofSubmission.proofFileName || 'Dokumen PDF Bukti Transfer'}
                      </div>
                      <a
                        href={inspectProofSubmission.proofDataUrl}
                        download={inspectProofSubmission.proofFileName || 'bukti-transfer.pdf'}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Dokumen PDF</span>
                      </a>
                    </div>
                  ) : (
                    <img
                      src={inspectProofSubmission.proofDataUrl}
                      alt={`Bukti Transfer ${inspectProofSubmission.orderId}`}
                      className="max-h-[360px] w-auto object-contain mx-auto rounded-lg shadow-xs"
                    />
                  )
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                    <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                    <div>Nama Berkas: <span className="font-mono font-bold text-slate-800">{inspectProofSubmission.proofFileName}</span></div>
                    <div className="text-[11px] text-slate-400">
                      (Bukti transfer tercatat di sistem verifikator)
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>{getStatusBadge(inspectProofSubmission.status)}</div>
              <div className="space-x-2 flex items-center">
                {inspectProofSubmission.status !== 'Approved' && inspectProofSubmission.status !== 'Paid' && (
                  <button
                    onClick={() => {
                      handleQuickApprove(inspectProofSubmission);
                      setInspectProofSubmission(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Setujui (Approve)
                  </button>
                )}
                {inspectProofSubmission.status !== 'Rejected' && (
                  <button
                    onClick={() => {
                      handleQuickReject(inspectProofSubmission);
                      setInspectProofSubmission(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 cursor-pointer"
                  >
                    Tolak (Reject)
                  </button>
                )}
                <button
                  onClick={() => setInspectProofSubmission(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DETAILED REVIEW & STATUS UPDATE MODAL */}
      {selectedSubmissionForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Verifikasi &amp; Pembaruan Status
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Review: {selectedSubmissionForReview.orderId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmissionForReview(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div>
                  <span className="text-slate-500">Pelanggan:</span>{' '}
                  <span className="font-bold text-slate-900">{selectedSubmissionForReview.customerName}</span> ({selectedSubmissionForReview.email})
                </div>
                <div>
                  <span className="text-slate-500">Nominal Transfer:</span>{' '}
                  <span className="font-bold text-blue-700">{selectedSubmissionForReview.amountFormatted}</span>
                </div>
                <div>
                  <span className="text-slate-500">Metode &amp; Ref:</span>{' '}
                  <span className="font-semibold text-slate-800">{selectedSubmissionForReview.paymentMethod}</span> - {selectedSubmissionForReview.referenceNumber}
                </div>
              </div>

              {/* Status Choice Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Status Pembayaran
                </label>
                <select
                  value={reviewStatusChoice}
                  onChange={(e) => setReviewStatusChoice(e.target.value as PaymentStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-hidden bg-white"
                >
                  <option value="Pending">Pending (Menunggu Review)</option>
                  <option value="Approved">Approved (Setujui &amp; Aktifkan Paket)</option>
                  <option value="Rejected">Rejected (Tolak Pembayaran)</option>
                  <option value="Under Review">Under Review (Sedang Dicek)</option>
                  <option value="Paid">Paid (Lunas)</option>
                  <option value="Refunded">Refunded (Dana Dikembalikan)</option>
                </select>
                {(reviewStatusChoice === 'Approved' || reviewStatusChoice === 'Paid') && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    ✓ Memilih Approved / Paid akan mengaktifkan paket {selectedSubmissionForReview.packageName} secara otomatis.
                  </p>
                )}
              </div>

              {/* Admin Note textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Verifikator / Admin
                </label>
                <textarea
                  rows={3}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Contoh: Mutasi rekening Bank Mandiri terverifikasi jam 14:00 WIB..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 outline-hidden bg-slate-50"
                />
                <span className="text-[10px] text-slate-400">
                  Catatan ini dapat dibaca oleh pelanggan saat mengecek status pembayaran.
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setSelectedSubmissionForReview(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveReview}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md transition-all cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
