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
