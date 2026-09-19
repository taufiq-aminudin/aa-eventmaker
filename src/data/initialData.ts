import {
  EventProject,
  InvitationData,
  Guest,
  TaskItem,
  BudgetItem,
  WeeklyExpenseRecord,
  VenueLocation,
  MemoryItem,
  TemplateItem,
  PhotoPresetItem,
  VideoTemplateItem,
  EmailTemplate,
  EmailScheduleCampaign,
  AutoRsvpSchedulerConfig,
  AiConceptResult,
} from '../types';

export const INITIAL_PROJECT: EventProject = {
  id: 'project_default',
  name: 'Andi & Ayu Wedding Celebration',
  type: 'Wedding',
  date: '24 Oktober 2026',
  time: '10:00 - 15:00 WIB',
  location: 'Grand Ballroom Plataran, Jakarta Selatan',
  status: 'Planning',
  notes: 'Tema: Golden Night & Tradisi Adat Sunda Modern',
  createdAt: Date.now(),
};

export const INITIAL_INVITATION: InvitationData = {
  id: 'invitation_default',
  projectId: 'project_default',
  title: 'The Wedding of Andi & Ayu',
  hosts: 'Andi Pratama & Ayu Maharani',
  opening:
    'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon rahmat dan ridho-Nya, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri perayaan pernikahan kami.',
  date: 'Sabtu, 24 Oktober 2026',
  time: 'Akad: 08:00 WIB | Resepsi: 11:00 - 14:00 WIB',
  venue: 'Grand Ballroom Plataran Dharmawangsa',
  address: 'Jl. Dharmawangsa Raya No. 6, Kebayoran Baru, Jakarta Selatan',
  slug: 'andi-ayu-wedding',
  templateName: 'Golden Night',
  isPublished: true,
  views: 284,
};

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 'guest-1',
    projectId: 'project_default',
    name: 'Bpk. Hendra Kusuma & Partner',
    group: 'VIP',
    pax: 2,
    phone: '081234567890',
    email: 'hendra.kusuma@gmail.com',
    tableNumber: 'VIP 01',
    rsvpStatus: 'Confirmed',
    isCheckedIn: true,
    checkInTime: '09:45 WIB',
    checkInCode: 'AA-HK99',
  },
  {
    id: 'guest-2',
    projectId: 'project_default',
    name: 'Keluarga Besar Sastroamidjojo',
    group: 'Family',
    pax: 4,
    phone: '081198765432',
    email: 'sastro.family@yahoo.com',
    tableNumber: 'Family 02',
    rsvpStatus: 'Confirmed',
    isCheckedIn: false,
    checkInCode: 'AA-SF42',
  },
  {
    id: 'guest-3',
    projectId: 'project_default',
    name: 'Rizky Firmansyah',
    group: 'Friend',
    pax: 1,
    phone: '085612344321',
    email: 'rizky.f@gmail.com',
    tableNumber: 'Table 05',
    rsvpStatus: 'Confirmed',
    isCheckedIn: false,
    checkInCode: 'AA-RF10',
  },
  {
    id: 'guest-4',
    projectId: 'project_default',
    name: 'dr. Siti Nurhaliza, Sp.A',
    group: 'Colleague',
    pax: 2,
    phone: '081377889900',
    email: 'siti.nurhaliza@clinic.id',
    tableNumber: 'Table 08',
    rsvpStatus: 'Pending',
    isCheckedIn: false,
    checkInCode: 'AA-SN88',
  },
  {
    id: 'guest-5',
    projectId: 'project_default',
    name: 'Dimas Anggara & Istri',
    group: 'Friend',
    pax: 2,
    phone: '087811223344',
    email: 'dimas.anggara@corp.com',
    tableNumber: 'Table 06',
    rsvpStatus: 'Confirmed',
    isCheckedIn: false,
    checkInCode: 'AA-DA66',
  },
  {
    id: 'guest-6',
    projectId: 'project_default',
    name: 'Bambang Pamungkas',
    group: 'General',
    pax: 1,
    phone: '082199887766',
    email: 'bambang.p@outlook.com',
    tableNumber: 'Table 11',
    rsvpStatus: 'Maybe',
    isCheckedIn: false,
    checkInCode: 'AA-BP20',
  },
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    projectId: 'project_default',
    title: 'Finalisasi Dekorasi Pelaminan & Floral Arch',
    category: 'Decoration',
    dueDate: '15 Okt 2026',
    assignee: 'Ayu (Bride)',
    isCompleted: true,
  },
  {
    id: 'task-2',
    projectId: 'project_default',
    title: 'Fitting Terakhir Kebaya Akad & Jas Resepsi',
    category: 'Wardrobe',
    dueDate: '18 Okt 2026',
    assignee: 'Andi & Ayu',
    isCompleted: true,
  },
  {
    id: 'task-3',
    projectId: 'project_default',
    title: 'Kirim Undangan Digital E-Pass via WhatsApp / Email',
    category: 'Invitations',
    dueDate: '20 Okt 2026',
    assignee: 'Tim Wedding Organizer',
    isCompleted: false,
  },
  {
    id: 'task-4',
    projectId: 'project_default',
    title: 'Technical Meeting dengan Venue & Vendor Katering',
    category: 'Venue',
    dueDate: '22 Okt 2026',
    assignee: 'WO & Keluarga',
    isCompleted: false,
  },
  {
    id: 'task-5',
    projectId: 'project_default',
    title: 'Briefing Resepsionis Check-In & Scanner QR',
    category: 'Reception',
    dueDate: '23 Okt 2026',
    assignee: 'Tim Resepsionis',
    isCompleted: false,
  },
];

