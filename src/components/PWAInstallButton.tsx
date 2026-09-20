import React, { useState } from 'react';
import { Download, Smartphone, Check, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'banner' | 'card' | 'inline';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as an installed PWA, hide or show installed badge
  if (isInstalled) {
    if (variant === 'banner') return null;
    return (
      <div className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg ${variant === 'inline' ? 'w-full py-2' : 'hidden sm:inline-flex'}`}>
        <Check className="w-3.5 h-3.5 text-emerald-600" />
        <span>App Installed</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else {
      // Fallback instruction for browsers without beforeinstallprompt
      setShowIOSGuide(true);
    }
  };

  if (variant === 'banner') {
    return (
      <>
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-orange-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
          <div className="flex items-center space-x-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-md shrink-0 flex items-center justify-center">
              <img src="/icon.svg" alt="AA-EventMaker" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight">Pasang AA-EventMaker di Ponsel</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white uppercase tracking-wider">PWA / Play Store Ready</span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5 max-w-xl">
                Akses cepat ke undangan digital, scanner QR tamu, dan budget planner tanpa perlu buka browser setiap saat. Hemat kuota & dukung mode offline.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 text-orange-600" />
            <span>Install Sekarang</span>
          </button>
        </div>

        {/* iOS / General Install Guide Modal */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 text-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Panduan Pemasangan Aplikasi</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-slate-600">
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <div>
                    <div className="font-bold text-slate-900">Perangkat iPhone / iPad (Safari)</div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Ketuk tombol <Share2 className="w-3.5 h-3.5 inline text-blue-600" /> <strong>Bagikan (Share)</strong> di bar bawah Safari, lalu pilih <PlusSquare className="w-3.5 h-3.5 inline text-blue-600" /> <strong>&ldquo;Tambahkan ke Layar Utama&rdquo; (Add to Home Screen)</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-orange-50/70 rounded-xl border border-orange-100 flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <div>
                    <div className="font-bold text-slate-900">Perangkat Android & Chrome / Play Store</div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Ketuk titik tiga di pojok kanan atas browser, lalu pilih <strong>&ldquo;Instal Aplikasi&rdquo;</strong> atau <strong>&ldquo;Tambahkan ke Layar Utama&rdquo;</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if (variant === 'inline') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            isInstallable
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
          } ${className}`}
          title="Pasang aplikasi ke layar ponsel/komputer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install Aplikasi (PWA)</span>
        </button>

        {/* iOS Modal */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-100 text-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Install AA-EventMaker</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                1. Buka menu browser (ikon <Share2 className="w-3.5 h-3.5 inline text-blue-600" /> Share di Safari atau titik tiga di Chrome).<br />
                2. Pilih <strong>Tambahkan ke Layar Utama (Add to Home Screen)</strong>.<br />
                3. Aplikasi akan langsung terpasang dan siap digunakan seperti aplikasi Play Store / App Store.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Default navbar button
  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          isInstallable
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs'
            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
        } ${className}`}
        title="Pasang aplikasi ke layar ponsel/komputer"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>

      {/* iOS Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-100 text-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Install AA-EventMaker</h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              1. Buka menu browser (ikon <Share2 className="w-3.5 h-3.5 inline text-blue-600" /> Share di Safari atau titik tiga di Chrome).<br />
              2. Pilih <strong>Tambahkan ke Layar Utama (Add to Home Screen)</strong>.<br />
              3. Aplikasi akan langsung terpasang dan siap digunakan seperti aplikasi Play Store / App Store.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-xl bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};
