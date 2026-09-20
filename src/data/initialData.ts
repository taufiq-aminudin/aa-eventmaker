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
  coverPhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
  couplePhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  groomPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  bridePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  galleryPhotos: [
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519225429712-421b9ec76fbe?auto=format&fit=crop&w=600&q=80',
  ],
  quote: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.',
  loveStory: [
    { year: '2021', title: 'Pertemuan Pertama', desc: 'Berkenalan di ruang diskusi arsitektur Universitas Indonesia.' },
    { year: '2024', title: 'Ikrar Komitmen', desc: 'Melangkah ke jenjang yang lebih serius di tepi Danau Toba.' },
    { year: '2026', title: 'Menuju Hari Bahagia', desc: 'Menyatukan dua keluarga besar dalam ikatan suci pernikahan.' },
  ],
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
    gradientTheme: 'bg-gradient-to-br from-[#0f172a] via-[#78350f] to-[#f59e0b]',
    gradientColors: ['#0f172a', '#78350f', '#f59e0b'],
    description: 'Elegansi malam bertabur bintang dengan sentuhan kilau emas murni dan tipografi serif klasik.',
    svgAsset: '/assets/templates/elegant-white.svg',
    sampleHosts: 'Andi Pratama, S.T. & Ayu Maharani, B.A.',
    sampleDate: 'Sabtu, 24 Oktober 2026',
    sampleVenue: 'Grand Ballroom Plataran Dharmawangsa, Jakarta Selatan',
    sampleOpening: 'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Kehadiran dan doa restu Anda adalah kehormatan terindah bagi kami.',
    sampleQuote: 'Two souls with but a single thought, two hearts that beat as one.',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    accentColor: '#f59e0b',
    patternType: 'ballroom',
  },
  {
    id: 'tmpl_jawa',
    title: 'Jawa Tengah & Solo',
    category: 'Adat Heritage',
    styleTag: 'Batik Royal',
    gradientTheme: 'bg-gradient-to-br from-[#271506] via-[#5c2a0b] to-[#d97706]',
    gradientColors: ['#271506', '#5c2a0b', '#d97706'],
    description: 'Keagungan kraton dengan aksen prada emas, ornamen gunungan wayang, dan motif batik klasik parang.',
    svgAsset: '/assets/jawa-tengah.svg',
    sampleHosts: 'Raden Mas Suryo Putro & Ayu Larasati',
    sampleDate: 'Minggu, 15 November 2026',
    sampleVenue: 'Pendopo Sasana Langen Budaya, Surakarta',
    sampleOpening: 'Nyuwun donga pangestu dhumateng Gusti Ingkang Murbeng Dumadi ing adicara panggih dhaup suci temanten.',
    sampleQuote: 'Cipta, Rasa, Karsa nyawiji ing paseduluran langgeng.',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    accentColor: '#d97706',
    patternType: 'batik',
  },
  {
    id: 'tmpl_sunda',
    title: 'Sunda Halus',
    category: 'Adat Heritage',
    styleTag: 'Cultural Adat',
    gradientTheme: 'bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#eab308]',
    gradientColors: ['#064e3b', '#047857', '#eab308'],
    description: 'Nuansa lembut bernuansa hijau botani, ornamen mahkota Siger Sunda, dan untaian melati puspa bangsa.',
    svgAsset: '/assets/sunda-halus.svg',
    sampleHosts: 'Rizky Firmansyah, S.E. & Neng Santi Rahayu, M.Si.',
    sampleDate: 'Sabtu, 05 Desember 2026',
    sampleVenue: 'Bumi Sangkuriang Heritage Pavilion, Bandung',
    sampleOpening: 'Kalayan nyuhunkeun widi ti Gusti Nu Maha Suci, mugi Gusti ngantebkeun cinta sareng kabagjaan rumah tangga.',
    sampleQuote: 'Silih asih, silih asah, silih asuh dina iketan tali perkawinan suci.',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1519225429712-421b9ec76fbe?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    accentColor: '#eab308',
    patternType: 'siger',
  },
  {
    id: 'tmpl_bali',
    title: 'Bali Ayu',
    category: 'Adat Heritage',
    styleTag: 'Tropical Royal',
    gradientTheme: 'bg-gradient-to-br from-[#701a75] via-[#9d174d] to-[#f59e0b]',
    gradientColors: ['#701a75', '#9d174d', '#f59e0b'],
    description: 'Harmoni candi bentar agung, ornamen ukir Bali, harum bunga kamboja frangipani dan pesona dewata.',
    svgAsset: '/assets/bali-ayu.svg',
    sampleHosts: 'I Putu Gede Mahardika & Ni Kadek Suastini',
    sampleDate: 'Minggu, 18 Oktober 2026',
    sampleVenue: 'Plataran Ubud Royal Sanctuary, Gianyar, Bali',
    sampleOpening: 'Om Swastyastu, dumogi Ida Sang Hyang Widhi Wasa ngicenin karahayuan ring pamargin pawiwahan puniki.',
    sampleQuote: 'Dumogi langgeng riwekasan, asih masawitra selami-lamine.',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    accentColor: '#f59e0b',
    patternType: 'balinese',
  },
  {
    id: 'tmpl_garden',
    title: 'Garden Bloom',
    category: 'Wedding',
    styleTag: 'Romantic Floral',
    gradientTheme: 'bg-gradient-to-br from-[#14532d] via-[#15803d] to-[#a3e635]',
    gradientColors: ['#14532d', '#15803d', '#a3e635'],
    description: 'Kesegaran pesta taman terbuka dengan hiasan dedaunan eucalyptus segar, mawar putih, dan lentera hangat.',
    svgAsset: '/assets/templates/garden-romance.svg',
    sampleHosts: 'Daniel Wirawan & Clarissa Jovita',
    sampleDate: 'Sabtu, 12 September 2026',
    sampleVenue: 'Pine Hill Eco Forest Garden, Lembang',
    sampleOpening: 'Under the shade of pine trees and beneath the open sky, we begin our greatest adventure together.',
    sampleQuote: 'To love and be loved is to feel the sun from both sides.',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    accentColor: '#10b981',
    patternType: 'floral',
  },
  {
    id: 'tmpl_ballroom',
    title: 'Ballroom Classic',
    category: 'Wedding',
    styleTag: 'Grand Luxury',
    gradientTheme: 'bg-gradient-to-br from-[#0c1322] via-[#1e293b] to-[#38bdf8]',
    gradientColors: ['#0c1322', '#1e293b', '#38bdf8'],
    description: 'Gaya resepsi megah bintang lima dengan lampu gantung kristal chandelier dan kemewahan arsitektur modern.',
    svgAsset: '/assets/templates/ballroom-classic.svg',
    sampleHosts: 'Michael Anthony, B.Com & Jessica Veronica, B.A.',
    sampleDate: 'Sabtu, 28 November 2026',
    sampleVenue: 'The Ritz-Carlton Pacific Place Ballroom, SCBD Jakarta',
    sampleOpening: 'Together with their parents, cordially invite you to celebrate the solemnization and reception of their marriage.',
    sampleQuote: 'Forever begins tonight in celebration with family and dearest friends.',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    accentColor: '#38bdf8',
    patternType: 'ballroom',
  },
  {
    id: 'tmpl_engagement',
    title: 'Engagement Bloom',
    category: 'Engagement',
    styleTag: 'Romantic Pastel',
    gradientTheme: 'bg-gradient-to-br from-[#831843] via-[#be185d] to-[#f472b6]',
    gradientColors: ['#831843', '#be185d', '#f472b6'],
    description: 'Momen lamaran manis berbalut palet pastel dusty rose, kilau cincin pertunangan, dan janji suci berdua.',
    svgAsset: '/assets/templates/engagement-bloom.svg',
    sampleHosts: 'Fajar Hidayat & Anindya Kirana',
    sampleDate: 'Minggu, 09 Agustus 2026',
    sampleVenue: 'Glass House Rooftop, Kemang, Jakarta',
    sampleOpening: 'We said YES to forever! Bersama keluarga tercinta kami melangkah ke gerbang ikrar pertunangan suci.',
    sampleQuote: 'He asked, She said yes! A sweet step toward our forever story.',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    accentColor: '#f472b6',
    patternType: 'floral',
  },
  {
    id: 'tmpl_birthday',
    title: 'Birthday Pop',
    category: 'Birthday',
    styleTag: 'Celebration Party',
    gradientTheme: 'bg-gradient-to-br from-[#581c87] via-[#a21caf] to-[#f43f5e]',
    gradientColors: ['#581c87', '#a21caf', '#f43f5e'],
    description: 'Pesta ulang tahun penuh tawa, confetti warna-warni, kue manis, dan alunan musik ceria tak terlupakan.',
    svgAsset: '/assets/templates/birthday-pop.svg',
    sampleHosts: 'Celebrating Kayla’s Sweet 17th!',
    sampleDate: 'Sabtu, 19 Desember 2026',
    sampleVenue: 'Skyline Lounge & Terrace, Senayan City',
    sampleOpening: 'Come dance, laugh, and celebrate seventeen amazing years with endless joy, mocktails, and live DJ beats!',
    sampleQuote: 'Life is meant for good friends and great celebrations!',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    accentColor: '#f43f5e',
    patternType: 'festive',
  },
  {
    id: 'tmpl_corporate',
    title: 'Corporate Summit',
    category: 'Corporate',
    styleTag: 'Executive Modern',
    gradientTheme: 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0284c7]',
    gradientColors: ['#0f172a', '#1e293b', '#0284c7'],
    description: 'Format prestisius untuk seminar internasional, konferensi bisnis, gala dinner eksekutif, dan peluncuran produk.',
    svgAsset: '/assets/templates/corporate-summit.svg',
    sampleHosts: 'Indonesia Future Tech & Green Energy Summit 2026',
    sampleDate: 'Kamis, 22 Oktober 2026',
    sampleVenue: 'Jakarta Convention Center (JCC) Main Hall',
    sampleOpening: 'Connecting global pioneers, innovative founders, and industry leaders to shape tomorrow’s digital economy.',
    sampleQuote: 'Innovate, Collaborate, and Lead the Next Horizon.',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    accentColor: '#0284c7',
    patternType: 'corporate',
  },
  {
    id: 'tmpl_baby',
    title: 'Baby Story & Aqiqah',
    category: 'Baby',
    styleTag: 'Sweet Nursery',
    gradientTheme: 'bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#93c5fd]',
    gradientColors: ['#1e3a8a', '#3b82f6', '#93c5fd'],
    description: 'Kelembutan syukuran kelahiran buah hati, aqiqah, dan doa berkah dalam nuansa awan pastel menenangkan.',
    svgAsset: '/assets/templates/baby-story.svg',
    sampleHosts: 'Tasyakuran Aqiqah Muhammad Rayyan Al-Fatih',
    sampleDate: 'Ahad, 08 November 2026',
    sampleVenue: 'Kediaman Keluarga Besar, Menteng Jakarta Pusat',
    sampleOpening: 'Alhamdulillah, telah lahir putra pertama kami yang kami beri nama Muhammad Rayyan Al-Fatih. Mohon doa restu agar menjadi anak yang sholeh.',
    sampleQuote: 'A baby fills a place in your heart you never knew was empty.',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
    accentColor: '#38bdf8',
    patternType: 'stars',
  },
  {
    id: 'tmpl_jogja_solo',
    title: 'Keraton Solo & Jogja Hadiningrat',
    category: 'Adat Heritage',
    styleTag: 'Heritage Kraton',
    gradientTheme: 'bg-gradient-to-br from-[#1c1917] via-[#451a03] to-[#b45309]',
    gradientColors: ['#1c1917', '#451a03', '#b45309'],
    description: 'Kemegahan busana basahan, prada beludru hitam berhias untaian melati tibo dodo dan ornamen lung-lungan emas.',
    svgAsset: '/assets/jawa-tengah.svg',
    sampleHosts: 'K.R.T. Bagus Dananjaya & Raden Roro Sekar Langit',
    sampleDate: 'Sabtu, 14 November 2026',
    sampleVenue: 'Pendopo Ndalem Danukusuman, Surakarta',
    sampleOpening: 'Mulat sarira hangrasa wani, hanetepi dhaup suci temanten kanthi donga pamuji para sesepuh.',
    sampleQuote: 'Memayu Hayuning Bawana, Manunggaling Kawula Gusti.',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    accentColor: '#b45309',
    patternType: 'batik',
  },
  {
    id: 'tmpl_minimalist_noir',
    title: 'Modern Minimalist Serif',
    category: 'Modern',
    styleTag: 'Clean Editorial',
    gradientTheme: 'bg-gradient-to-br from-[#09090b] via-[#18181b] to-[#71717a]',
    gradientColors: ['#09090b', '#18181b', '#71717a'],
    description: 'Estetika editorial kontemporer dengan ruang negatif lega, tipografi berjarak rapi, dan garis monokrom elegan.',
    svgAsset: '/assets/templates/ballroom-classic.svg',
    sampleHosts: 'Julian Alexander & Samantha Grace',
    sampleDate: 'Jumat, 16 Oktober 2026',
    sampleVenue: 'The Glasshouse Senayan Pavilion, Jakarta',
    sampleOpening: 'We invite you to join us in an intimate celebration of love, commitment, and good memories.',
    sampleQuote: 'Simplicity is the keynote of all true elegance.',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    accentColor: '#a1a1aa',
    patternType: 'ballroom',
  },
  {
    id: 'tmpl_islamic_classic',
    title: 'Islamic Arabesque & Emerald',
    category: 'Islamic',
    styleTag: 'Barakah Islamic',
    gradientTheme: 'bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#d97706]',
    gradientColors: ['#022c22', '#064e3b', '#d97706'],
    description: 'Nuansa syar’i penuh keberkahan dengan ornamen geometri Islam, doa Al-Quran kaligrafi emas, dan kesucian suci.',
    svgAsset: '/assets/templates/elegant-white.svg',
    sampleHosts: 'Ahmad Faisal, Lc. & Khadijah Azzahra, S.Hum.',
    sampleDate: 'Ahad, 20 Desember 2026',
    sampleVenue: 'Masjid Agung Sunda Kelapa & Puri Syariah, Menteng',
    sampleOpening: 'Bismillahir Rahmanir Rahim. Mengikuti Sunnah Rasulullah SAW, kami bermaksud melangsungkan aqad nikah suci.',
    sampleQuote: 'Dan jadikanlah di antara kamu rasa kasih dan sayang (QS. Ar-Rum: 21).',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    accentColor: '#d97706',
    patternType: 'batik',
  },
  {
    id: 'tmpl_anniversary_silver',
    title: 'Silver Romance & Anniversary',
    category: 'Anniversary',
    styleTag: 'Prestige Silver',
    gradientTheme: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#cbd5e1]',
    gradientColors: ['#1e1b4b', '#312e81', '#cbd5e1'],
    description: 'Peringatan pesta perak 25 tahun pernikahan dan ikrar janji setia dalam kehangatan keluarga besar.',
    svgAsset: '/assets/templates/elegant-white.svg',
    sampleHosts: 'Silver Anniversary: Ir. Hartanto & Maria Fransisca',
    sampleDate: 'Sabtu, 28 November 2026',
    sampleVenue: 'Four Seasons Hotel Grand Ballroom, Jakarta',
    sampleOpening: '25 Tahun Merajut Kasih dalam Suka dan Duka. Merupakan kehormatan bagi kami untuk berbagi syukur bersama Anda.',
    sampleQuote: 'A successful marriage requires falling in love many times, always with the same person.',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1519225429712-421b9ec76fbe?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    accentColor: '#cbd5e1',
    patternType: 'ballroom',
  },
  {
    id: 'tmpl_graduation',
    title: 'Graduation & Milestone Award',
    category: 'Graduation',
    styleTag: 'Academic Prestigious',
    gradientTheme: 'bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#fbbf24]',
    gradientColors: ['#0f172a', '#1e3a8a', '#fbbf24'],
    description: 'Perayaan wisuda sarjana, doktoral, dan capaian karir prestisius dengan pita emas toga dan confetti kehormatan.',
    svgAsset: '/assets/templates/corporate-summit.svg',
    sampleHosts: 'Graduation Gala: dr. Nabila Sarah, Sp.OG',
    sampleDate: 'Sabtu, 03 Oktober 2026',
    sampleVenue: 'The Hermitage Tribute Ballroom, Menteng',
    sampleOpening: 'Mengucap syukur atas diraihnya gelar Spesialis Obstetri & Ginekologi Fakultas Kedokteran Universitas Indonesia.',
    sampleQuote: 'Education is the most powerful weapon which you can use to change the world.',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    accentColor: '#fbbf24',
    patternType: 'corporate',
  },
  {
    id: 'tmpl_kids_adventure',
    title: 'Kids Wonderland & Fun Fest',
    category: 'Kids',
    styleTag: 'Playful Safari',
    gradientTheme: 'bg-gradient-to-br from-[#065f46] via-[#047857] to-[#facc15]',
    gradientColors: ['#065f46', '#047857', '#facc15'],
    description: 'Pesta ulang tahun anak penuh keceriaan binatang lucu, balon warna-warni, wahana bermain, dan petualangan ceria.',
    svgAsset: '/assets/templates/birthday-pop.svg',
    sampleHosts: 'Kenzo’s 5th Wild Safari Adventure!',
    sampleDate: 'Minggu, 13 Desember 2026',
    sampleVenue: 'Tribeca Park Central Park Mall, Jakarta',
    sampleOpening: 'Roar! Join us for an unforgettable safari celebration packed with magic shows, face painting, and games!',
    sampleQuote: 'Let him be little, let him be wild, let him dream big.',
    defaultCoverPhoto: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    defaultCouplePhoto: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
    accentColor: '#facc15',
    patternType: 'festive',
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