export const INITIAL_BUDGETS: BudgetItem[] = [
  {
    id: 'budget-1',
    projectId: 'project_default',
    category: 'Venue & Grand Ballroom',
    plannedAmount: 65000000,
    actualAmount: 62500000,
    notes: 'Termasuk fasilitas AC, panggung, dan sound system utama',
  },
  {
    id: 'budget-2',
    projectId: 'project_default',
    category: 'Katering (500 Pax)',
    plannedAmount: 75000000,
    actualAmount: 72000000,
    notes: 'Buffet utama 6 menu + 4 gubukan dessert & kambing guling',
  },
  {
    id: 'budget-3',
    projectId: 'project_default',
    category: 'Dekorasi & Pencahayaan',
    plannedAmount: 35000000,
    actualAmount: 35000000,
    notes: 'Konsep Garden Elegance dengan instalasi lampu gantung',
  },
  {
    id: 'budget-4',
    projectId: 'project_default',
    category: 'Foto & Video Sinematik',
    plannedAmount: 25000000,
    actualAmount: 22000000,
    notes: 'Dokumentasi akad, resepsi, drone, dan live streaming',
  },
  {
    id: 'budget-5',
    projectId: 'project_default',
    category: 'Busana & Rias Pengantin',
    plannedAmount: 20000000,
    actualAmount: 19500000,
    notes: 'MUA pengantin 2 look, busana orang tua dan pagar ayu',
  },
  {
    id: 'budget-6',
    projectId: 'project_default',
    category: 'Undangan Digital & Souvenir',
    plannedAmount: 10000000,
    actualAmount: 8500000,
    notes: 'Platform AA Event Maker + custom souvenir pouch kulit',
  },
];

