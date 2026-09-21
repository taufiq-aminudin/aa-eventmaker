package com.aaeventmaker.app.data

import com.aaeventmaker.app.R

object SampleData {

    val TEMPLATES = listOf(
        TemplateItem(
            id = "tmpl_golden",
            title = "Golden Night",
            category = "Wedding",
            styleTag = "Luxury Gold",
            gradientColors = listOf(0xFF151515, 0xFF8B5E34, 0xFFE7C98B),
            description = "Elegansi malam dengan sentuhan kilau emas dan tipografi klasik"
        ),
        TemplateItem(
            id = "tmpl_sunda",
            title = "Sunda Halus",
            category = "Adat Heritage",
            styleTag = "Cultural Adat",
            gradientColors = listOf(0xFF1B3B2B, 0xFF4D7C0F, 0xFFD4AF37),
            description = "Nuansa lembut bernuansa hijau botani dan motif siger Sunda modern"
        ),
        TemplateItem(
            id = "tmpl_jawa",
            title = "Jawa Tengah & Solo",
            category = "Adat Heritage",
            styleTag = "Batik Royal",
            gradientColors = listOf(0xFF3B1E08, 0xFF78350F, 0xFFFBBF24),
            description = "Keagungan kraton dengan aksen prada emas dan motif batik parang"
        ),
        TemplateItem(
            id = "tmpl_bali",
            title = "Bali Ayu",
            category = "Adat Heritage",
            styleTag = "Tropical Royal",
            gradientColors = listOf(0xFF4C0519, 0xFF9F1239, 0xFFFACC15),
            description = "Harmoni bunga kamboja, ornamen ukir Bali dan warna tropis megah"
        ),
        TemplateItem(
            id = "tmpl_garden",
            title = "Garden Bloom",
            category = "Wedding",
            styleTag = "Romantic Floral",
            gradientColors = listOf(0xFF14532D, 0xFF86A86B, 0xFFE9D5B5),
            description = "Kesegaran pesta taman dengan hiasan dedaunan eucalyptus dan mawar"
        ),
        TemplateItem(
            id = "tmpl_minimal",
            title = "Minimal Motion",
            category = "Modern",
            styleTag = "Clean Editorial",
            gradientColors = listOf(0xFF0F172A, 0xFF312E81, 0xFFDB2777),
            description = "Desain modern kontemporer dengan tipografi sans-serif minimalis"
        ),
        TemplateItem(
            id = "tmpl_ballroom",
            title = "Ballroom Classic",
            category = "Wedding",
            styleTag = "Grand Luxury",
            gradientColors = listOf(0xFF1E1B4B, 0xFF4338CA, 0xFFFCD34D),
            description = "Gaya megah resepsi ballroom dengan lampu chandelier berkilau"
        ),
        TemplateItem(
            id = "tmpl_birthday",
            title = "Birthday Pop",
            category = "Birthday",
            styleTag = "Celebration",
            gradientColors = listOf(0xFF701A75, 0xFFC026D3, 0xFFF472B6),
            description = "Warna ceria penuh energi untuk perayaan ulang tahun meriah"
        ),
        TemplateItem(
            id = "tmpl_corporate",
            title = "Corporate Summit",
            category = "Corporate",
            styleTag = "Professional",
            gradientColors = listOf(0xFF1E293B, 0xFF334155, 0xFF0284C7),
            description = "Tema formal dan prestisius untuk seminar, summit, dan konferensi"
        )
    )

