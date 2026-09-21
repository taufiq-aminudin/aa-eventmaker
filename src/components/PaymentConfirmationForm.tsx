import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Check,
  AlertCircle,
  ShieldCheck,
  X,
  FileCheck,
  Smartphone,
  Building2,
  Calendar,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { PRICING_PACKAGES } from '../data/paymentConfig';
import { PaymentMethodType, PaymentSubmission } from '../types';

interface PaymentConfirmationFormProps {
  initialPackageId?: string;
  initialMethod?: PaymentMethodType;
  onSuccess?: (submission: PaymentSubmission) => void;
  className?: string;
}

export const PaymentConfirmationForm: React.FC<PaymentConfirmationFormProps> = ({
  initialPackageId = 'professional',
  initialMethod = 'Bank Mandiri',
  onSuccess,
  className = '',
}) => {
  const { submitPayment, showToast, currentUser, currency, formatCost } = useEvent();

  // Customer Details
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');

  // Transaction Info
  const [packageId, setPackageId] = useState<string>(initialPackageId);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(initialMethod);
  const [paymentDate, setPaymentDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Payment Proof File (Stored securely in state/local storage as Data URL, not public)
  const [proofFile, setProofFile] = useState<{
    dataUrl: string;
    fileName: string;
    fileType: string;
    sizeKb: number;
  } | null>(null);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Sync if initial props change
  useEffect(() => {
    if (initialPackageId && PRICING_PACKAGES[initialPackageId]) {
      setPackageId(initialPackageId);
    }
  }, [initialPackageId]);

  useEffect(() => {
    if (initialMethod) {
      setPaymentMethod(initialMethod);
    }
  }, [initialMethod]);

  const selectedPackage = PRICING_PACKAGES[packageId] || PRICING_PACKAGES.professional;

  const processFile = (file: File) => {
    setUploadError(null);

    // Validate size (max 5MB)
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError('Ukuran file maksimal 5MB. Silakan kompres atau pilih berkas yang lebih kecil.');
      return;
    }

    // Accepted formats: JPG, JPEG, PNG, WebP, PDF
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
    const isExtensionValid = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!validMimeTypes.includes(file.type) && !isExtensionValid) {
      setUploadError(
        'Format tidak didukung. Harap unggah berkas bertipe JPG, JPEG, PNG, WebP, atau PDF.'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setProofFile({
        dataUrl,
        fileName: file.name,
        fileType: file.type || 'image/jpeg',
        sizeKb: Math.round(file.size / 1024),
      });
      showToast(`Bukti transfer "${file.name}" berhasil dilampirkan.`);
    };
    reader.onerror = () => {
      setUploadError('Gagal membaca berkas. Silakan coba unggah kembali.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      showToast('Mohon isi nama lengkap Anda.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      showToast('Mohon isi alamat email yang valid.');
      return;
    }

    if (!phone.trim()) {
      showToast('Mohon isi nomor WhatsApp Anda.');
      return;
    }

    if (!referenceNumber.trim()) {
      showToast('Mohon masukkan nomor referensi / ID transaksi dari bukti transfer Anda.');
      return;
    }

    setIsSubmitting(true);

    try {
      const submission = submitPayment({
        customerName: customerName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        amount: selectedPackage.price,
        amountFormatted: formatCost(selectedPackage.price),
        currency,
        amountInIdr: selectedPackage.price,
        paymentMethod,
        paymentDate,
        referenceNumber: referenceNumber.trim(),
        proofDataUrl: proofFile?.dataUrl,
        proofFileName: proofFile?.fileName,
        proofFileType: proofFile?.fileType,
        notes: notes.trim() || undefined,
      });

      // Clear non-critical inputs
      setReferenceNumber('');
      setNotes('');
      setProofFile(null);

      if (onSuccess) {
        onSuccess(submission);
      }
    } catch {
      showToast('Terjadi kesalahan saat memproses data. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm ${className}`}>
      <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900">
            Formulir Konfirmasi Pembayaran
          </h3>
          <p className="text-xs text-slate-400">
            Lengkapi rincian transfer untuk verifikasi admin AA Event Maker
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Details Section */}
        <div className="space-y-3">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            1. Informasi Pelanggan
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Lengkap Pelanggan / Pasangan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Contoh: Dimas & Sinta"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden bg-slate-50/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alamat Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden bg-slate-50/60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081382000412"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden bg-slate-50/60"
              />
            </div>
          </div>
        </div>

        {/* Transaction Info Section */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            2. Rincian Transaksi
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Paket Layanan <span className="text-rose-500">*</span>
              </label>
              <select
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-hidden bg-slate-50/60"
              >
                <option value="starter">Starter Free ({formatCost(0)})</option>
                <option value="professional">Wedding Pro ({formatCost(299000)})</option>
                <option value="agency">EO &amp; Agency ({formatCost(899000)})</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Metode Pembayaran <span className="text-rose-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-hidden bg-slate-50/60"
              >
                <option value="Bank Mandiri">Bank Mandiri (1850007334896)</option>
                <option value="DANA">DANA (081382000412)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nominal Transfer (Sesuai Paket)
              </label>
              <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-blue-700 bg-blue-50/40">
                {formatCost(selectedPackage.price)}
                {currency !== 'IDR' && selectedPackage.price > 0 && (
                  <span className="text-[10px] text-slate-500 font-normal ml-1.5">
                    (≈ Rp {selectedPackage.price.toLocaleString('id-ID')})
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Transfer <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 outline-hidden bg-slate-50/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nomor Referensi / ID Transaksi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Contoh: MDR-99238472 / ID Transaksi DANA"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 outline-hidden bg-slate-50/60 font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Dapat ditemukan pada mutasi e-banking, SMS banking, atau bukti transaksi DANA Anda.
            </span>
          </div>
        </div>

        {/* Payment Proof File Upload Input */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            3. Unggah Bukti Pembayaran
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-5 text-center transition-colors cursor-pointer ${
              isDragOver
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-slate-200 hover:border-blue-400 bg-slate-50/50'
            }`}
          >
            <Upload className="mx-auto h-7 w-7 text-slate-400 mb-1.5" />
            <div className="text-xs text-slate-600 font-medium">
              <label
                htmlFor="confirmation-file-upload"
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Pilih Berkas Bukti Transfer
              </label>{' '}
              atau drag &amp; drop di sini
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Mendukung JPG, JPEG, PNG, WebP, atau PDF (Maksimal 5MB)
            </p>
            <input
              id="confirmation-file-upload"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
              onChange={handleFileInput}
              className="sr-only"
            />
          </div>

          {uploadError && (
            <div className="text-xs text-rose-600 flex items-center space-x-1.5 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Attached File Card */}
          {proofFile && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center space-x-2 truncate">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold truncate">{proofFile.fileName}</span>
                <span className="text-[10px] text-emerald-700">({proofFile.sizeKb} KB)</span>
              </div>
              <button
                type="button"
                onClick={() => setProofFile(null)}
                className="text-emerald-700 hover:text-rose-600 p-1"
                title="Hapus berkas"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="text-[10px] text-slate-400 flex items-center space-x-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Bukti disimpan aman secara terenkripsi dan hanya dapat diakses oleh admin verifikasi.</span>
          </div>
        </div>

        {/* Optional Notes */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Pengirim atas nama rekening Taufiq / keterangan waktu transfer..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 outline-hidden bg-slate-50/60"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Mengirim Konfirmasi...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Kirim Konfirmasi Pembayaran</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