export const INITIAL_WEEKLY_EXPENSES: WeeklyExpenseRecord[] = [
  {
    id: 'wexp-1',
    projectId: 'project_default',
    weekNumber: 1,
    weekLabel: 'Minggu 1',
    dateRange: '1 – 7 Ags 2026',
    amount: 30000000,
    note: 'DP Booking Grand Ballroom & Fasilitas Audio Utama',
    categories: ['Venue & Grand Ballroom'],
  },
  {
    id: 'wexp-2',
    projectId: 'project_default',
    weekNumber: 2,
    weekLabel: 'Minggu 2',
    dateRange: '8 – 14 Ags 2026',
    amount: 40000000,
    note: 'DP 50% Katering Prasmanan + DP Busana & MUA Pengantin',
    categories: ['Katering (500 Pax)', 'Busana & Rias Pengantin'],
  },
  {
    id: 'wexp-3',
    projectId: 'project_default',
    weekNumber: 3,
    weekLabel: 'Minggu 3',
    dateRange: '15 – 21 Ags 2026',
    amount: 47500000,
    note: 'Pelunasan Sewa Ballroom & Pembayaran Termin 1 Dekorasi Pelaminan',
    categories: ['Venue & Grand Ballroom', 'Dekorasi & Pencahayaan'],
  },
  {
    id: 'wexp-4',
    projectId: 'project_default',
    weekNumber: 4,
    weekLabel: 'Minggu 4',
    dateRange: '22 – 28 Ags 2026',
    amount: 28500000,
    note: 'DP Paket Sinematik Foto/Video & Produksi Souvenir Kulit Eksklusif',
    categories: ['Foto & Video Sinematik', 'Undangan Digital & Souvenir'],
  },
  {
    id: 'wexp-5',
    projectId: 'project_default',
    weekNumber: 5,
    weekLabel: 'Minggu 5',
    dateRange: '29 Ags – 4 Sep 2026',
    amount: 45000000,
    note: 'Pelunasan Sisa Katering Gubukan & Instalasi Lighting Dekorasi',
    categories: ['Katering (500 Pax)', 'Dekorasi & Pencahayaan'],
  },
  {
    id: 'wexp-6',
    projectId: 'project_default',
    weekNumber: 6,
    weekLabel: 'Minggu 6',
    dateRange: '5 – 11 Sep 2026',
    amount: 28500000,
    note: 'Pelunasan Tim Fotografi/Drone & Pelunasan Busana Keluarga/Pagar Ayu',
    categories: ['Foto & Video Sinematik', 'Busana & Rias Pengantin'],
  },
];

export const INITIAL_LOCATIONS: VenueLocation[] = [
  {
    id: 'loc-1',
    projectId: 'project_default',
    name: 'Masjid Agung Al-Azhar (Akad Nikah)',
    type: 'Akad Nikah / Ceremony',
    address: 'Jl. Sisingamangaraja No. 1, Selong, Kebayoran Baru, Jakarta Selatan',
    time: '08:00 - 10:00 WIB',
    mapUrl: 'https://maps.google.com/?q=Masjid+Al+Azhar+Kebayoran',
  },
  {
    id: 'loc-2',
    projectId: 'project_default',
    name: 'Plataran Dharmawangsa (Resepsi)',
    type: 'Resepsi / Reception',
    address: 'Jl. Dharmawangsa Raya No. 6, Pulo, Kebayoran Baru, Jakarta Selatan',
    time: '11:00 - 14:00 WIB',
    mapUrl: 'https://maps.google.com/?q=Plataran+Dharmawangsa',
  },
];

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    projectId: 'project_default',
    guestName: 'Hendra & Keluarga',
    message: 'Selamat menempuh hidup baru Andi & Ayu! Semoga selalu sakinah, mawaddah, warahmah.',
    timestamp: '24 Okt 2026, 11:30',
  },
  {
    id: 'mem-2',
    projectId: 'project_default',
    guestName: 'dr. Siti Nurhaliza',
    message: "Barakallahu laka wa baraka 'alaika wa jama'a bainakuma fii khoir. Cantik dan gagah sekali!",
    timestamp: '24 Okt 2026, 12:15',
  },
  {
    id: 'mem-3',
    projectId: 'project_default',
    guestName: 'Rizky & Kawan Sekampus',
    message: 'Selamat brader Andi! Lancar sampai kakek nenek, jangan lupa traktir anak-anak!',
    timestamp: '24 Okt 2026, 13:00',
  },
];