    val INSPIRATIONS = listOf(
        InspirationItem(
            id = "insp-1",
            title = "Fine Art Golden Hour Couple Portrait",
            category = "Dresses",
            description = "Potret pengantin modern dengan busana kebaya berpadu beskap kontemporer, pencahayaan alami golden hour hangat.",
            gradientColors = listOf(0xFF3B1E08, 0xFFB45309, 0xFFFDE68A),
            drawableRes = R.drawable.img_wedding_photo_template
        ),
        InspirationItem(
            id = "insp-2",
            title = "Rustic Modern Floral Stage & Arch",
            category = "Flowers",
            description = "Dekorasi pelaminan dedaunan eucalyptus aromatik, anggrek putih, mawar peach, dan pendar fairy lights romantis.",
            gradientColors = listOf(0xFF14532D, 0xFF16A34A, 0xFFBBF7D0),
            drawableRes = R.drawable.img_photo_decor_template
        ),
        InspirationItem(
            id = "insp-3",
            title = "Akrilik Welcome Signage & Calligraphy",
            category = "Design",
            description = "Papan selamat datang transparan dengan kaligrafi foil emas, easel kayu gelap dan rangkaian bunga segar.",
            gradientColors = listOf(0xFF78350F, 0xFFD97706, 0xFFFEF3C7),
            drawableRes = R.drawable.img_design_sign_template
        ),
        InspirationItem(
            id = "insp-4",
            title = "Gold & Diamond Solitaire",
            category = "Rings",
            description = "Pilihan cincin tunangan elegan bertahtakan berlian potongan brilliant dan ring box beludru mewah.",
            gradientColors = listOf(0xFF78350F, 0xFFD97706, 0xFFFEF3C7)
        ),
        InspirationItem(
            id = "insp-5",
            title = "Classic Tiered Naked Cake",
            category = "Cakes",
            description = "Kue pengantin 3 tingkat bertabur buah berry segar, edible flowers dan aksen lelehan salted caramel.",
            gradientColors = listOf(0xFF831843, 0xFFBE185D, 0xFFFCE7F3)
        ),
        InspirationItem(
            id = "insp-6",
            title = "Foil-Pressed Monogram Invitation",
            category = "Invitations",
            description = "Kertas bertekstur linen tebal dengan cetak foil emas timbul, ribbon sutra dan wax seal stempel cap lilin.",
            gradientColors = listOf(0xFF1E1B4B, 0xFF4F46E5, 0xFFC7D2FE)
        )
    )

    val PHOTO_PRESETS = listOf(
        PhotoPresetItem(
            id = "preset_warm_film",
            name = "Warm 35mm Film",
            toneTag = "Cinematic Grain",
            temp = "+12 (Warm)",
            tint = "+4 (Magenta)",
            exposure = "+0.25 EV",
            contrast = "+15",
            highlights = "-20",
            shadows = "+25",
            tintColorHex = 0x2CFFA726,
            tintAlpha = 0.14f,
            description = "Estetika analog bernuansa hangat dengan highlight halus dan kontras film klasik."
        ),
        PhotoPresetItem(
            id = "preset_golden_hour",
            name = "Golden Amber Glow",
            toneTag = "Sunset Mood",
            temp = "+22 (Golden)",
            tint = "+8",
            exposure = "+0.35 EV",
            contrast = "+20",
            highlights = "-35",
            shadows = "+30",
            tintColorHex = 0x33FFB300,
            tintAlpha = 0.20f,
            description = "Menonjolkan kilau emas senja dan warna kulit yang bercahaya alami (radiant glow)."
        ),
        PhotoPresetItem(
            id = "preset_clean_editorial",
            name = "Clean Editorial Pastel",
            toneTag = "Vogue & Harpers",
            temp = "-4 (Cool Clean)",
            tint = "+2",
            exposure = "+0.40 EV",
            contrast = "-5 (Soft)",
            highlights = "-15",
            shadows = "+40",
            tintColorHex = 0x1E81D4FA,
            tintAlpha = 0.08f,
            description = "Tone bersih modern dengan bayangan terang dan warna floral yang lembut natural."
        ),
        PhotoPresetItem(
            id = "preset_teal_orange",
            name = "Teal & Warm Bronze",
            toneTag = "Hollywood Drama",
            temp = "+6",
            tint = "-10 (Teal Shadows)",
            exposure = "+0.10 EV",
            contrast = "+30",
            highlights = "-40",
            shadows = "+10",
            tintColorHex = 0x2B00838F,
            tintAlpha = 0.16f,
            description = "Gradasi warna sinematik Hollywood kontras tinggi dengan bayangan teal dan kulit perunggu."
        ),
        PhotoPresetItem(
            id = "preset_monochrome_royal",
            name = "Royal B&W Timeless",
            toneTag = "Classic Monochrome",
            temp = "0",
            tint = "0",
            exposure = "+0.20 EV",
            contrast = "+45",
            highlights = "-10",
            shadows = "+15",
            tintColorHex = 0x55212121,
            tintAlpha = 0.45f,
            description = "Hitam putih sakral berkarakter mendalam yang menonjolkan emosi dan detail gaun."
        )
    )

