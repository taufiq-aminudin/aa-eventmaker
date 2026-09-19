package com.aaeventmaker.app.data

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object EventRepository {

    private val initialProj = SampleData.createInitialProject()

    private val _projects = MutableStateFlow<List<EventProject>>(listOf(initialProj))
    val projects: StateFlow<List<EventProject>> = _projects.asStateFlow()

    private val _currentProject = MutableStateFlow<EventProject>(initialProj)
    val currentProject: StateFlow<EventProject> = _currentProject.asStateFlow()

    private val _invitation = MutableStateFlow<InvitationData>(SampleData.createInitialInvitation(initialProj.id))
    val invitation: StateFlow<InvitationData> = _invitation.asStateFlow()

    private val _guests = MutableStateFlow<List<Guest>>(SampleData.createInitialGuests(initialProj.id))
    val guests: StateFlow<List<Guest>> = _guests.asStateFlow()

    private val _tasks = MutableStateFlow<List<TaskItem>>(SampleData.createInitialTasks(initialProj.id))
    val tasks: StateFlow<List<TaskItem>> = _tasks.asStateFlow()

    private val _budgets = MutableStateFlow<List<BudgetItem>>(SampleData.createInitialBudgets(initialProj.id))
    val budgets: StateFlow<List<BudgetItem>> = _budgets.asStateFlow()

    private val _locations = MutableStateFlow<List<VenueLocation>>(SampleData.createInitialLocations(initialProj.id))
    val locations: StateFlow<List<VenueLocation>> = _locations.asStateFlow()

    private val _memories = MutableStateFlow<List<MemoryItem>>(SampleData.createInitialMemories(initialProj.id))
    val memories: StateFlow<List<MemoryItem>> = _memories.asStateFlow()

    // AI Creator state
    private val _aiDraftResult = MutableStateFlow<AiConceptResult?>(
        AiConceptResult(
            prompt = "Pernikahan adat Sunda modern tema taman malam elegan",
            themeTitle = "Royal Botanical Night",
            palette = listOf("Deep Emerald #14532D", "Rose Gold #F43F5E", "Ivory White #FFFBEB", "Champagne Gold #F59E0B"),
            typography = "Cormorant Garamond (Editorial Serif) + Plus Jakarta Sans (Clean Body)",
            copywriting = "Di bawah gemerlap bintang dan restu kedua orang tua, kami mengundang Anda untuk menjadi saksi pengikatan janji suci cinta kami.",
            photoDirection = "Golden hour outdoor framing, soft bokeh, signature silhouette dengan latar dedaunan botanical"
        )
    )
    val aiDraftResult: StateFlow<AiConceptResult?> = _aiDraftResult.asStateFlow()

    fun selectProject(project: EventProject) {
        _currentProject.value = project
    }

    fun createProject(name: String, type: EventType, date: String, time: String, location: String): EventProject {
        val newProj = EventProject(
            name = name,
            type = type,
            date = date,
            time = time,
            location = location
        )
        _projects.value = listOf(newProj) + _projects.value
        _currentProject.value = newProj

        // also update invitation default
        _invitation.value = _invitation.value.copy(
            projectId = newProj.id,
            title = name,
            date = date,
            time = time,
            venue = location,
            slug = name.lowercase().replace(" ", "-")
        )
        return newProj
    }

    fun updateProject(updated: EventProject) {
        _projects.value = _projects.value.map { if (it.id == updated.id) updated else it }
        if (_currentProject.value.id == updated.id) {
            _currentProject.value = updated
        }
    }

    fun updateInvitation(updated: InvitationData) {
        _invitation.value = updated
    }

    fun selectTemplate(templateName: String) {
        _invitation.value = _invitation.value.copy(templateName = templateName)
    }

    fun addGuest(name: String, group: String, pax: Int, phone: String, email: String, table: String): Guest {
        val newGuest = Guest(
            projectId = _currentProject.value.id,
            name = name,
            group = group,
            pax = pax,
            phone = phone,
            email = email,
            tableNumber = table,
            rsvpStatus = "Confirmed"
        )
        _guests.value = listOf(newGuest) + _guests.value
        return newGuest
    }

    fun updateGuest(updated: Guest) {
        _guests.value = _guests.value.map { if (it.id == updated.id) updated else it }
    }

    fun deleteGuest(guestId: String) {
        _guests.value = _guests.value.filterNot { it.id == guestId }
    }

    fun checkInGuest(guestId: String): Guest? {
        val guest = _guests.value.find { it.id == guestId } ?: return null
        val timeNow = SimpleDateFormat("HH:mm 'WIB'", Locale.getDefault()).format(Date())
        val updated = guest.copy(isCheckedIn = true, checkInTime = timeNow)
        _guests.value = _guests.value.map { if (it.id == guestId) updated else it }
        return updated
    }

    fun findGuestByCodeOrIdentifier(identifier: String): Guest? {
        val clean = identifier.trim()
        return _guests.value.find { g ->
            g.checkInCode.equals(clean, ignoreCase = true) ||
                    g.id.equals(clean, ignoreCase = true) ||
                    clean.contains("code=${g.checkInCode}", ignoreCase = true) ||
                    clean.contains("id=${g.id}", ignoreCase = true) ||
                    (clean.length >= 3 && g.name.contains(clean, ignoreCase = true)) ||
                    (g.phone.isNotBlank() && clean.contains(g.phone))
        }
    }

    fun checkInByQrPayload(payload: String): Pair<Boolean, String> {
        val guest = findGuestByCodeOrIdentifier(payload)
        return if (guest != null) {
            if (guest.isCheckedIn) {
                Pair(true, "${guest.name} sudah check-in sebelumnya (${guest.checkInTime}).")
            } else {
                checkInGuest(guest.id)
                Pair(true, "Berhasil Check-In: ${guest.name} (${guest.pax} Pax) • Meja: ${guest.tableNumber}")
            }
        } else {
            Pair(false, "QR Link / Kode Check-In tidak dikenali atau tamu tidak terdaftar.")
        }
    }

    fun submitRsvp(guestName: String, status: String, pax: Int, notes: String): Boolean {
        val existing = _guests.value.find { it.name.equals(guestName, ignoreCase = true) }
        if (existing != null) {
            _guests.value = _guests.value.map {
                if (it.id == existing.id) it.copy(rsvpStatus = status, pax = pax) else it
            }
        } else {
            val newGuest = Guest(
                projectId = _currentProject.value.id,
                name = guestName,
                group = "General",
                pax = pax,
                rsvpStatus = status
            )
            _guests.value = _guests.value + newGuest
        }
        if (notes.isNotBlank()) {
            addMemory(guestName, notes)
        }
        return true
    }

    fun addTask(title: String, category: String, dueDate: String, assignee: String) {
        val newTask = TaskItem(
            projectId = _currentProject.value.id,
            title = title,
            category = category,
            dueDate = dueDate,
            assignee = assignee
        )
        _tasks.value = _tasks.value + newTask
    }

    fun toggleTask(taskId: String) {
        _tasks.value = _tasks.value.map {
            if (it.id == taskId) it.copy(isCompleted = !it.isCompleted) else it
        }
    }

    fun deleteTask(taskId: String) {
        _tasks.value = _tasks.value.filterNot { it.id == taskId }
    }

    fun addBudgetItem(category: String, planned: Long, actual: Long, notes: String) {
        val item = BudgetItem(
            projectId = _currentProject.value.id,
            category = category,
            plannedAmount = planned,
            actualAmount = actual,
            notes = notes
        )
        _budgets.value = _budgets.value + item
    }

    fun updateBudgetItem(updated: BudgetItem) {
        _budgets.value = _budgets.value.map { if (it.id == updated.id) updated else it }
    }

    fun deleteBudgetItem(id: String) {
        _budgets.value = _budgets.value.filterNot { it.id == id }
    }

    fun addLocation(name: String, type: String, address: String, time: String, mapUrl: String) {
        val loc = VenueLocation(
            projectId = _currentProject.value.id,
            name = name,
            type = type,
            address = address,
            time = time,
            mapUrl = mapUrl
        )
        _locations.value = _locations.value + loc
    }

    fun addMemory(guestName: String, message: String) {
        val now = SimpleDateFormat("dd MMM yyyy, HH:mm", Locale.getDefault()).format(Date())
        val mem = MemoryItem(
            projectId = _currentProject.value.id,
            guestName = guestName,
            message = message,
            timestamp = now
        )
        _memories.value = listOf(mem) + _memories.value
    }

    fun generateAiConcept(prompt: String) {
        val cleanPrompt = if (prompt.isBlank()) "Pernikahan adat modern elegan" else prompt
        _aiDraftResult.value = AiConceptResult(
            prompt = cleanPrompt,
            themeTitle = "Concept: " + cleanPrompt.split(" ").take(3).joinToString(" ").replaceFirstChar { it.uppercase() },
            palette = listOf("Velvet Plum #4C1D95", "Blush Rose #EC4899", "Warm Ivory #FFFBEB", "Antique Gold #D97706"),
            typography = "Playfair Display (Display Serif) + Plus Jakarta Sans (Body)",
            copywriting = "Dengan penuh rasa syukur atas kebaikan Tuhan yang mempertemukan kami, kami mengundang kehadiran Bapak/Ibu/Saudara/i untuk melengkapi kebahagiaan kami.",
            photoDirection = "Soft cinematic portraiture, warm tungsten illumination, editorial framing dengan busana modern"
        )
    }
}

data class AiConceptResult(
    val prompt: String,
    val themeTitle: String,
    val palette: List<String>,
    val typography: String,
    val copywriting: String,
    val photoDirection: String
)
