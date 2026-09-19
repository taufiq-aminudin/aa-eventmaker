import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import confetti from 'canvas-confetti';
import { X, Camera, CheckCircle2, AlertCircle, RefreshCw, UserCheck, Search } from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { Guest } from '../types';

export const QrCheckinModal: React.FC = () => {
  const { showQrCheckinModal, setShowQrCheckinModal, checkInByCodeOrQr, guests } = useEvent();

  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    guest?: Guest;
  } | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!showQrCheckinModal) {
      stopCamera();
      setScanResult(null);
      setManualCode('');
      setCameraError(null);
    }
  }, [showQrCheckinModal]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6d28d9', '#ec4899', '#f59e0b', '#10b981'],
      });
    } catch {
      // ignore
    }
  };

  const handleProcessCode = (code: string) => {
    if (!code.trim()) return;
    const result = checkInByCodeOrQr(code);
    setScanResult(result);
    if (result.success) {
      triggerCelebration();
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader-container');
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
        },
        (decodedText) => {
          handleProcessCode(decodedText);
          stopCamera();
        },
        () => {
          // scanning frames
        }
      );
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera start issue:', err);
      setCameraError(
        'Kamera tidak dapat diakses atau diblokir izin browser. Anda dapat menggunakan input manual kode E-Pass di bawah ini.'
      );
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && cameraActive) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (e) {
        // ignore
      }
      setCameraActive(false);
    }
  };

  if (!showQrCheckinModal) return null;

  return (
    <div
      id="qr-checkin-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6d28d9] to-[#ec4899] p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <h3 className="font-bold text-base">Check-In Resepsionis & QR Scanner</h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              setShowQrCheckinModal(false);
            }}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Result Alert if any */}
          {scanResult && (
            <div
              className={`p-4 rounded-xl border flex items-start space-x-3 animate-in fade-in zoom-in-95 ${
                scanResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {scanResult.success ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-bold text-sm">
                  {scanResult.success ? 'Berhasil Terverifikasi!' : 'Verifikasi Gagal'}
                </div>
                <div className="text-xs mt-0.5">{scanResult.message}</div>

                {scanResult.guest && (
                  <div className="mt-2.5 pt-2.5 border-t border-emerald-200/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-emerald-700 font-medium">Tamu:</span>{' '}
                      <span className="font-bold">{scanResult.guest.name}</span>
                    </div>
                    <div>
                      <span className="text-emerald-700 font-medium">Meja:</span>{' '}
                      <span className="font-bold">{scanResult.guest.tableNumber}</span>
                    </div>
                    <div>
                      <span className="text-emerald-700 font-medium">Kategori:</span>{' '}
                      <span className="font-bold">{scanResult.guest.group}</span>
                    </div>
                    <div>
                      <span className="text-emerald-700 font-medium">Kuota:</span>{' '}
                      <span className="font-bold">{scanResult.guest.pax} Orang</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Camera Scanner Container */}
          <div className="bg-slate-900 rounded-xl overflow-hidden relative min-h-[220px] flex flex-col items-center justify-center p-3 text-center">
            <div id="qr-reader-container" className="w-full max-w-[280px]" />

            {!cameraActive && (
              <div className="py-6 flex flex-col items-center justify-center">
                <Camera className="w-12 h-12 text-slate-500 mb-2" />
                <p className="text-slate-300 text-xs max-w-xs mb-3">
                  Pindai QR Code E-Pass tamu secara langsung menggunakan kamera perangkat.
                </p>
                <button
                  id="btn-start-camera"
                  onClick={startCamera}
                  className="px-4 py-2 bg-gradient-to-r from-[#6d28d9] to-[#ec4899] text-white text-xs font-bold rounded-lg shadow-sm hover:opacity-95 transition-opacity flex items-center space-x-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Aktifkan Kamera</span>
                </button>
              </div>
            )}

            {cameraActive && (
              <button
                onClick={stopCamera}
                className="mt-3 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg"
              >
                Hentikan Kamera
              </button>
            )}

            {cameraError && (
              <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-4 text-center">
                <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
                <p className="text-amber-200 text-xs max-w-xs mb-3">{cameraError}</p>
                <button
                  onClick={() => setCameraError(null)}
                  className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                >
                  Tutup Notifikasi
                </button>
              </div>
            )}
          </div>

          {/* Manual Entry Form */}
          <div className="border-t border-slate-100 pt-4">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Input Manual Kode E-Pass / Nama Tamu:</span>
              <span className="text-slate-400 font-normal">Contoh: AA-HK99</span>
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Ketik kode E-Pass atau nama tamu..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleProcessCode(manualCode);
                  }}
                  className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
                />
              </div>
              <button
                id="btn-verify-manual-code"
                onClick={() => handleProcessCode(manualCode)}
                className="px-4 py-2 bg-[#6d28d9] text-white text-xs font-bold rounded-lg hover:bg-[#5b21b6] transition-colors"
              >
                Verifikasi
              </button>
            </div>
          </div>

          {/* Quick Click for Demo Guests */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Simulasi Cepat Tamu (Klik untuk Check-In):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {guests.slice(0, 5).map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleProcessCode(g.checkInCode)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors flex items-center space-x-1 ${
                    g.isCheckedIn
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300'
                  }`}
                >
                  <span className="font-semibold">{g.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({g.checkInCode})</span>
                  {g.isCheckedIn && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              stopCamera();
              setShowQrCheckinModal(false);
            }}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
