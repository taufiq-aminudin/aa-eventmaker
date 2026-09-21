import React, { useState, useEffect, useId } from 'react';
import {
  CreditCard,
  Building2,
  Smartphone,
  Copy,
  Check,
  ShieldCheck,
  MessageCircle,
  ArrowLeft,
  X,
  Sparkles,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { useRouter } from '../../context/RouterContext';
import { CurrencyCode } from '../../types';
import { SUPPORTED_CURRENCIES } from '../../utils/currency';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { SeoMetadata } from '../../components/SeoMetadata';
import { PaymentStatus } from '../../components/PaymentStatus';
import { PaymentConfirmationForm } from '../../components/PaymentConfirmationForm';
import { PAYMENT_CONFIG, PRICING_PACKAGES } from '../../data/paymentConfig';
import { PaymentMethodType, PaymentSubmission } from '../../types';

export const PaymentPage: React.FC = () => {
  const { queryParams, navigate } = useRouter();
  const { showToast, currency, setCurrency, formatCost } = useEvent();

  const primaryCurrencies: CurrencyCode[] = ['IDR', 'USD', 'MYR', 'SGD'];

  // Selected package from query parameter (?package=...) or default to 'professional'
  const initialPackageKey =
    queryParams.package && PRICING_PACKAGES[queryParams.package]
      ? queryParams.package
      : 'professional';

  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPackageKey);
  const selectedPackage = PRICING_PACKAGES[selectedPackageId] || PRICING_PACKAGES.professional;

  // Selected payment method choice
  const [activePaymentMethod, setActivePaymentMethod] = useState<PaymentMethodType>('Bank Mandiri');

  // Copy feedback states
  const [copiedMandiri, setCopiedMandiri] = useState(false);
  const [copiedDana, setCopiedDana] = useState(false);

  // Active submission for real-time status tracking
  const [latestSubmission, setLatestSubmission] = useState<PaymentSubmission | null>(null);

  // Sync package if URL changes
  useEffect(() => {
    if (queryParams.package && PRICING_PACKAGES[queryParams.package]) {
      setSelectedPackageId(queryParams.package);
    }
  }, [queryParams.package]);

  const handleCopy = (text: string, type: 'mandiri' | 'dana') => {
    navigator.clipboard.writeText(text);
    if (type === 'mandiri') {
      setCopiedMandiri(true);
      setTimeout(() => setCopiedMandiri(false), 2500);
      showToast('Nomor Rekening Mandiri 1850007334896 berhasil disalin!');
    } else {
      setCopiedDana(true);
      setTimeout(() => setCopiedDana(false), 2500);
      showToast('Nomor DANA 081382000412 berhasil disalin!');
    }
  };

  const scrollToConfirmation = () => {
    const el = document.getElementById('payment-confirmation-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConfirmationSuccess = (submission: PaymentSubmission) => {
    setLatestSubmission(submission);
    const statusEl = document.getElementById('payment-status-section');
    if (statusEl) {
      statusEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const mandiriCardId = useId();
  const danaCardId = useId();

  return (
    <div id="payment-page" className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <SeoMetadata
        title="Pembayaran & Konfirmasi Paket – AA Event Maker"
        description="Informasi rekening pembayaran resmi Bank Mandiri dan DANA untuk paket AA Event Maker serta formulir konfirmasi pembayaran cepat dan aman."
        canonicalPath="/payment"
        imageUrl="https://aa-eventmaker.my.id/pwa-512x512.png"
        type="website"
      />

      <PublicHeader />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Navigation & Support Button */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Paket Harga</span>
            </button>

            {/* Need Help WhatsApp Support Button */}
            <a
              href={PAYMENT_CONFIG.supportWhatsApp.getHelpUrl(
                `Halo tim AA Event Maker, saya butuh bantuan mengenai pembayaran paket ${selectedPackage.name}:`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Need help with payment?</span>
            </a>
          </div>

          {/* Header Banner */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pembayaran Resmi &amp; Terpercaya</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Metode Pembayaran &amp; Konfirmasi
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Selesaikan transaksi menggunakan nomor rekening atau nomor DANA resmi di bawah ini, kemudian kirimkan konfirmasi untuk verifikasi dan aktivasi paket Anda.
            </p>

            {/* Currency Selector */}
            <div className="mt-5 inline-flex items-center p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 text-slate-400 text-xs font-bold border-r border-slate-200 mr-1">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-slate-600 hidden sm:inline">Mata Uang:</span>
              </div>
              <div className="flex items-center space-x-1">
                {primaryCurrencies.map((cCode) => {
                  const cfg = SUPPORTED_CURRENCIES.find((item) => item.code === cCode);
                  const isSelected = currency === cCode;
                  return (
                    <button
                      key={cCode}
                      onClick={() => setCurrency(cCode)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cfg?.flag}</span>
                      <span>{cCode}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            {/* Left Column: Package Selected & Payment Method Cards */}
            <div className="lg:col-span-7 space-y-6">
              {/* Selected Package Summary Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Paket yang Dipilih
                    </span>
                    <h2 className="text-xl font-black text-slate-900 mt-0.5">
                      {selectedPackage.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-blue-600">
                      {formatCost(selectedPackage.price)}
                    </div>
                    {currency !== 'IDR' && selectedPackage.price > 0 && (
                      <div className="text-[11px] font-semibold text-slate-500">
                        ≈ Rp {selectedPackage.price.toLocaleString('id-ID')}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-400 font-medium">
                      {selectedPackage.period}
                    </div>
                  </div>
                </div>

                {/* Package selector chips */}
                <div className="flex items-center space-x-2 pt-1 flex-wrap gap-y-2">
                  <span className="text-xs text-slate-500 font-semibold mr-1">Pilihan Paket:</span>
                  {(['starter', 'professional', 'agency'] as const).map((key) => {
                    const pkg = PRICING_PACKAGES[key];
                    const isSelected = selectedPackageId === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedPackageId(key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {pkg.name} ({formatCost(pkg.price)})
                      </button>
                    );
                  })}
                </div>

                {/* Feature highlight */}
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {selectedPackage.features.slice(0, 4).map((f) => (
                    <div key={f} className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PAYMENT METHODS SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                    Pilihan Metode Pembayaran
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Pilih salah satu &amp; salin data transfer
                  </span>
                </div>

                {/* CARD 1: BANK MANDIRI */}
                <div
                  id={`card-${mandiriCardId}`}
                  className={`rounded-3xl p-6 sm:p-7 transition-all duration-200 border ${
                    activePaymentMethod === 'Bank Mandiri'
                      ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setActivePaymentMethod('Bank Mandiri')}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                          BANK TRANSFER
                        </span>
                        <h4 className="text-lg font-black text-slate-950 mt-1">
                          {PAYMENT_CONFIG.bankMandiri.bankName}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">Nominal Bayar</span>
                      <span className="text-sm font-black text-blue-600">
                        {selectedPackage.priceFormatted}
                      </span>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold">Nomor Rekening Mandiri:</div>
                      <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-wider">
                        {PAYMENT_CONFIG.bankMandiri.accountNumber}
                      </div>
                      <div className="text-xs text-slate-600 font-bold mt-0.5">
                        a.n. {PAYMENT_CONFIG.bankMandiri.accountName}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(PAYMENT_CONFIG.bankMandiri.accountNumber, 'mandiri');
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 shadow-xs ${
                        copiedMandiri
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {copiedMandiri ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Account Number</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Step Instructions */}
                  <div className="mt-4 text-xs text-slate-500 space-y-1.5 pl-2 border-l-2 border-blue-200">
                    <p className="font-semibold text-slate-700">Panduan Transfer Bank Mandiri:</p>
                    <ol className="list-decimal list-inside space-y-1 text-[11px]">
                      {PAYMENT_CONFIG.bankMandiri.instructions.slice(0, 3).map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* CARD 2: DANA */}
                <div
                  id={`card-${danaCardId}`}
                  className={`rounded-3xl p-6 sm:p-7 transition-all duration-200 border ${
                    activePaymentMethod === 'DANA'
                      ? 'bg-white border-sky-500 shadow-md ring-2 ring-sky-500/10'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setActivePaymentMethod('DANA')}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#118eea] text-white flex items-center justify-center font-black text-sm shadow-xs">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100">
                          E-WALLET DOMPET DIGITAL
                        </span>
                        <h4 className="text-lg font-black text-slate-950 mt-1">
                          {PAYMENT_CONFIG.dana.walletName}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">Nominal Bayar</span>
                      <span className="text-sm font-black text-blue-600">
                        {selectedPackage.priceFormatted}
                      </span>
                    </div>
                  </div>

                  {/* DANA Details */}
                  <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold">Nomor Akun DANA:</div>
                      <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-wider">
                        {PAYMENT_CONFIG.dana.phoneNumber}
                      </div>
                      <div className="text-xs text-slate-600 font-bold mt-0.5">
                        a.n. {PAYMENT_CONFIG.dana.accountName}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(PAYMENT_CONFIG.dana.phoneNumber, 'dana');
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 shadow-xs ${
                        copiedDana
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#118eea] hover:bg-[#0c7bc9] text-white'
                      }`}
                    >
                      {copiedDana ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy DANA Number</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Step Instructions */}
                  <div className="mt-4 text-xs text-slate-500 space-y-1.5 pl-2 border-l-2 border-sky-300">
                    <p className="font-semibold text-slate-700">Panduan Pembayaran DANA:</p>
                    <ol className="list-decimal list-inside space-y-1 text-[11px]">
                      {PAYMENT_CONFIG.dana.instructions.slice(0, 3).map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Instruction & CTA to Confirmation Form */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                      Langkah Selanjutnya
                    </span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      &quot;After completing your payment, submit your payment confirmation.&quot;
                    </p>
                    <p className="text-xs text-blue-200 mt-1">
                      Kirimkan bukti dan nomor transaksi agar admin dapat segera mengaktifkan paket Anda.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={scrollToConfirmation}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all transform active:scale-98 cursor-pointer shrink-0"
                  >
                    Confirm Payment
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: PaymentConfirmationForm Component */}
            <div id="payment-confirmation-section" className="lg:col-span-5">
              <PaymentConfirmationForm
                initialPackageId={selectedPackageId}
                initialMethod={activePaymentMethod}
                onSuccess={handleConfirmationSuccess}
              />
            </div>
          </div>

          {/* User-facing PaymentStatus Component Section */}
          <div id="payment-status-section" className="mt-12 pt-6">
            <PaymentStatus
              submission={latestSubmission}
              onNewConfirmation={() => {
                setLatestSubmission(null);
                scrollToConfirmation();
              }}
            />
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
