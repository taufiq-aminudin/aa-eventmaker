// components/QrCheckinScanner.tsx
import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface ScannedGuest {
  id: string;
  name: string;
  pax: number;
  time: string;
}

export const QrCheckinScanner: React.FC = () => {
  const [scanResult, setScanResult] = useState<ScannedGuest | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        try {
          const data = JSON.parse(decodedText);
          if (data.type === "EVENT_PASS") {
            setScanResult({
              id: data.id,
              name: data.name,
              pax: data.pax || 1,
              time: new Date().toLocaleTimeString(),
            });
            setErrorMsg(null);
            // Mainkan feedback suara beep atau vibrasi (jika di mobile)
            if (navigator.vibrate) navigator.vibrate(100);
          } else {
            setErrorMsg("QR Code tidak valid untuk acara ini.");
          }
        } catch {
          setErrorMsg("Format QR Code tidak dikenali.");
        }
      },
      (error) => {
        // Ignored frame error during continuous scanning
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto p-5 bg-neutral-900 rounded-3xl border border-neutral-800 text-white">
      <h3 className="text-lg font-bold mb-1 text-center">Buku Tamu & Scan QR</h3>
      <p className="text-xs text-neutral-400 mb-4 text-center">
        Arahkan kamera ke QR tiket tamu untuk mencatat kehadiran.
      </p>

      {/* Frame Scanner */}
      <div id="qr-reader" className="overflow-hidden rounded-2xl bg-black border border-neutral-700" />

      {/* Hasil Pemindaian Real-Time */}
      {scanResult && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              ✓ Berhasil Check-In
            </span>
            <span className="text-xs text-neutral-400">{scanResult.time}</span>
          </div>
          <p className="text-base font-bold text-white mt-1">{scanResult.name}</p>
          <p className="text-xs text-emerald-300">Jumlah Tamu: {scanResult.pax} Orang</p>
        </div>
      )}

      {errorMsg && (
        <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
          {errorMsg}
        </div>
      )}
    </div>
  );
};