export const TEMPLATES_DATA: TemplateItem[] = [
  {
    id: 'tmpl_golden',
    title: 'Golden Night',
    category: 'Wedding',
    styleTag: 'Luxury Gold',
    gradientTheme: 'bg-gradient-to-br from-[#151515] via-[#8B5E34] to-[#E7C98B]',
    gradientColors: ['#151515', '#8B5E34', '#E7C98B'],
    description: 'Elegansi malam dengan sentuhan kilau emas dan tipografi klasik',
    svgAsset: '/assets/templates/elegant-white.svg',
  },
  {
    id: 'tmpl_sunda',
    title: 'Sunda Halus',
    category: 'Adat Heritage',
    styleTag: 'Cultural Adat',
    gradientTheme: 'bg-gradient-to-br from-[#1B3B2B] via-[#4D7C0F] to-[#D4AF37]',
    gradientColors: ['#1B3B2B', '#4D7C0F', '#D4AF37'],
    description: 'Nuansa lembut bernuansa hijau botani dan motif siger Sunda modern',
    svgAsset: '/assets/sunda-halus.svg',
  },
  {
    id: 'tmpl_jawa',
    title: 'Jawa Tengah & Solo',
    category: 'Adat Heritage',
    styleTag: 'Batik Royal',
    gradientTheme: 'bg-gradient-to-br from-[#3B1E08] via-[#78350F] to-[#FBBF24]',
    gradientColors: ['#3B1E08', '#78350F', '#FBBF24'],
    description: 'Keagungan kraton dengan aksen prada emas dan motif batik parang',
    svgAsset: '/assets/jawa-tengah.svg',
  },
  {
    id: 'tmpl_bali',
    title: 'Bali Ayu',
    category: 'Adat Heritage',
    styleTag: 'Tropical Royal',
    gradientTheme: 'bg-gradient-to-br from-[#4C0519] via-[#9F1239] to-[#FACC15]',
    gradientColors: ['#4C0519', '#9F1239', '#FACC15'],
    description: 'Harmoni bunga kamboja, ornamen ukir Bali dan warna tropis megah',
    svgAsset: '/assets/bali-ayu.svg',
  },
  {
    id: 'tmpl_garden',
    title: 'Garden Bloom',
    category: 'Wedding',
    styleTag: 'Romantic Floral',
    gradientTheme: 'bg-gradient-to-br from-[#14532D] via-[#86A86B] to-[#E9D5B5]',
    gradientColors: ['#14532D', '#86A86B', '#E9D5B5'],
    description: 'Kesegaran pesta taman dengan hiasan dedaunan eucalyptus dan mawar',
    svgAsset: '/assets/templates/garden-romance.svg',
  },
  {
    id: 'tmpl_minimal',
    title: 'Minimal Motion',
    category: 'Modern',
    styleTag: 'Clean Editorial',
    gradientTheme: 'bg-gradient-to-br from-[#0F172A] via-[#312E81] to-[#DB2777]',
    gradientColors: ['#0F172A', '#312E81', '#DB2777'],
    description: 'Desain modern kontemporer dengan tipografi sans-serif minimalis',
    svgAsset: '/assets/templates/modern-minimalist.svg',
  },
  {
    id: 'tmpl_ballroom',
    title: 'Ballroom Classic',
    category: 'Wedding',
    styleTag: 'Grand Luxury',
    gradientTheme: 'bg-gradient-to-br from-[#1E1B4B] via-[#4338CA] to-[#FCD34D]',
    gradientColors: ['#1E1B4B', '#4338CA', '#FCD34D'],
    description: 'Gaya megah resepsi ballroom dengan lampu chandelier berkilau',
    svgAsset: '/assets/templates/ballroom-classic.svg',
  },
  {
    id: 'tmpl_birthday',
    title: 'Birthday Pop',
    category: 'Birthday',
    styleTag: 'Celebration',
    gradientTheme: 'bg-gradient-to-br from-[#701A75] via-[#C026D3] to-[#F472B6]',
    gradientColors: ['#701A75', '#C026D3', '#F472B6'],
    description: 'Warna ceria penuh energi untuk perayaan ulang tahun meriah',
    svgAsset: '/assets/templates/birthday-pop.svg',
  },
  {
    id: 'tmpl_corporate',
    title: 'Corporate Summit',
    category: 'Corporate',
    styleTag: 'Professional',
    gradientTheme: 'bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#0284C7]',
    gradientColors: ['#1E293B', '#334155', '#0284C7'],
    description: 'Tema formal dan prestisius untuk seminar, summit, dan konferensi',
    svgAsset: '/assets/templates/corporate-summit.svg',
  },
];

