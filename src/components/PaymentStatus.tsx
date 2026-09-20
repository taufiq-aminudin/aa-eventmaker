import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Search,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Smartphone,
  ExternalLink,
  FileText,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { PaymentStatus as PaymentStatusType, PaymentSubmission } from '../types';
import { PAYMENT_CONFIG } from '../data/paymentConfig';
import { useRouter } from '../context/RouterContext';
import { useEvent } from '../context/EventContext';

interface PaymentStatusProps {
  /**
   * Directly pass a submission to display, or omit to provide a standalone lookup
   */
  submission?: PaymentSubmission | null;
  /**
   * Optional callback when user clicks to make a new confirmation or re-submit
   */
  onNewConfirmation?: () => void;
  className?: string;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
  submission: initialSubmission,
  onNewConfirmation,
  className = '',
}) => {
  const { payments } = useEvent();
  const { navigate } = useRouter();

  const [lookupQuery, setLookupQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<PaymentSubmission | null>(
    initialSubmission || null
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<PaymentSubmission[]>([]);

  // If initialSubmission updates from parent, sync it
  React.useEffect(() => {
    if (initialSubmission) {
      setSelectedSubmission(initialSubmission);
    }
  }, [initialSubmission]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = lookupQuery.trim().toLowerCase();
    setHasSearched(true);

    if (!query) {
      setSearchResults([]);
      setSelectedSubmission(null);
      return;
    }

    const matched = payments.filter((item) => {
      return (
        item.orderId.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.phone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, '')) ||
        item.referenceNumber.toLowerCase().includes(query)
      );
    });

    setSearchResults(matched);
    if (matched.length === 1) {
      setSelectedSubmission(matched[0]);
    } else {
      setSelectedSubmission(null);
    }
  };

  const getStatusBadge = (status: PaymentStatusType) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Terverifikasi (Paid)</span>
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Sedang Diverifikasi Admin</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Ditolak / Butuh Bukti Baru</span>
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <span>Dana Dikembalikan (Refunded)</span>
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Pending (Menunggu Antrean Review)</span>
          </span>
        );
    }
  };

  // Stepper representation for transparency during review
  const renderProgressStepper = (status: PaymentStatusType) => {
    const isStep1Done = true;
    const isStep2Active = status === 'Under Review' || status === 'Pending';
    const isStep2Done = status === 'Paid';
    const isStep3Done = status === 'Paid';
    const isRejected = status === 'Rejected';

    return (
      <div className="py-4 px-2">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0" />
          <div
            className={`absolute top-4 left-6 h-1 transition-all duration-500 -z-0 ${
              isStep3Done
                ? 'w-[calc(100%-3rem)] bg-emerald-500'
                : isStep2Active
                ? 'w-1/2 bg-blue-500'
                : isRejected
                ? 'w-1/2 bg-rose-400'
                : 'w-0 bg-slate-200'
            }`}
          />

          {/* Step 1 */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-2 text-center">
              Bukti Terkirim
            </span>
            <span className="text-[10px] text-slate-400">Tersimpan di antrean</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center relative z-10">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                isStep2Done
                  ? 'bg-emerald-600 text-white'
                  : isRejected
                  ? 'bg-rose-600 text-white'
                  : 'bg-blue-600 text-white ring-4 ring-blue-100'
              }`}
            >
              {isStep2Done ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : isRejected ? (
                <XCircle className="w-5 h-5" />
              ) : (
                <Clock className="w-4 h-4 animate-spin" />
              )}
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-2 text-center">
              Pemeriksaan Mutasi
            </span>
            <span className="text-[10px] text-slate-400">
              {isRejected ? 'Perlu perbaikan' : 'Validasi admin'}
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center relative z-10">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                isStep3Done
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {isStep3Done ? <Sparkles className="w-5 h-5" /> : '3'}
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-2 text-center">
              Paket Aktif
            </span>
            <span className="text-[10px] text-slate-400">Fitur premium terbuka</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold mb-1 border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Transparansi Status Verifikasi</span>
          </div>
          <h3 className="text-lg font-black text-slate-950">
            Cek &amp; Pantau Status Pembayaran
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Lacak status review pembayaran paket AA Event Maker secara real-time.
          </p>
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="Email / ID Pesanan..."
              className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 outline-hidden bg-slate-50 w-44 sm:w-56"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Cari
          </button>
        </form>
      </div>

      {/* If Multiple Search Results Found */}
      {searchResults.length > 1 && !selectedSubmission && (
        <div className="mb-6 space-y-2">
          <div className="text-xs font-bold text-slate-700">
            Ditemukan {searchResults.length} transaksi. Silakan pilih salah satu:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {searchResults.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedSubmission(item)}
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-mono font-bold text-xs text-slate-900">{item.orderId}</div>
                  <div className="text-[11px] text-slate-500">{item.packageName} • {item.amountFormatted}</div>
                </div>
                {getStatusBadge(item.status)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* If Search Yielded No Results */}
      {hasSearched && searchResults.length === 0 && (
        <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 mb-6">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <div className="text-xs font-bold text-slate-800">
            Tidak ditemukan konfirmasi dengan kata kunci &quot;{lookupQuery}&quot;
          </div>
          <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
            Pastikan email atau nomor pesanan (contoh: AA-PAY-2026-XXXX) sesuai dengan yang Anda daftarkan saat konfirmasi.
          </p>
        </div>
      )}

      {/* Selected Submission Detail Display */}
      {selectedSubmission ? (
        <div className="space-y-6">
          {/* Card Overview */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ID Pesanan Transaksi
                </span>
                <div className="text-lg sm:text-xl font-mono font-black text-slate-950">
                  {selectedSubmission.orderId}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(selectedSubmission.status)}
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="mb-4">
              {renderProgressStepper(selectedSubmission.status)}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/70 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Pelanggan</span>
                <span className="font-bold text-slate-900">{selectedSubmission.customerName}</span>
                <span className="block text-[10px] text-slate-500 truncate">{selectedSubmission.email}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Paket Dipilih</span>
                <span className="font-bold text-blue-700">{selectedSubmission.packageName}</span>
                <span className="block text-[10px] text-slate-500 font-bold">{selectedSubmission.amountFormatted}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Metode Pembayaran</span>
                <span className="font-bold text-slate-900 flex items-center space-x-1">
                  {selectedSubmission.paymentMethod === 'Bank Mandiri' ? (
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <Smartphone className="w-3.5 h-3.5 text-sky-500" />
                  )}
                  <span>{selectedSubmission.paymentMethod}</span>
                </span>
                <span className="block text-[10px] text-slate-500 font-mono">Ref: {selectedSubmission.referenceNumber}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Tanggal Transfer</span>
                <span className="font-bold text-slate-900">{selectedSubmission.paymentDate}</span>
                <span className="block text-[10px] text-slate-400">Status live synced</span>
              </div>
            </div>

            {/* Admin Notes Box */}
            {selectedSubmission.adminNotes && (
              <div className="mt-4 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 text-xs text-blue-900">
                <span className="font-black text-blue-950 block mb-0.5">Catatan Verifikator:</span>
                <p className="leading-relaxed">{selectedSubmission.adminNotes}</p>
                {selectedSubmission.reviewedAt && (
                  <div className="text-[10px] text-blue-700 mt-1">
                    Ditinjau oleh {selectedSubmission.reviewedBy || 'Admin'} • {selectedSubmission.reviewedAt}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Footer according to state */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500">
              {selectedSubmission.status === 'Paid' ? (
                <span className="text-emerald-700 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Paket Anda telah aktif! Anda dapat menggunakan fitur tanpa batas.</span>
                </span>
              ) : selectedSubmission.status === 'Under Review' || selectedSubmission.status === 'Pending' ? (
                <span className="text-slate-600 flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Verifikasi mutasi rekening umumnya memerlukan 5–15 menit.</span>
                </span>
              ) : (
                <span className="text-rose-600 font-medium">
                  Perlu bantuan lebih lanjut? Hubungi admin verifikasi kami.
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              {selectedSubmission.status === 'Paid' ? (
                <button
                  type="button"
                  onClick={() => navigate('/editor')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Buka Editor Acara</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <a
                  href={PAYMENT_CONFIG.supportWhatsApp.getHelpUrl(
                    `Halo tim AA Event Maker, saya ingin menanyakan status konfirmasi pembayaran ID: ${selectedSubmission.orderId} atas nama ${selectedSubmission.customerName} (${selectedSubmission.packageName}).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hubungi Admin via WhatsApp</span>
                </a>
              )}

              {onNewConfirmation && (
                <button
                  type="button"
                  onClick={onNewConfirmation}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Konfirmasi Lain
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Prompt */
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            Cari Riwayat Pembayaran Anda
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Ketikkan email atau nomor ID Pesanan pada kotak di atas untuk melihat status verifikasi pembayaran Anda secara langsung.
          </p>
        </div>
      )}
    </div>
  );
};