    val VIDEO_TEMPLATES = listOf(
        VideoTemplateItem(
            id = "vid_reels_teaser",
            title = "Teaser Reels & TikTok 9:16",
            format = "9:16 Vertikal Fullscreen",
            duration = "30 Detik",
            bpm = "118 BPM",
            musicStyle = "Acoustic Pop Romance / Indie Strings",
            description = "Transisi cepat berirama beat musik, sangat cocok untuk teaser akad nikah, pamer kebaya, dan detail cincin.",
            drawableRes = R.drawable.img_video_reels_template,
            cameraGear = "Sony A7S III / Canon R5 + 50mm f/1.2 & Gimbal RS3",
            colorLut = "Warm Kodak Portra 400 LUT",
            sceneBeats = listOf(
                VideoSceneBeat("00:00 - 00:04", "Opening macro shot cincin nikah & sepatu pengantin", "Close Up / Macro", "Slow Zoom In"),
                VideoSceneBeat("00:04 - 00:10", "Bride makeup reveal & sentuhan paes adat Sunda", "Medium Shot", "Whip Pan Transition"),
                VideoSceneBeat("00:10 - 00:18", "First look & tatapan intim kedua mempelai di taman", "Over-The-Shoulder", "Lens Flare Burn"),
                VideoSceneBeat("00:18 - 00:25", "Momen sakral ijab qabul & senyum haru keluarga", "Slow Motion 60fps", "Smooth Crossfade"),
                VideoSceneBeat("00:25 - 00:30", "Jalan bersama di lorong lampu fairy lights & confetti", "Wide Tracking Shot", "Fade Out to Title")
            )
        ),
        VideoTemplateItem(
            id = "vid_cinematic_film",
            title = "Cinematic Wedding Highlight 16:9",
            format = "16:9 Widescreen Cinema",
            duration = "3 - 5 Menit",
            bpm = "75 - 90 BPM",
            musicStyle = "Cinematic Orchestral & Emotional Piano",
            description = "Dokumentasi sinematik bergaya film layar lebar yang merekam seluruh emosi prosesi dari akad hingga resepsi megah.",
            drawableRes = R.drawable.img_video_cinema_template,
            cameraGear = "FX3 / RED Komodo + Anamorphic 35mm & 85mm Prime",
            colorLut = "Arri Alexa Teal & Amber Cinema Grade",
            sceneBeats = listOf(
                VideoSceneBeat("00:00 - 00:45", "Suasana pagi venue, dedaunan berembun & dekorasi pelaminan", "Wide Establishing & Drone", "Ambient Fade"),
                VideoSceneBeat("00:45 - 01:30", "Prosesi sungkeman mohon restu orang tua penuh haru", "Low Angle Portrait", "Soft Dissolve"),
                VideoSceneBeat("01:30 - 02:45", "Ijab qabul dengan audio janji suci jernih tanpa noise", "Multi-Cam Two-Shot", "Beat-synced Cut"),
                VideoSceneBeat("02:45 - 04:15", "Grand entrance resepsi ballroom & dansa pertama (first dance)", "Gimbal 360 Rotation", "Light Leak Flare"),
                VideoSceneBeat("04:15 - 05:00", "Lempar buket bunga, kebersamaan sahabat & kembang api", "Slow Motion 120fps", "Cinematic Dip to Black")
            )
        )
    )

