// components/GuestQrTicket.tsx
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface GuestTicketProps {
  guestId: string;
  guestName: string;
  tableNumber?: string;
  pax: number;
}

export const GuestQrTicket: React.FC<GuestTicketProps> = ({
  guestId,
  guestName,
  tableNumber = "VIP 02",
  pax = 2,
}) => {
  // Payload JSON terenkripsi/terstruktur untuk discan di lokasi
  const qrPayload = JSON.stringify({
    id: guestId,
    name: guestName,
    pax,
    type: "EVENT_PASS",
  });

  return (
    <div className="max-w-sm mx-auto rounded-3xl bg-white p-6 shadow-2xl border border-neutral-100 text-neutral-900 text-center">
      <div className="mb-4">
        <span className="text-xs uppercase font-bold tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          E-Pass Check-in
        </span>
        <h3 className="text-xl font-bold mt-2">{guestName}</h3>
        <p className="text-sm text-neutral-500">Kuota: {pax} Orang • Meja: {tableNumber}</p>
      </div>

      <div className="flex justify-center p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
        <QRCodeSVG
          value={qrPayload}
          size={180}
          level="H"
          includeMargin={true}
        />
      </div>

      <p className="text-xs text-neutral-400 mt-4">
        Tunjukkan QR Code ini kepada resepsionis saat tiba di lokasi acara.
      </p>
    </div>
  );
};
