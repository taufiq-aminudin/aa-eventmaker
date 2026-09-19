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
    val checkInTime: String? = null
)

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
    val gradientColors: List<Long>
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
