import React from 'react';
import {
  X,
  Sparkles,
  Lock,
  Crown,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { useRouter } from '../context/RouterContext';

export const UpgradeModal: React.FC = () => {
  const {
    showUpgradeModal,
    setShowUpgradeModal,
    upgradeModalInfo,
    activeSubscriptionTier,
    setActiveSubscriptionTier,
    showToast,
  } = useEvent();
  const { navigate } = useRouter();

  if (!showUpgradeModal) return null;

  const requiredTier = upgradeModalInfo?.requiredTier || 'professional';
  const isAgencyRequired = requiredTier === 'agency';
  const targetName = upgradeModalInfo?.templateName || upgradeModalInfo?.featureName || 'Fitur Premium';

  const currentTierLabel =
    activeSubscriptionTier === 'agency'
      ? 'EO & Agency'
      : activeSubscriptionTier === 'professional'
      ? 'Wedding Professional'
      : 'Starter Free';

  const requiredTierLabel = isAgencyRequired ? 'EO & Agency' : 'Wedding Professional';
  const requiredPriceLabel = isAgencyRequired ? 'Rp 899.000 / Tahun' : 'Rp 299.000 / Acara';

  const proFeatures = [
    'Akses ke seluruh 16+ template sinematik, adat Jawa, Sunda, Bali & modern',
    'Kapasitas tamu undangan tanpa batas (Unlimited Guests)',
    'Video teaser prewedding resolusi HD & custom musik latar MP3',
    'Auto WhatsApp RSVP reminder blast ke daftar tamu',
    'Scanner QR E-Pass super cepat 0.5 detik (PWA Offline)',
    'Dasbor rekonsiliasi angpao digital & amplop fisik',
  ];

  const agencyFeatures = [
    'Semua fitur Wedding Professional tanpa batasan',
    'Kelola multi-proyek acara tanpa batas untuk seluruh klien WO',
    'Portal kolaborasi multi-vendor (Foto, Catering, MUA, Dekor)',
    'Kalkulator budgeting multi-mata uang (IDR, USD, MYR, SGD)',
    'Ekspor laporan buku tamu & kehadiran ke format Excel / PDF',
    'Bebas watermark dengan identitas branding agensi Anda',
  ];

  const activeFeatures = isAgencyRequired ? agencyFeatures : proFeatures;

  const handleGoToPricing = () => {
    setShowUpgradeModal(false);
    navigate('/pricing');
  };

  const handleInstantUpgradeDemo = (tier: 'professional' | 'agency') => {
    setActiveSubscriptionTier(tier);
    showToast(`Selamat! Akun Anda berhasil di-upgrade ke paket ${tier === 'agency' ? 'EO & Agency' : 'Wedding Professional'}.`);
    setShowUpgradeModal(false);
  };

  return (
    <div
      id="upgrade-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="upgrade-modal-dialog"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Header with gradient banner */}
        <div
          className={`p-6 text-white relative overflow-hidden ${
            isAgencyRequired
              ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-slate-900'
              : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-800'
          }`}
        >
          {/* Subtle decoration elements */}
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <button
            type="button"
            onClick={() => setShowUpgradeModal(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-3 border border-white/20">
            {isAgencyRequired ? <Crown className="w-3.5 h-3.5 text-amber-300" /> : <Sparkles className="w-3.5 h-3.5 text-blue-200" />}
            <span>Koleksi Eksklusif {requiredTierLabel}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-300 shrink-0" />
            <span>Akses Template Membutuhkan Upgrade</span>
          </h3>

          <p className="text-xs sm:text-sm text-white/90 mt-2 leading-relaxed">
            Tema <strong className="text-white underline decoration-amber-300 underline-offset-2">{targetName}</strong> dirancang dengan aset visual beresolusi tinggi untuk pelanggan paket <strong className="text-white">{requiredTierLabel}</strong>.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-black/30 border border-white/10 text-white/80">
              Paket Anda Saat Ini: <strong className="text-amber-200">{currentTierLabel}</strong>
            </span>
            <span className="text-white/60">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/30 font-bold text-white border border-white/20">
              Dibutuhkan: {requiredTierLabel}
            </span>
          </div>
        </div>

        {/* Content & Feature Unlocks */}
        <div className="p-6 space-y-5">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Keuntungan Paket {requiredTierLabel}:</span>
              <span className="text-blue-600 font-black">{requiredPriceLabel}</span>
            </div>

            <div className="space-y-2.5">
              {activeFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee & Fast Activation */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center space-x-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-800">Aktivasi Instan & Bergaransi</div>
              <div className="text-[11px] text-slate-500">
                Pilihan pembayaran via Mandiri, BCA, QRIS, DANA, dan ShopeePay dengan verifikasi cepat.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handleGoToPricing}
              className={`w-full py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                isAgencyRequired
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
              }`}
            >
              <span>Lihat Detail Paket & Mulai Upgrade</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Instant Demo Upgrade Toggle for easy previewing & test evaluation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleInstantUpgradeDemo(isAgencyRequired ? 'agency' : 'professional')}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                title="Aktifkan simulasi langsung untuk testing"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Simulasikan Upgrade ({isAgencyRequired ? 'Agency' : 'Pro'})</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="py-2 px-4 rounded-xl text-slate-500 hover:text-slate-800 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