export const PHOTO_PRESETS: PhotoPresetItem[] = [
  {
    id: 'preset_warm_film',
    name: 'Warm 35mm Film',
    toneTag: 'Cinematic Grain',
    temp: '+12 (Warm)',
    tint: '+4 (Magenta)',
    exposure: '+0.25 EV',
    contrast: '+15',
    highlights: '-20',
    shadows: '+25',
    tintColorHex: '#FFA726',
    tintAlpha: 0.14,
    description: 'Estetika analog bernuansa hangat dengan highlight halus dan kontras film klasik.',
  },
  {
    id: 'preset_golden_hour',
    name: 'Golden Amber Glow',
    toneTag: 'Sunset Mood',
    temp: '+22 (Golden)',
    tint: '+8',
    exposure: '+0.35 EV',
    contrast: '+20',
    highlights: '-35',
    shadows: '+30',
    tintColorHex: '#FFB300',
    tintAlpha: 0.2,
    description: 'Menonjolkan kilau emas senja dan warna kulit yang bercahaya alami (radiant glow).',
  },
  {
    id: 'preset_clean_editorial',
    name: 'Clean Editorial Pastel',
    toneTag: 'Vogue & Harpers',
    temp: '-4 (Cool Clean)',
    tint: '+2',
    exposure: '+0.40 EV',
    contrast: '-5 (Soft)',
    highlights: '-15',
    shadows: '+40',
    tintColorHex: '#81D4FA',
    tintAlpha: 0.08,
    description: 'Tone bersih modern dengan bayangan terang dan warna floral yang lembut natural.',
  },
  {
    id: 'preset_teal_orange',
    name: 'Teal & Warm Bronze',
    toneTag: 'Hollywood Drama',
    temp: '+6',
    tint: '-10 (Teal Shadows)',
    exposure: '+0.10 EV',
    contrast: '+30',
    highlights: '-40',
    shadows: '+10',
    tintColorHex: '#00838F',
    tintAlpha: 0.16,
    description: 'Gradasi warna sinematik Hollywood kontras tinggi dengan bayangan teal dan kulit perunggu.',
  },
  {
    id: 'preset_monochrome_royal',
    name: 'Royal B&W Timeless',
    toneTag: 'Classic Monochrome',
    temp: '0',
    tint: '0',
    exposure: '+0.20 EV',
    contrast: '+45',
    highlights: '-10',
    shadows: '+15',
    tintColorHex: '#212121',
    tintAlpha: 0.45,
    description: 'Hitam putih sakral berkarakter mendalam yang menonjolkan emosi dan detail gaun.',
  },
];