    fun createInitialProject(): EventProject {
        return EventProject(
            id = "project_default",
            name = "Andi & Ayu Wedding Celebration",
            type = EventType.WEDDING,
            date = "24 Oktober 2026",
            time = "10:00 - 15:00 WIB",
            location = "Grand Ballroom Plataran, Jakarta Selatan",
            status = "Planning",
            notes = "Tema: Golden Night & Tradisi Adat Sunda Modern"
        )
    }

    fun createInitialInvitation(projectId: String): InvitationData {
        return InvitationData(
            projectId = projectId,
            title = "The Wedding of Andi & Ayu",
            hosts = "Andi Pratama & Ayu Maharani",
            opening = "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon rahmat dan ridho-Nya, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri perayaan pernikahan kami.",
            date = "Sabtu, 24 Oktober 2026",
            time = "Akad: 08:00 WIB | Resepsi: 11:00 - 14:00 WIB",
            venue = "Grand Ballroom Plataran Dharmawangsa",
            address = "Jl. Dharmawangsa Raya No. 6, Kebayoran Baru, Jakarta Selatan",
            slug = "andi-ayu-wedding",
            templateName = "Golden Night",
            isPublished = true,
            views = 284
        )
    }

    fun createInitialGuests(projectId: String): List<Guest> {
        return listOf(
            Guest(
                projectId = projectId,
                name = "Bpk. Hendra Kusuma & Partner",
                group = "VIP",
                pax = 2,
                phone = "081382000412",
                email = "hendra.kusuma@gmail.com",
                tableNumber = "VIP 01",
                rsvpStatus = "Confirmed",
                isCheckedIn = true,
                checkInTime = "09:45 WIB"
            ),
            Guest(
                projectId = projectId,
                name = "Keluarga Besar Sastroamidjojo",
                group = "Family",
                pax = 4,
                phone = "081198765432",
                email = "sastro.family@yahoo.com",
                tableNumber = "Family 02",
                rsvpStatus = "Confirmed",
                isCheckedIn = false
            ),
            Guest(
                projectId = projectId,
                name = "Rizky Firmansyah",
                group = "Friend",
                pax = 1,
                phone = "085612344321",
                email = "rizky.f@gmail.com",
                tableNumber = "Table 05",
                rsvpStatus = "Confirmed",
                isCheckedIn = false
            ),
            Guest(
                projectId = projectId,
                name = "dr. Siti Nurhaliza, Sp.A",
                group = "Colleague",
                pax = 2,
                phone = "081377889900",
                email = "siti.nurhaliza@clinic.id",
                tableNumber = "Table 08",
                rsvpStatus = "Pending",
                isCheckedIn = false
            ),
            Guest(
                projectId = projectId,
                name = "Dimas Anggara & Istri",
                group = "Friend",
                pax = 2,
                phone = "087811223344",
                email = "dimas.anggara@corp.com",
                tableNumber = "Table 06",
                rsvpStatus = "Confirmed",
                isCheckedIn = false
            ),
            Guest(
                projectId = projectId,
                name = "Bambang Pamungkas",
                group = "General",
                pax = 1,
                phone = "082199887766",
                email = "bambang.p@outlook.com",
                tableNumber = "Table 11",
                rsvpStatus = "Maybe",
                isCheckedIn = false
            )
        )
    }

    fun createInitialTasks(projectId: String): List<TaskItem> {
        return listOf(
            TaskItem(
                projectId = projectId,
                title = "Finalisasi Dekorasi Pelaminan & Floral Arch",
                category = "Decoration",
                dueDate = "15 Okt 2026",
                assignee = "Ayu (Bride)",
                isCompleted = true
            ),
            TaskItem(
                projectId = projectId,
                title = "Fitting Terakhir Kebaya Akad & Jas Resepsi",
                category = "Wardrobe",
                dueDate = "18 Okt 2026",
                assignee = "Andi & Ayu",
                isCompleted = true
            ),
            TaskItem(
                projectId = projectId,
                title = "Kirim Undangan Digital E-Pass via WhatsApp",
                category = "Invitations",
                dueDate = "20 Okt 2026",
                assignee = "Tim Wedding Organizer",
                isCompleted = false
            ),
            TaskItem(
                projectId = projectId,
                title = "Technical Meeting dengan Venue & Vendor Katering",
                category = "Venue",
                dueDate = "22 Okt 2026",
                assignee = "WO & Keluarga",
                isCompleted = false
            ),
            TaskItem(
                projectId = projectId,
                title = "Briefing Resepsionis Check-In & Scanner QR",
                category = "Reception",
                dueDate = "23 Okt 2026",
                assignee = "Tim Resepsionis",
                isCompleted = false
            )
        )
    }

