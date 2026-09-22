import { Guest, InvitationData, EventProject } from '../types';
import { getCheckInUrl } from './templateEngine';

export type GuestExportFilter = 'ALL' | 'CHECKED_IN' | 'CONFIRMED' | 'PENDING' | 'DECLINED';

export function filterGuestsForExport(guests: Guest[], filter: GuestExportFilter): Guest[] {
  switch (filter) {
    case 'CHECKED_IN':
      return guests.filter((g) => g.isCheckedIn);
    case 'CONFIRMED':
      return guests.filter((g) => g.rsvpStatus.toLowerCase() === 'confirmed');
    case 'PENDING':
      return guests.filter(
        (g) => g.rsvpStatus.toLowerCase() === 'pending' || g.rsvpStatus.toLowerCase() === 'maybe'
      );
    case 'DECLINED':
      return guests.filter((g) => g.rsvpStatus.toLowerCase() === 'declined');
    case 'ALL':
    default:
      return guests;
  }
}

export function exportCsvReport(
  guests: Guest[],
  invitation: InvitationData,
  project?: EventProject | null,
  filter: GuestExportFilter = 'ALL'
) {
  const filtered = filterGuestsForExport(guests, filter);
  const eventTitle = project?.name || invitation.title;
  const now = new Date();
  const timestamp = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalPax = guests.reduce((acc, g) => acc + g.pax, 0);
  const confirmedPax = guests
    .filter((g) => g.rsvpStatus.toLowerCase() === 'confirmed')
    .reduce((acc, g) => acc + g.pax, 0);
  const checkedInCount = guests.filter((g) => g.isCheckedIn).length;
  const checkedInPax = guests
    .filter((g) => g.isCheckedIn)
    .reduce((acc, g) => acc + g.pax, 0);

  const escape = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;

  let csv = '\uFEFF'; // UTF-8 BOM for Microsoft Excel
  csv += 'LAPORAN DATA TAMU & STATUS KEHADIRAN\n';
  csv += `Nama Acara,${escape(eventTitle)}\n`;
  csv += `Tanggal Acara,${escape(invitation.date)}\n`;
  csv += `Lokasi,${escape(invitation.venue)}\n`;
  csv += `Tuan Rumah,${escape(invitation.hosts)}\n`;
  csv += `Waktu Ekspor,${escape(timestamp + ' WIB')}\n`;
  csv += `Filter Data,${escape(filter)}\n`;
  csv += `Ringkasan,${escape(
    `Total: ${guests.length} Tamu (${totalPax} Pax) | Terkonfirmasi: ${confirmedPax} Pax | Hadir: ${checkedInCount} Tamu (${checkedInPax} Pax)`
  )}\n\n`;

  csv +=
    'No,Nama Tamu,Email,Nomor WhatsApp,Kategori,Nomor Meja,Jumlah Pax,Status RSVP,Status Kehadiran,Waktu Check-In,Kode E-Pass,Tautan E-Pass\n';

  filtered.forEach((g, idx) => {
    csv += [
      idx + 1,
      escape(g.name),
      escape(g.email || '-'),
      escape(g.phone || '-'),
      escape(g.group),
      escape(g.tableNumber || '-'),
      g.pax,
      escape(g.rsvpStatus),
      escape(g.isCheckedIn ? 'Hadir' : 'Belum Hadir'),
      escape(g.checkInTime || '-'),
      escape(g.checkInCode),
      escape(getCheckInUrl(g, invitation.slug)),
    ].join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const fileDate = now.toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Laporan_Tamu_${eventTitle.replace(/\s+/g, '_')}_${fileDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printPdfReport(
  guests: Guest[],
  invitation: InvitationData,
  project?: EventProject | null,
  filter: GuestExportFilter = 'ALL'
) {
  const filtered = filterGuestsForExport(guests, filter);
  const eventTitle = project?.name || invitation.title;
  const now = new Date();
  const timestamp = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalPax = guests.reduce((acc, g) => acc + g.pax, 0);
  const confirmedPax = guests
    .filter((g) => g.rsvpStatus.toLowerCase() === 'confirmed')
    .reduce((acc, g) => acc + g.pax, 0);
  const checkedInCount = guests.filter((g) => g.isCheckedIn).length;
  const checkedInPax = guests
    .filter((g) => g.isCheckedIn)
    .reduce((acc, g) => acc + g.pax, 0);
  const pendingCount = guests.filter(
    (g) => g.rsvpStatus.toLowerCase() === 'pending' || g.rsvpStatus.toLowerCase() === 'maybe'
  ).length;

  const rows = filtered
    .map(
      (g, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
      <td style="padding: 6px 8px; color: #64748b;">${idx + 1}</td>
      <td style="padding: 6px 8px; font-weight: bold; color: #0f172a;">${g.name}</td>
      <td style="padding: 6px 8px; color: #475569;">${g.group}</td>
      <td style="padding: 6px 8px; color: #475569;">${g.tableNumber || '-'}</td>
      <td style="padding: 6px 8px; text-align: center; font-weight: bold;">${g.pax}</td>
      <td style="padding: 6px 8px;">
        <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; background: ${
          g.rsvpStatus === 'Confirmed' ? '#dcfce7; color: #166534;' : g.rsvpStatus === 'Declined' ? '#fee2e2; color: #991b1b;' : '#fef3c7; color: #92400e;'
        }">${g.rsvpStatus}</span>
      </td>
      <td style="padding: 6px 8px; font-weight: bold; color: ${g.isCheckedIn ? '#16a34a' : '#94a3b8'};">
        ${g.isCheckedIn ? '✓ Hadir' : 'Belum'}
      </td>
      <td style="padding: 6px 8px; color: #64748b; font-size: 10px;">${g.checkInTime || '-'}</td>
      <td style="padding: 6px 8px; font-family: monospace; font-size: 10px; color: #6d28d9;">${g.checkInCode}</td>
    </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Laporan Tamu - ${eventTitle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #1e293b; }
    .header { background: linear-gradient(135deg, #6d28d9, #ec4899); color: #fff; padding: 18px 24px; border-radius: 12px; margin-bottom: 20px; }
    .header h1 { margin: 0 0 6px 0; font-size: 20px; }
    .header p { margin: 2px 0; font-size: 12px; opacity: 0.9; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
    .kpi { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
    .kpi-label { font-size: 10px; text-transform: uppercase; font-weight: bold; color: #64748b; }
    .kpi-val { font-size: 18px; font-weight: bold; color: #0f172a; margin-top: 4px; }
    .kpi-sub { font-size: 10px; color: #64748b; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { background: #f1f5f9; padding: 8px; font-size: 10px; font-weight: bold; color: #475569; text-transform: uppercase; border-bottom: 2px solid #cbd5e1; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 16px;">
    <button onclick="window.print()" style="background: #6d28d9; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer;">Cetak / Simpan PDF</button>
  </div>
  <div class="header">
    <h1>${eventTitle}</h1>
    <p>Tanggal: ${invitation.date} • Lokasi: ${invitation.venue}</p>
    <p>Tuan Rumah: ${invitation.hosts} • Laporan Diekspor: ${timestamp} WIB</p>
  </div>

  <div class="kpi-grid">
    <div class="kpi">
      <div class="kpi-label">Total Tamu</div>
      <div class="kpi-val">${guests.length} Tamu</div>
      <div class="kpi-sub">Kapasitas: ${totalPax} Pax</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Konfirmasi Hadir</div>
      <div class="kpi-val">${confirmedPax} Pax</div>
      <div class="kpi-sub">${guests.filter((g) => g.rsvpStatus === 'Confirmed').length} Tamu</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Sudah Check-In</div>
      <div class="kpi-val">${checkedInCount} Tamu</div>
      <div class="kpi-sub">${checkedInPax} Pax Hadir</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Pending / Maybe</div>
      <div class="kpi-val">${pendingCount} Tamu</div>
      <div class="kpi-sub">Belum respon</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>No</th>
        <th>Nama Tamu</th>
        <th>Kategori</th>
        <th>Meja</th>
        <th>Pax</th>
        <th>Status RSVP</th>
        <th>Kehadiran</th>
        <th>Waktu Masuk</th>
        <th>Kode E-Pass</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div style="margin-top: 30px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between;">
    <span>AA : Event Maker • E-Pass & Guest Management</span>
    <span>Halaman 1 • ${filtered.length} Tamu ditampilkan</span>
  </div>
</body>
</html>`;

  const printIframe = document.createElement('iframe');
  printIframe.style.position = 'fixed';
  printIframe.style.right = '0';
  printIframe.style.bottom = '0';
  printIframe.style.width = '0';
  printIframe.style.height = '0';
  printIframe.style.border = '0';
  document.body.appendChild(printIframe);
  const doc = printIframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
    printIframe.contentWindow?.focus();
    try {
      printIframe.contentWindow?.print();
    } catch {}
    setTimeout(() => {
      try {
        document.body.removeChild(printIframe);
      } catch {}
    }, 1500);
  }
}