export const VIDEO_TEMPLATES: VideoTemplateItem[] = [
  {
    id: 'vid_reels_teaser',
    title: 'Teaser Reels & TikTok 9:16',
    format: '9:16 Vertikal Fullscreen',
    duration: '30 Detik',
    bpm: '118 BPM',
    musicStyle: 'Acoustic Pop Romance / Indie Strings',
    description:
      'Transisi cepat berirama beat musik, sangat cocok untuk teaser akad nikah, pamer kebaya, dan detail cincin.',
    cameraGear: 'Sony A7S III / Canon R5 + 50mm f/1.2 & Gimbal RS3',
    colorLut: 'Warm Kodak Portra 400 LUT',
    sceneBeats: [
      {
        timestamp: '00:00 - 00:04',
        action: 'Opening macro shot cincin nikah & sepatu pengantin',
        shotType: 'Close Up / Macro',
        transition: 'Slow Zoom In',
      },
      {
        timestamp: '00:04 - 00:10',
        action: 'Bride makeup reveal & sentuhan paes adat Sunda',
        shotType: 'Medium Shot',
        transition: 'Whip Pan Transition',
      },
      {
        timestamp: '00:10 - 00:18',
        action: 'First look & tatapan intim kedua mempelai di taman',
        shotType: 'Over-The-Shoulder',
        transition: 'Lens Flare Burn',
      },
      {
        timestamp: '00:18 - 00:25',
        action: 'Momen sakral ijab qabul & senyum haru keluarga',
        shotType: 'Slow Motion 60fps',
        transition: 'Smooth Crossfade',
      },
      {
        timestamp: '00:25 - 00:30',
        action: 'Jalan bersama di lorong lampu fairy lights & confetti',
        shotType: 'Wide Tracking Shot',
        transition: 'Fade Out to Title',
      },
    ],
  },
  {
    id: 'vid_cinematic_film',
    title: 'Cinematic Wedding Highlight 16:9',
    format: '16:9 Widescreen Cinema',
    duration: '3 - 5 Menit',
    bpm: '75 - 90 BPM',
    musicStyle: 'Cinematic Orchestral & Emotional Piano',
    description:
      'Dokumentasi sinematik bergaya film layar lebar yang merekam seluruh emosi prosesi dari akad hingga resepsi megah.',
    cameraGear: 'FX3 / RED Komodo + Anamorphic 35mm & 85mm Prime',
    colorLut: 'Arri Alexa Teal & Amber Cinema Grade',
    sceneBeats: [
      {
        timestamp: '00:00 - 00:45',
        action: 'Suasana pagi venue, dedaunan berembun & dekorasi pelaminan',
        shotType: 'Wide Establishing & Drone',
        transition: 'Ambient Fade',
      },
      {
        timestamp: '00:45 - 01:30',
        action: 'Prosesi sungkeman mohon restu orang tua penuh haru',
        shotType: 'Low Angle Portrait',
        transition: 'Soft Dissolve',
      },
      {
        timestamp: '01:30 - 02:45',
        action: 'Ijab qabul dengan audio janji suci jernih tanpa noise',
        shotType: 'Multi-Cam Two-Shot',
        transition: 'Beat-synced Cut',
      },
      {
        timestamp: '02:45 - 04:15',
        action: 'Grand entrance resepsi ballroom & dansa pertama (first dance)',
        shotType: 'Gimbal 360 Rotation',
        transition: 'Light Leak Flare',
      },
      {
        timestamp: '04:15 - 05:00',
        action: 'Lempar buket bunga, kebersamaan sahabat & kembang api',
        shotType: 'Slow Motion 120fps',
        transition: 'Cinematic Dip to Black',
      },
    ],
  },
];

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tmpl_formal_invitation',
    name: 'Undangan Resmi & E-Pass',
    category: 'INVITATION',
    subject: 'Undangan Pernikahan: {{event_title}} - {{guest_name}}',
    body: `Kepada Yth.
Bapak/Ibu/Saudara/i {{guest_name}},

Dengan penuh rasa syukur dan sukacita, kami mengundang Anda untuk hadir dan memberikan doa restu pada momen bahagia kami:

★ {{event_title}}
Mempelai / Tuan Rumah: {{hosts}}
Tanggal: {{event_date}}
Waktu: {{event_time}} WIB
Lokasi: {{venue}}
Alamat: {{address}}

═════════════════════════════════════
INFORMASI DETAIL TIKET & E-PASS ANDA:
- Alokasi Kursi: {{pax}} Orang
- Nomor Meja: {{table_number}}
- Kategori Tamu: {{group}}
- Kode Registrasi: {{check_in_code}}

Silakan akses E-Pass digital dan konfirmasi kehadiran melalui tautan personal Anda:
{{check_in_url}}
═════════════════════════════════════

Kehadiran dan doa restu Anda merupakan kehormatan terbesar bagi kami dan keluarga besar.

Salam hangat dan penuh takzim,
{{hosts}}`,
    isDefault: true,
  },
  {
    id: 'tmpl_rsvp_reminder',
    name: 'Pengingat Konfirmasi RSVP (H-7 / H-3)',
    category: 'RSVP_REMINDER',
    subject: 'Pengingat Konfirmasi Kehadiran: {{event_title}} ({{guest_name}})',
    body: `Halo {{first_name}},

Semoga kabar baik selalu menyertai Anda dan keluarga tercinta.

Mengingat hari bahagia {{event_title}} semakin dekat ({{event_date}} di {{venue}}), kami memohon kesediaan Anda untuk mengonfirmasi status kehadiran (RSVP) demi kelancaran penyusunan tempat duduk dan katering terbaik untuk Anda.

═════════════════════════════════════
RINGKASAN STATUS RESERVASI:
- Nama Tamu: {{guest_name}}
- Alokasi Kursi: {{pax}} Orang
- Meja yang Dialokasikan: {{table_number}}
- Status Saat Ini: {{rsvp_status}}

Mohon konfirmasi status kehadiran Anda melalui tautan resmi ini:
{{check_in_url}}
═════════════════════════════════════

Jika Anda memiliki kebutuhan diet khusus atau pertanyaan seputar lokasi, silakan balas pesan ini.

Terima kasih banyak atas perhatiannya,
{{hosts}}`,
    isDefault: true,
  },
  {
    id: 'tmpl_venue_guide',
    name: 'Panduan Hari-H & E-Pass Resepsionis',
    category: 'VENUE_GUIDE',
    subject: 'E-Pass Registrasi & Petunjuk Arah: {{event_title}} (Meja {{table_number}})',
    body: `Kepada Yth. {{guest_name}},

Acara {{event_title}} akan segera berlangsung! Berikut adalah informasi penting untuk kemudahan akses dan registrasi di lokasi:

★ Waktu & Tempat:
Waktu Mulai: {{event_time}} WIB
Gedung: {{venue}}
Alamat: {{address}}

═════════════════════════════════════
TIKET MASUK & CHECK-IN DIGITAL (E-PASS):
- Kode Check-In Resepsionis: {{check_in_code}}
- Alokasi Kursi: {{pax}} Orang
- Nomor Meja: {{table_number}}

Tunjukkan QR Code atau buka tautan di bawah ini langsung kepada petugas di meja registrasi tamu:
{{check_in_url}}
═════════════════════════════════════

Mohon hadir 15-30 menit lebih awal untuk kenyamanan proses penukaran souvenir dan registrasi.

Sampai jumpa di hari istimewa kami!
Salam takzim,
{{hosts}}`,
    isDefault: true,
  },
  {
    id: 'tmpl_thank_you',
    name: 'Ucapan Terima Kasih Pasca Acara',
    category: 'THANK_YOU',
    subject: 'Terima Kasih atas Kehadiran & Doa Restu Anda di {{event_title}}',
    body: `Kepada Yth. Bapak/Ibu/Saudara/i {{guest_name}},

Dari lubuk hati yang terdalam, kami sekeluarga mengucapkan terima kasih yang sebesar-besarnya atas kehadiran, doa restu yang tulus, serta bingkisan dan perhatian manis yang telah Anda berikan pada acara {{event_title}}.

Momen bahagia kami terasa begitu sempurna dan hangat berkat kehadiran Anda.

Semoga tali silaturahmi kita selalu terjaga dan keberkahan senantiasa melimpahi Anda beserta seluruh keluarga tercinta.

Salam hormat dan penuh rasa syukur,
{{hosts}}`,
    isDefault: true,
  },
];

