import { Guest, InvitationData, EventProject, CampaignTarget } from '../types';

export interface TemplateTag {
  tag: string;
  label: string;
  sampleValue: string;
}

export const AVAILABLE_TAGS: TemplateTag[] = [
  { tag: '{{guest_name}}', label: 'Nama Lengkap Tamu', sampleValue: 'Budi Santoso' },
  { tag: '{{first_name}}', label: 'Nama Depan Tamu', sampleValue: 'Budi' },
  { tag: '{{pax}}', label: 'Jumlah Kuota Tamu', sampleValue: '2' },
  { tag: '{{table_number}}', label: 'Nomor Meja Tamu', sampleValue: 'Table 05' },
  { tag: '{{group}}', label: 'Kategori Tamu', sampleValue: 'VIP' },
  { tag: '{{check_in_code}}', label: 'Kode Unik E-Pass', sampleValue: 'AA-F3B8C1' },
  {
    tag: '{{check_in_url}}',
    label: 'Tautan Check-In Personal',
    sampleValue: 'https://aaeventmaker.app/events/andi-ayu-wedding/checkin?code=AA-F3B8C1',
  },
  { tag: '{{rsvp_status}}', label: 'Status RSVP Saat Ini', sampleValue: 'Pending' },
  { tag: '{{event_title}}', label: 'Judul Acara', sampleValue: 'Pernikahan Andi & Ayu' },
  { tag: '{{hosts}}', label: 'Mempelai / Tuan Rumah', sampleValue: 'Andi & Ayu' },
  { tag: '{{event_date}}', label: 'Tanggal Acara', sampleValue: '24 Oktober 2026' },
  { tag: '{{event_time}}', label: 'Waktu Acara', sampleValue: '18:30 WIB' },
  { tag: '{{venue}}', label: 'Nama Gedung / Tempat', sampleValue: 'Grand Ballroom Hotel Kempinski' },
  { tag: '{{address}}', label: 'Alamat Lengkap Venue', sampleValue: 'Jl. M.H. Thamrin No. 1, Jakarta' },
];

export function getCheckInUrl(guest: Guest, slug: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/#checkin?code=${guest.checkInCode}&id=${guest.id}`;
  }
  return `https://aaeventmaker.app/events/${slug}/checkin?code=${guest.checkInCode}&id=${guest.id}`;
}

export function renderEmailTemplate(
  templateText: string,
  guest: Guest,
  invitation: InvitationData,
  project?: EventProject | null
): string {
  const firstName = guest.name.trim().split(' ')[0] || guest.name;
  const checkInUrl = getCheckInUrl(guest, invitation.slug);
  const eventTitle = invitation.title || project?.name || 'Pernikahan Andi & Ayu';
  const hosts = invitation.hosts || 'Andi & Ayu';
  const eventDate = invitation.date || project?.date || '24 Oktober 2026';
  const eventTime = invitation.time || project?.time || '18:30 WIB';
  const venue = invitation.venue || project?.location || 'Grand Ballroom Plataran';
  const address = invitation.address || 'Jl. Dharmawangsa Raya No. 6, Jakarta Selatan';

  return templateText
    .replace(/\{\{guest_name\}\}/g, guest.name)
    .replace(/\{\{first_name\}\}/g, firstName)
    .replace(/\{\{pax\}\}/g, String(guest.pax))
    .replace(/\{\{table_number\}\}/g, guest.tableNumber)
    .replace(/\{\{group\}\}/g, guest.group)
    .replace(/\{\{check_in_code\}\}/g, guest.checkInCode)
    .replace(/\{\{check_in_url\}\}/g, checkInUrl)
    .replace(/\{\{rsvp_status\}\}/g, guest.rsvpStatus)
    .replace(/\{\{event_title\}\}/g, eventTitle)
    .replace(/\{\{hosts\}\}/g, hosts)
    .replace(/\{\{event_date\}\}/g, eventDate)
    .replace(/\{\{event_time\}\}/g, eventTime)
    .replace(/\{\{venue\}\}/g, venue)
    .replace(/\{\{address\}\}/g, address);
}

export function filterGuestsByTarget(target: CampaignTarget, guests: Guest[]): Guest[] {
  switch (target) {
    case 'ALL':
      return guests;
    case 'PENDING_RSVP':
      return guests.filter(
        (g) => g.rsvpStatus.toLowerCase() === 'pending' || g.rsvpStatus.toLowerCase() === 'maybe'
      );
    case 'CONFIRMED_RSVP':
      return guests.filter((g) => g.rsvpStatus.toLowerCase() === 'confirmed');
    case 'VIP_FAMILY':
      return guests.filter(
        (g) => g.group.toLowerCase() === 'vip' || g.group.toLowerCase() === 'family'
      );
    default:
      return guests;
  }
}