    fun createInitialBudgets(projectId: String): List<BudgetItem> {
        return listOf(
            BudgetItem(
                projectId = projectId,
                category = "Venue & Grand Ballroom",
                plannedAmount = 65000000L,
                actualAmount = 62500000L,
                notes = "Termasuk fasilitas AC, panggung, dan sound system utama"
            ),
            BudgetItem(
                projectId = projectId,
                category = "Katering (500 Pax)",
                plannedAmount = 75000000L,
                actualAmount = 72000000L,
                notes = "Buffet utama 6 menu + 4 gubukan dessert & kambing guling"
            ),
            BudgetItem(
                projectId = projectId,
                category = "Dekorasi & Pencahayaan",
                plannedAmount = 35000000L,
                actualAmount = 35000000L,
                notes = "Konsep Garden Elegance dengan instalasi lampu gantung"
            ),
            BudgetItem(
                projectId = projectId,
                category = "Foto & Video Sinematik",
                plannedAmount = 25000000L,
                actualAmount = 22000000L,
                notes = "Dokumentasi akad, resepsi, drone, dan live streaming"
            ),
            BudgetItem(
                projectId = projectId,
                category = "Busana & Rias Pengantin",
                plannedAmount = 20000000L,
                actualAmount = 19500000L,
                notes = "MUA pengantin 2 look, busana orang tua dan pagar ayu"
            ),
            BudgetItem(
                projectId = projectId,
                category = "Undangan Digital & Souvenir",
                plannedAmount = 10000000L,
                actualAmount = 8500000L,
                notes = "Platform AA Event Maker + custom souvenir pouch kulit"
            )
        )
    }

    fun createInitialLocations(projectId: String): List<VenueLocation> {
        return listOf(
            VenueLocation(
                projectId = projectId,
                name = "Masjid Agung Al-Azhar (Akad Nikah)",
                type = "Akad Nikah / Ceremony",
                address = "Jl. Sisingamangaraja No. 1, Selong, Kebayoran Baru, Jakarta Selatan",
                time = "08:00 - 10:00 WIB",
                mapUrl = "https://maps.google.com/?q=Masjid+Al+Azhar+Kebayoran"
            ),
            VenueLocation(
                projectId = projectId,
                name = "Plataran Dharmawangsa (Resepsi)",
                type = "Resepsi / Reception",
                address = "Jl. Dharmawangsa Raya No. 6, Pulo, Kebayoran Baru, Jakarta Selatan",
                time = "11:00 - 14:00 WIB",
                mapUrl = "https://maps.google.com/?q=Plataran+Dharmawangsa"
            )
        )
    }

    fun createInitialMemories(projectId: String): List<MemoryItem> {
        return listOf(
            MemoryItem(
                projectId = projectId,
                guestName = "Hendra & Keluarga",
                message = "Selamat menempuh hidup baru Andi & Ayu! Semoga selalu sakinah, mawaddah, warahmah.",
                timestamp = "24 Okt 2026, 11:30"
            ),
            MemoryItem(
                projectId = projectId,
                guestName = "dr. Siti Nurhaliza",
                message = "Barakallahu laka wa baraka 'alaika wa jama'a bainakuma fii khoir. Cantik dan gagah sekali!",
                timestamp = "24 Okt 2026, 12:15"
            ),
            MemoryItem(
                projectId = projectId,
                guestName = "Rizky & Kawan Sekampus",
                message = "Selamat brader Andi! Lancar sampai kakek nenek, jangan lupa traktir anak-anak!",
                timestamp = "24 Okt 2026, 13:00"
            )
        )
    }

