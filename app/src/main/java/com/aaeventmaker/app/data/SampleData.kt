package com.aaeventmaker.app.data

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
            title = "Minimalist Outdoor Sunset",
            category = "Dresses",
            description = "Inspirasi gaun pengantin simpel dengan konsep alam terbuka saat golden hour",
            gradientColors = listOf(0xFF3B1E08, 0xFFB45309, 0xFFFDE68A)
        ),
        InspirationItem(
            id = "insp-2",
            title = "Pernikahan Adat Sunda Modern",
            category = "Dresses",
            description = "Siger Sunda klasik berpadu dengan aksen kebaya modern berpayet lembut",
            gradientColors = listOf(0xFF134E4A, 0xFF0D9488, 0xFF99F6E4)
        ),
        InspirationItem(
            id = "insp-3",
            title = "Rustic Greenery Arch",
            category = "Flowers",
            description = "Dekorasi pelaminan dedaunan eucalyptus aromatik dan mawar putih segar",
            gradientColors = listOf(0xFF14532D, 0xFF16A34A, 0xFFBBF7D0)
        ),
        InspirationItem(
            id = "insp-4",
            title = "Gold & Diamond Solitaire",
            category = "Rings",
            description = "Pilihan cincin tunangan elegan bertahtakan berlian potongan brilliant",
            gradientColors = listOf(0xFF78350F, 0xFFD97706, 0xFFFEF3C7)
        ),
        InspirationItem(
            id = "insp-5",
            title = "Classic Tiered Naked Cake",
            category = "Cakes",
            description = "Kue pengantin 3 tingkat bertabur buah berry dan edible flowers",
            gradientColors = listOf(0xFF831843, 0xFFBE185D, 0xFFFCE7F3)
        ),
        InspirationItem(
            id = "insp-6",
            title = "Foil-Pressed Monogram Invitation",
            category = "Invitations",
            description = "Kertas bertekstur linen dengan cetak foil emas timbul dan segel lilin",
            gradientColors = listOf(0xFF1E1B4B, 0xFF4F46E5, 0xFFC7D2FE)
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
                phone = "081234567890",
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
}