export const INITIAL_CAMPAIGNS: EmailScheduleCampaign[] = [
  {
    id: 'camp-1',
    projectId: 'project_default',
    title: 'Blast Undangan Resmi & E-Pass',
    templateId: 'tmpl_formal_invitation',
    subject: 'Undangan Pernikahan: {{event_title}} - {{guest_name}}',
    bodyTemplate: DEFAULT_EMAIL_TEMPLATES[0].body,
    target: 'ALL',
    scheduleTiming: 'H_MINUS_7',
    scheduledTimeDisplay: '17 Okt 2026, 09:00 WIB',
    status: 'SCHEDULED',
    recipientCount: 6,
    createdAt: Date.now(),
  },
  {
    id: 'camp-2',
    projectId: 'project_default',
    title: 'Pengingat Konfirmasi RSVP Final',
    templateId: 'tmpl_rsvp_reminder',
    subject: 'Pengingat Konfirmasi Kehadiran: {{event_title}} ({{guest_name}})',
    bodyTemplate: DEFAULT_EMAIL_TEMPLATES[1].body,
    target: 'PENDING_RSVP',
    scheduleTiming: 'H_MINUS_3',
    scheduledTimeDisplay: '21 Okt 2026, 10:00 WIB',
    status: 'DRAFT',
    recipientCount: 2,
    createdAt: Date.now(),
  },
];

