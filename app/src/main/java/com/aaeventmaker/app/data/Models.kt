package com.aaeventmaker.app.data

import java.util.UUID

enum class EventType(val displayName: String) {
    WEDDING("Wedding"),
    BIRTHDAY("Birthday"),
    CORPORATE("Corporate"),
    BABY("Baby Shower"),
    GRADUATION("Graduation"),
    CUSTOM("Custom Event")
}

data class EventProject(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val type: EventType = EventType.WEDDING,
    val date: String,
    val time: String,
    val location: String,
    val status: String = "Planning",
    val notes: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

data class InvitationData(
    val id: String = UUID.randomUUID().toString(),
    val projectId: String,
    val title: String,
    val hosts: String = "Andi & Ayu",
    val opening: String = "Together with our families, we invite you to celebrate our special moment.",
    val date: String,
    val time: String,
    val venue: String,
    val address: String,
    val slug: String,
    val templateName: String = "Golden Night",
    val isPublished: Boolean = true,
    val views: Int = 142
)

data class Guest(
    val id: String = UUID.randomUUID().toString(),
    val projectId: String,
    val name: String,
    val group: String = "General",
    val pax: Int = 2,
    val phone: String = "",
    val email: String = "",
    val tableNumber: String = "VIP 01",
    val rsvpStatus: String = "Pending", // Pending, Confirmed, Declined, Maybe
    val isCheckedIn: Boolean = false,
    val checkInTime: String? = null,
    val checkInCode: String = generateUniqueCheckInCode(id)
) {
    fun getCheckInUrl(eventSlug: String = "andi-ayu-wedding"): String {
        return "https://aaeventmaker.app/events/$eventSlug/checkin?code=$checkInCode&id=$id"
    }

    companion object {
        fun generateUniqueCheckInCode(id: String): String {
            val hash = Math.abs(id.hashCode() xor 0x5A5A5A).toString(36).uppercase()
            val padded = hash.padStart(6, 'X').takeLast(6)
            return "AA-$padded"
        }
    }
}

data class TaskItem(
    val id: String = UUID.randomUUID().toString(),
    val projectId: String,
    val title: String,
    val category: String = "General",
    val dueDate: String,
    val assignee: String = "Unassigned",
    val isCompleted: Boolean = false
)

data class BudgetItem(
    val id: String = UUID.randomUUID().toString(),
    val projectId: String,
    val category: String,
    val plannedAmount: Long,
    val actualAmount: Long,
    val notes: String = ""
)

data class VenueLocation(
    val id: String = UUID.randomUUID().toString(),
    val projectId: String,
    val name: String,
    val type: String, // "Akad Nikah / Ceremony", "Resepsi / Reception"
    val address: String,
    val time: String,
    val mapUrl: String = ""
)

data class InspirationItem(
    val id: String,
    val title: String,
    val category: String, // Dresses, Flowers, Rings, Invitations, Cakes, Decor
    val description: String,
    val gradientColors: List<Long>,
    val drawableRes: Int? = null
)

data class VideoSceneBeat(
    val timestamp: String,
    val action: String,
    val shotType: String,
    val transition: String
)

data class VideoTemplateItem(
    val id: String,
    val title: String,
    val format: String,
    val duration: String,
    val bpm: String,
    val musicStyle: String,
    val description: String,
    val drawableRes: Int,
    val sceneBeats: List<VideoSceneBeat>,
    val cameraGear: String,
    val colorLut: String
)

data class PhotoPresetItem(
    val id: String,
    val name: String,
    val toneTag: String,
    val temp: String,
    val tint: String,
    val exposure: String,
    val contrast: String,
    val highlights: String,
    val shadows: String,
    val tintColorHex: Long,
    val tintAlpha: Float,
    val description: String
)

data class MemoryItem(
    val id: String = UUID.randomUUID().toString(),
    val projectId: String,
    val guestName: String,
    val message: String,
    val timestamp: String,
    val photoCount: Int = 1
)

data class TemplateItem(
    val id: String,
    val title: String,
    val category: String,
    val styleTag: String,
    val gradientColors: List<Long>,
    val description: String
)

enum class EmailTemplateCategory(val displayName: String) {
    INVITATION("Undangan Resmi"),
    RSVP_REMINDER("Pengingat RSVP"),
    VENUE_GUIDE("Panduan Hari-H & E-Pass"),
    THANK_YOU("Ucapan Terima Kasih")
}

data class EmailTemplate(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val category: EmailTemplateCategory,
    val subject: String,
    val body: String,
    val isDefault: Boolean = false,
    val updatedAt: Long = System.currentTimeMillis()
)

enum class CampaignTarget(val displayName: String, val description: String) {
    ALL("Semua Tamu", "Kirim ke seluruh daftar tamu terdaftar"),
    PENDING_RSVP("Belum Konfirmasi RSVP", "Tamu dengan status 'Pending' atau 'Maybe'"),
    CONFIRMED_RSVP("Sudah Konfirmasi Hadir", "Tamu yang sudah konfirmasi 'Confirmed'"),
    VIP_FAMILY("Tamu VIP & Keluarga", "Tamu dalam kelompok VIP dan Keluarga")
}

enum class ScheduleTiming(val displayName: String, val offsetLabel: String) {
    IMMEDIATE("Kirim Sekarang (Direct Dispatch)", "Sekarang"),
    H_MINUS_7("H-7 Sebelum Acara", "7 hari sebelum acara (Pagi)"),
    H_MINUS_3("H-3 Sebelum Acara", "3 hari sebelum acara (Siang)"),
    H_MINUS_1("H-1 Menjelang Acara", "1 hari sebelum acara (08:00 WIB)"),
    CUSTOM("Jadwal Tanggal & Jam Khusus", "Pilih tanggal & jam khusus")
}

enum class CampaignStatus(val displayName: String) {
    DRAFT("Draf"),
    SCHEDULED("Terjadwal"),
    SENT("Terkirim")
}

data class EmailScheduleCampaign(
    val id: String = UUID.randomUUID().toString(),
    val projectId: String,
    val title: String,
    val templateId: String,
    val subject: String,
    val bodyTemplate: String,
    val target: CampaignTarget,
    val scheduleTiming: ScheduleTiming,
    val scheduledTimeDisplay: String,
    val status: CampaignStatus = CampaignStatus.DRAFT,
    val recipientCount: Int = 0,
    val sentAt: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)

data class AutoReminderRule(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val timing: ScheduleTiming,
    val scheduledTimeDisplay: String,
    val isEnabled: Boolean = true,
    val lastTriggered: String? = null,
    val totalDispatched: Int = 0
)

data class AutoReminderLog(
    val id: String = UUID.randomUUID().toString(),
    val timestamp: String,
    val recipientCount: Int,
    val recipientNames: List<String>,
    val triggerSource: String,
    val summary: String = ""
)

data class AutoRsvpSchedulerConfig(
    val projectId: String,
    val isEnabled: Boolean = true,
    val rules: List<AutoReminderRule> = emptyList(),
    val emailSubject: String = "Pengingat Konfirmasi RSVP: {{event_title}} ({{guest_name}})",
    val emailBody: String = """Halo {{first_name}},

Mengingat hari bahagia {{event_title}} semakin dekat pada {{event_date}} di {{venue}}, kami mencatat bahwa Anda belum mengonfirmasi kehadiran.

Mohon bantu kami mempersiapkan jamuan terbaik dengan mengonfirmasi kehadiran Anda melalui tautan RSVP personal berikut:
{{check_in_url}}

Detail Undangan:
- Kuota: {{pax}} Pax • Meja: {{table_number}}
- Kode E-Pass: {{check_in_code}}

Konfirmasi kehadiran Anda sangat berarti bagi kelancaran acara kami. Terima kasih banyak!

Salam hangat,
{{hosts}}""".trimIndent(),
    val lastTriggeredTime: String? = null,
    val totalRemindersSent: Int = 0,
    val logs: List<AutoReminderLog> = emptyList()
)