    fun createInitialCampaigns(projectId: String): List<EmailScheduleCampaign> {
        return listOf(
            EmailScheduleCampaign(
                projectId = projectId,
                title = "Blast Undangan Resmi & E-Pass",
                templateId = "tmpl_formal_invitation",
                subject = "Undangan Pernikahan: {{event_title}} - {{guest_name}}",
                bodyTemplate = """Kepada Yth. Bapak/Ibu/Saudara/i {{guest_name}},

Dengan penuh rasa syukur, kami mengundang Anda untuk hadir pada acara {{event_title}} pada {{event_date}} di {{venue}}.

Detail Undangan:
- Kuota: {{pax}} Pax • Meja: {{table_number}}
- Kode E-Pass: {{check_in_code}}
- Tautan Check-In Personal: {{check_in_url}}

Salam hangat,
{{hosts}}""".trimIndent(),
                target = CampaignTarget.ALL,
                scheduleTiming = ScheduleTiming.H_MINUS_7,
                scheduledTimeDisplay = "17 Okt 2026, 09:00 WIB",
                status = CampaignStatus.SCHEDULED,
                recipientCount = 6
            ),
            EmailScheduleCampaign(
                projectId = projectId,
                title = "Pengingat Konfirmasi RSVP Final",
                templateId = "tmpl_rsvp_reminder",
                subject = "Pengingat Konfirmasi Kehadiran: {{event_title}} ({{guest_name}})",
                bodyTemplate = """Halo {{first_name}},

Mengingat hari bahagia {{event_title}} semakin dekat ({{event_date}} di {{venue}}), mohon konfirmasi kehadiran Anda melalui:
{{check_in_url}}

Terima kasih banyak,
{{hosts}}""".trimIndent(),
                target = CampaignTarget.PENDING_RSVP,
                scheduleTiming = ScheduleTiming.H_MINUS_3,
                scheduledTimeDisplay = "21 Okt 2026, 10:00 WIB",
                status = CampaignStatus.DRAFT,
                recipientCount = 2
            )
        )
    }

    fun createInitialAutoRsvpConfig(projectId: String): AutoRsvpSchedulerConfig {
        return AutoRsvpSchedulerConfig(
            projectId = projectId,
            isEnabled = true,
            rules = listOf(
                AutoReminderRule(
                    title = "Pengingat Pertama (H-7)",
                    timing = ScheduleTiming.H_MINUS_7,
                    scheduledTimeDisplay = "17 Okt 2026, 09:00 WIB (H-7)",
                    isEnabled = true,
                    lastTriggered = null,
                    totalDispatched = 0
                ),
                AutoReminderRule(
                    title = "Pengingat Intensif (H-3)",
                    timing = ScheduleTiming.H_MINUS_3,
                    scheduledTimeDisplay = "21 Okt 2026, 10:00 WIB (H-3)",
                    isEnabled = true,
                    lastTriggered = null,
                    totalDispatched = 0
                ),
                AutoReminderRule(
                    title = "Pengingat Final Katering (H-1)",
                    timing = ScheduleTiming.H_MINUS_1,
                    scheduledTimeDisplay = "23 Okt 2026, 08:00 WIB (H-1)",
                    isEnabled = false,
                    lastTriggered = null,
                    totalDispatched = 0
                )
            ),
            lastTriggeredTime = "12 Okt 2026, 14:30 WIB",
            totalRemindersSent = 4,
            logs = listOf(
                AutoReminderLog(
                    timestamp = "12 Okt 2026, 14:30 WIB",
                    recipientCount = 4,
                    recipientNames = listOf("dr. Siti Nurhaliza, Sp.A", "Bambang Pamungkas", "Rizky Firmansyah", "Dimas Anggara"),
                    triggerSource = "Simulasi Jadwal Awal",
                    summary = "Reminder blast berhasil dikirimkan ke 4 tamu pending"
                )
            )
        )
    }
}