export const INITIAL_AUTO_RSVP_CONFIG: AutoRsvpSchedulerConfig = {
  projectId: 'project_default',
  isEnabled: true,
  rules: [
    {
      id: 'rule-1',
      title: 'Pengingat Pertama (H-7)',
      timing: 'H_MINUS_7',
      scheduledTimeDisplay: '17 Okt 2026, 09:00 WIB (H-7)',
      isEnabled: true,
      lastTriggered: null,
      totalDispatched: 0,
    },
    {
      id: 'rule-2',
      title: 'Pengingat Intensif (H-3)',
      timing: 'H_MINUS_3',
      scheduledTimeDisplay: '21 Okt 2026, 10:00 WIB (H-3)',
      isEnabled: true,
      lastTriggered: null,
      totalDispatched: 0,
    },
    {
      id: 'rule-3',
      title: 'Pengingat Final Katering (H-1)',
      timing: 'H_MINUS_1',
      scheduledTimeDisplay: '23 Okt 2026, 08:00 WIB (H-1)',
      isEnabled: false,
      lastTriggered: null,
      totalDispatched: 0,
    },
  ],
  emailSubject: 'Pengingat Konfirmasi RSVP: {{event_title}} ({{guest_name}})',
  emailBody: `Halo {{first_name}},

Mengingat hari bahagia {{event_title}} semakin dekat pada {{event_date}} di {{venue}}, kami mencatat bahwa Anda belum mengonfirmasi kehadiran.

Mohon bantu kami mempersiapkan jamuan terbaik dengan mengonfirmasi kehadiran Anda melalui tautan RSVP personal berikut:
{{check_in_url}}

Detail Undangan:
- Kuota: {{pax}} Pax • Meja: {{table_number}}
- Kode E-Pass: {{check_in_code}}

Konfirmasi kehadiran Anda sangat berarti bagi kelancaran acara kami. Terima kasih banyak!

Salam hangat,
{{hosts}}`,
  lastTriggeredTime: '12 Okt 2026, 14:30 WIB',
  totalRemindersSent: 4,
  logs: [
    {
      id: 'log-1',
      timestamp: '12 Okt 2026, 14:30 WIB',
      recipientCount: 4,
      recipientNames: [
        'dr. Siti Nurhaliza, Sp.A',
        'Bambang Pamungkas',
        'Rizky Firmansyah',
        'Dimas Anggara',
      ],
      triggerSource: 'Simulasi Jadwal Awal',
      summary: 'Reminder blast berhasil dikirimkan ke 4 tamu pending',
    },
  ],
};

export const INITIAL_AI_CONCEPT: AiConceptResult = {
  prompt: 'Pernikahan adat Sunda modern tema taman malam elegan',
  themeTitle: 'Royal Botanical Night',
  palette: [
    'Deep Emerald #14532D',
    'Rose Gold #F43F5E',
    'Ivory White #FFFBEB',
    'Champagne Gold #F59E0B',
  ],
  typography: 'Cormorant Garamond (Editorial Serif) + Plus Jakarta Sans (Clean Body)',
  copywriting:
    'Di bawah gemerlap bintang dan restu kedua orang tua, kami mengundang Anda untuk menjadi saksi pengikatan janji suci cinta kami.',
  photoDirection:
    'Golden hour outdoor framing, soft bokeh, signature silhouette dengan latar dedaunan botanical',
};
