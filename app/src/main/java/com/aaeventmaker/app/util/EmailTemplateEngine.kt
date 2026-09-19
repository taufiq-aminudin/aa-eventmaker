package com.aaeventmaker.app.util

import com.aaeventmaker.app.data.*
import java.util.UUID

data class TemplateTag(
    val tag: String,
    val label: String,
    val sampleValue: String
)

object EmailTemplateEngine {

    val AVAILABLE_TAGS = listOf(
        TemplateTag("{{guest_name}}", "Nama Lengkap Tamu", "Budi Santoso"),
        TemplateTag("{{first_name}}", "Nama Depan Tamu", "Budi"),
        TemplateTag("{{pax}}", "Jumlah Kuota Tamu", "2"),
        TemplateTag("{{table_number}}", "Nomor Meja Tamu", "Table 05"),
        TemplateTag("{{group}}", "Kategori Tamu", "VIP"),
        TemplateTag("{{check_in_code}}", "Kode Unik E-Pass", "AA-F3B8C1"),
        TemplateTag("{{check_in_url}}", "Tautan Check-In Personal", "https://aaeventmaker.app/events/andi-ayu-wedding/checkin?code=AA-F3B8C1"),
        TemplateTag("{{rsvp_status}}", "Status RSVP Saat Ini", "Pending"),
        TemplateTag("{{event_title}}", "Judul Acara", "Pernikahan Andi & Ayu"),
        TemplateTag("{{hosts}}", "Mempelai / Tuan Rumah", "Andi & Ayu"),
        TemplateTag("{{event_date}}", "Tanggal Acara", "24 Oktober 2026"),
        TemplateTag("{{event_time}}", "Waktu Acara", "18:30"),
        TemplateTag("{{venue}}", "Nama Gedung / Tempat", "Grand Ballroom Hotel Indonesia Kempinski"),
        TemplateTag("{{address}}", "Alamat Lengkap Venue", "Jl. M.H. Thamrin No. 1, Jakarta Pusat")
    )

    val DEFAULT_TEMPLATES = listOf(
        EmailTemplate(
            id = "tmpl_formal_invitation",
            name = "Undangan Resmi & E-Pass",
            category = EmailTemplateCategory.INVITATION,
            subject = "Undangan Pernikahan: {{event_title}} - {{guest_name}}",
            body = """Kepada Yth.
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
{{hosts}}""".trimIndent(),
            isDefault = true
        ),
        EmailTemplate(
            id = "tmpl_rsvp_reminder",
            name = "Pengingat Konfirmasi RSVP (H-7 / H-3)",
            category = EmailTemplateCategory.RSVP_REMINDER,
            subject = "Pengingat Konfirmasi Kehadiran: {{event_title}} ({{guest_name}})",
            body = """Halo {{first_name}},

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

Jika Anda memiliki kebutuhan diet khusus atau pertanyaan seputar lokasi, silakan balas email ini.

Terima kasih banyak atas perhatiannya,
{{hosts}}""".trimIndent(),
            isDefault = true
        ),
        EmailTemplate(
            id = "tmpl_venue_guide",
            name = "Panduan Hari-H & E-Pass Resepsionis",
            category = EmailTemplateCategory.VENUE_GUIDE,
            subject = "E-Pass Registrasi & Petunjuk Arah: {{event_title}} (Meja {{table_number}})",
            body = """Kepada Yth. {{guest_name}},

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
{{hosts}}""".trimIndent(),
            isDefault = true
        ),
        EmailTemplate(
            id = "tmpl_thank_you",
            name = "Ucapan Terima Kasih Pasca Acara",
            category = EmailTemplateCategory.THANK_YOU,
            subject = "Terima Kasih atas Kehadiran & Doa Restu Anda di {{event_title}}",
            body = """Kepada Yth. Bapak/Ibu/Saudara/i {{guest_name}},

Dari lubuk hati yang terdalam, kami sekeluarga mengucapkan terima kasih yang sebesar-besarnya atas kehadiran, doa restu yang tulus, serta bingkisan dan perhatian manis yang telah Anda berikan pada acara {{event_title}}.

Momen bahagia kami terasa begitu sempurna dan hangat berkat kehadiran Anda.

Semoga tali silaturahmi kita selalu terjaga dan keberkahan senantiasa melimpahi Anda beserta seluruh keluarga tercinta.

Salam hormat dan penuh rasa syukur,
{{hosts}}""".trimIndent(),
            isDefault = true
        )
    )

    fun render(
        text: String,
        guest: Guest,
        invitation: InvitationData,
        project: EventProject? = null
    ): String {
        val firstName = guest.name.trim().split(" ").firstOrNull() ?: guest.name
        val checkInUrl = guest.getCheckInUrl(invitation.slug)
        val eventTitle = invitation.title.ifBlank { project?.name ?: "Pernikahan Andi & Ayu" }
        val hosts = invitation.hosts.ifBlank { "Andi & Ayu" }
        val eventDate = invitation.date.ifBlank { project?.date ?: "24 Oktober 2026" }
        val eventTime = invitation.time.ifBlank { project?.time ?: "18:30" }
        val venue = invitation.venue.ifBlank { project?.location ?: "Grand Ballroom Kempinski" }
        val address = invitation.address.ifBlank { "Jl. M.H. Thamrin No. 1, Jakarta" }

        var result = text
            .replace("{{guest_name}}", guest.name)
            .replace("{{first_name}}", firstName)
            .replace("{{pax}}", guest.pax.toString())
            .replace("{{table_number}}", guest.tableNumber)
            .replace("{{group}}", guest.group)
            .replace("{{check_in_code}}", guest.checkInCode)
            .replace("{{check_in_url}}", checkInUrl)
            .replace("{{rsvp_status}}", guest.rsvpStatus)
            .replace("{{event_title}}", eventTitle)
            .replace("{{hosts}}", hosts)
            .replace("{{event_date}}", eventDate)
            .replace("{{event_time}}", eventTime)
            .replace("{{venue}}", venue)
            .replace("{{address}}", address)

        return result
    }

    fun filterRecipients(target: CampaignTarget, guests: List<Guest>): List<Guest> {
        return when (target) {
            CampaignTarget.ALL -> guests
            CampaignTarget.PENDING_RSVP -> guests.filter {
                it.rsvpStatus.equals("Pending", ignoreCase = true) ||
                        it.rsvpStatus.equals("Maybe", ignoreCase = true)
            }
            CampaignTarget.CONFIRMED_RSVP -> guests.filter {
                it.rsvpStatus.equals("Confirmed", ignoreCase = true)
            }
            CampaignTarget.VIP_FAMILY -> guests.filter {
                it.group.equals("VIP", ignoreCase = true) ||
                        it.group.equals("Family", ignoreCase = true)
            }
        }
    }
}
