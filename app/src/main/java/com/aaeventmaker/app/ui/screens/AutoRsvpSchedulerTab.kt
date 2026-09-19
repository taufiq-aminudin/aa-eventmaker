package com.aaeventmaker.app.ui.screens

import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aaeventmaker.app.data.*
import com.aaeventmaker.app.ui.theme.*
import com.aaeventmaker.app.util.EmailTemplateEngine

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AutoRsvpSchedulerTab(
    guests: List<Guest>,
    invitation: InvitationData,
    project: EventProject?,
    onViewHistory: () -> Unit = {}
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    val autoRsvpConfig by EventRepository.autoRsvpConfig.collectAsState()

    // Filter guests who haven't responded yet
    val pendingGuests = remember(guests) {
        guests.filter {
            it.rsvpStatus.equals("Pending", ignoreCase = true) ||
            it.rsvpStatus.equals("Maybe", ignoreCase = true) ||
            it.rsvpStatus.isBlank()
        }
    }

    var emailSubject by remember(autoRsvpConfig.emailSubject) { mutableStateOf(autoRsvpConfig.emailSubject) }
    var emailBody by remember(autoRsvpConfig.emailBody) { mutableStateOf(autoRsvpConfig.emailBody) }

    var selectedPreviewGuest by remember(pendingGuests) {
        mutableStateOf(pendingGuests.firstOrNull() ?: guests.firstOrNull())
    }

    var showConfirmTriggerDialog by remember { mutableStateOf(false) }
    var showAddRuleDialog by remember { mutableStateOf(false) }
    var showLogsDialog by remember { mutableStateOf(false) }

    // Dialog state for adding a custom schedule rule
    var newRuleTitle by remember { mutableStateOf("") }
    var newRuleTiming by remember { mutableStateOf(ScheduleTiming.CUSTOM) }
    var newRuleDateDisplay by remember { mutableStateOf("22 Okt 2026, 10:00 WIB") }

    val renderedSubject = remember(emailSubject, selectedPreviewGuest, invitation) {
        if (selectedPreviewGuest != null) {
            EmailTemplateEngine.render(emailSubject, selectedPreviewGuest!!, invitation, project)
        } else emailSubject
    }

    val renderedBody = remember(emailBody, selectedPreviewGuest, invitation) {
        if (selectedPreviewGuest != null) {
            EmailTemplateEngine.render(emailBody, selectedPreviewGuest!!, invitation, project)
        } else emailBody
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Section 1: Automation Master Controller Card
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (autoRsvpConfig.isEnabled) Color(0xFFF3E8FF) else Color(0xFFF1F5F9)
                ),
                border = BorderStroke(
                    1.5.dp,
                    if (autoRsvpConfig.isEnabled) PurplePrimary else Color(0xFFCBD5E1)
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Surface(
                                shape = CircleShape,
                                color = if (autoRsvpConfig.isEnabled) PurplePrimary else Color(0xFF94A3B8)
                            ) {
                                Icon(
                                    Icons.Default.Bolt,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier
                                        .padding(8.dp)
                                        .size(20.dp)
                                )
                            }
                            Column {
                                Text(
                                    "Auto-Scheduler Pengingat RSVP",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = InkDark
                                )
                                Text(
                                    if (autoRsvpConfig.isEnabled) "Otomatisasi Aktif • Nudge otomatis berjalan"
                                    else "Otomatisasi Dijeda",
                                    fontSize = 12.sp,
                                    color = if (autoRsvpConfig.isEnabled) PurplePrimary else MutedText,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }

                        Switch(
                            checked = autoRsvpConfig.isEnabled,
                            onCheckedChange = { isChecked ->
                                EventRepository.toggleAutoRsvpScheduler(isChecked)
                                Toast.makeText(
                                    context,
                                    if (isChecked) "Otomatisasi pengingat RSVP diaktifkan!" else "Otomatisasi pengingat dinonaktifkan",
                                    Toast.LENGTH_SHORT
                                ).show()
                            },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color.White,
                                checkedTrackColor = PurplePrimary
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        "Sistem cerdas memindai tamu berstatus 'Pending' atau 'Maybe' dan secara otomatis mengirim email pengingat RSVP berseri (H-7, H-3, H-1) hingga mereka mengonfirmasi.",
                        style = MaterialTheme.typography.bodySmall,
                        color = InkDark.copy(alpha = 0.85f),
                        lineHeight = 17.sp
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color.White.copy(alpha = 0.8f)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(Icons.Default.Schedule, contentDescription = null, tint = PurplePrimary, modifier = Modifier.size(14.dp))
                                Text(
                                    "Terakhir: ${autoRsvpConfig.lastTriggeredTime ?: "Belum pernah"}",
                                    fontSize = 11.sp,
                                    color = InkDark,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }

                        if (autoRsvpConfig.logs.isNotEmpty()) {
                            TextButton(
                                onClick = { showLogsDialog = true },
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 0.dp)
                            ) {
                                Icon(Icons.Default.History, contentDescription = null, modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Log Eksekusi (${autoRsvpConfig.logs.size})", fontSize = 11.sp)
                            }
                        }
                    }
                }
            }
        }

        // Section 2: Unresponded Guests Live Cohort Banner
        item {
            Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                Icons.Default.NotificationsActive,
                                contentDescription = null,
                                tint = Color(0xFFD97706),
                                modifier = Modifier.size(18.dp)
                            )
                            Text(
                                "Tamu Belum Konfirmasi (${pendingGuests.size} Orang)",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = InkDark
                            )
                        }

                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (pendingGuests.isNotEmpty()) Color(0xFFFEF3C7) else Color(0xFFDCFCE7)
                        ) {
                            Text(
                                text = if (pendingGuests.isNotEmpty()) "${pendingGuests.size} Menunggu Respon" else "Semua Sudah Respon!",
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (pendingGuests.isNotEmpty()) Color(0xFF92400E) else Color(0xFF166534)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        "Begitu tamu merespon 'Confirmed' atau 'Declined', sistem secara otomatis mengeluarkan mereka dari antrean trigger berikutnya.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MutedText,
                        fontSize = 11.sp
                    )

                    if (pendingGuests.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(10.dp))
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            items(pendingGuests) { guest ->
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = Color(0xFFFFFBEB),
                                    border = BorderStroke(1.dp, Color(0xFFFDE68A))
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 5.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Column {
                                            Text(
                                                guest.name,
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 11.sp,
                                                color = InkDark
                                            )
                                            Text(
                                                "${guest.group} • ${guest.rsvpStatus}",
                                                fontSize = 9.sp,
                                                color = Color(0xFFB45309)
                                            )
                                        }

                                        IconButton(
                                            onClick = {
                                                EventRepository.sendSingleRsvpReminder(guest.id)
                                                Toast.makeText(context, "Pengingat personal dikirim ke ${guest.name}!", Toast.LENGTH_SHORT).show()
                                            },
                                            modifier = Modifier.size(24.dp)
                                        ) {
                                            Icon(
                                                Icons.AutoMirrored.Filled.Send,
                                                contentDescription = "Nudge Guest",
                                                tint = Color(0xFFD97706),
                                                modifier = Modifier.size(13.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Section 3: Scheduled Trigger Cadence Rules
        item {
            Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(Icons.Default.Schedule, contentDescription = null, tint = PurplePrimary, modifier = Modifier.size(18.dp))
                            Text("Jadwal Milestone Pengingat", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = InkDark)
                        }

                        IconButton(
                            onClick = { showAddRuleDialog = true },
                            modifier = Modifier.size(28.dp)
                        ) {
                            Icon(Icons.Default.AddCircleOutline, contentDescription = "Tambah Jadwal", tint = PurplePrimary)
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        autoRsvpConfig.rules.forEach { rule ->
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = if (rule.isEnabled) Color(0xFFFAF5FF) else Color(0xFFF8FAFC),
                                border = BorderStroke(
                                    1.dp,
                                    if (rule.isEnabled) PurpleLight else Color(0xFFE2E8F0)
                                ),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Surface(
                                            shape = RoundedCornerShape(6.dp),
                                            color = if (rule.isEnabled) PurplePrimary else Color(0xFF94A3B8)
                                        ) {
                                            Text(
                                                text = when (rule.timing) {
                                                    ScheduleTiming.H_MINUS_7 -> "H-7"
                                                    ScheduleTiming.H_MINUS_3 -> "H-3"
                                                    ScheduleTiming.H_MINUS_1 -> "H-1"
                                                    else -> "CUSTOM"
                                                },
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                                color = Color.White,
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }

                                        Column {
                                            Text(
                                                rule.title,
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 12.sp,
                                                color = if (rule.isEnabled) InkDark else MutedText
                                            )
                                            Text(
                                                rule.scheduledTimeDisplay,
                                                fontSize = 11.sp,
                                                color = MutedText
                                            )
                                        }
                                    }

                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Switch(
                                            checked = rule.isEnabled,
                                            onCheckedChange = { checked ->
                                                EventRepository.toggleAutoReminderRule(rule.id, checked)
                                            },
                                            modifier = Modifier.scale(0.85f),
                                            colors = SwitchDefaults.colors(
                                                checkedThumbColor = Color.White,
                                                checkedTrackColor = PurplePrimary
                                            )
                                        )

                                        if (rule.timing == ScheduleTiming.CUSTOM) {
                                            IconButton(
                                                onClick = { EventRepository.deleteAutoReminderRule(rule.id) },
                                                modifier = Modifier.size(28.dp)
                                            ) {
                                                Icon(Icons.Default.DeleteOutline, contentDescription = "Hapus", tint = Color(0xFFEF4444), modifier = Modifier.size(16.dp))
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Section 4: Email Reminder Template & Tags
        item {
            Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(Icons.Default.EditNote, contentDescription = null, tint = PurplePrimary, modifier = Modifier.size(18.dp))
                            Text("Pesan Pengingat RSVP Otomatis", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = InkDark)
                        }

                        TextButton(
                            onClick = {
                                EventRepository.updateAutoReminderTemplate(emailSubject, emailBody)
                                Toast.makeText(context, "Template pesan pengingat berhasil disimpan!", Toast.LENGTH_SHORT).show()
                            },
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 0.dp)
                        ) {
                            Icon(Icons.Default.Save, contentDescription = null, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Simpan Template", fontSize = 11.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Variable tags assist
                    Text("Sisipkan Tag Dinamis:", fontSize = 11.sp, color = MutedText, fontWeight = FontWeight.SemiBold)
                    Spacer(modifier = Modifier.height(4.dp))
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        items(listOf("{{guest_name}}", "{{first_name}}", "{{check_in_url}}", "{{pax}}", "{{table_number}}", "{{event_date}}", "{{venue}}")) { tag ->
                            AssistChip(
                                onClick = {
                                    emailBody = "$emailBody $tag"
                                    Toast.makeText(context, "$tag disisipkan ke isi pesan!", Toast.LENGTH_SHORT).show()
                                },
                                label = { Text(tag, fontSize = 10.sp, fontFamily = FontFamily.Monospace) },
                                colors = AssistChipDefaults.assistChipColors(containerColor = Color(0xFFF1F5F9))
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = emailSubject,
                        onValueChange = { emailSubject = it },
                        label = { Text("Subjek Email Pengingat") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = emailBody,
                        onValueChange = { emailBody = it },
                        label = { Text("Isi Pesan Pengingat") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(min = 140.dp),
                        textStyle = MaterialTheme.typography.bodySmall.copy(fontSize = 12.sp)
                    )
                }
            }
        }

        // Section 5: Live Personalized Preview for Pending Guest
        item {
            Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF8FAFC)),
                border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(Icons.Default.Visibility, contentDescription = null, tint = PurplePrimary, modifier = Modifier.size(18.dp))
                            Text("Pratinjau Nyata Penerima:", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = InkDark)
                        }

                        if (selectedPreviewGuest != null) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = PurpleLight
                            ) {
                                Text(
                                    text = selectedPreviewGuest!!.name,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PurplePrimary
                                )
                            }
                        }
                    }

                    if (pendingGuests.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(6.dp))
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            items(pendingGuests) { g ->
                                val isSelected = g.id == selectedPreviewGuest?.id
                                SuggestionChip(
                                    onClick = { selectedPreviewGuest = g },
                                    label = { Text(g.name.take(15), fontSize = 10.sp) },
                                    colors = SuggestionChipDefaults.suggestionChipColors(
                                        containerColor = if (isSelected) PurplePrimary else Color.White,
                                        labelColor = if (isSelected) Color.White else InkDark
                                    )
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = Color.White,
                        border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text(
                                "Subjek: $renderedSubject",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = PurplePrimary
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Divider()
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = renderedBody,
                                fontSize = 11.sp,
                                lineHeight = 16.sp,
                                color = InkDark
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.End,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                OutlinedButton(
                                    onClick = {
                                        clipboardManager.setText(AnnotatedString("$renderedSubject\n\n$renderedBody"))
                                        Toast.makeText(context, "Isi pengingat disalin ke clipboard!", Toast.LENGTH_SHORT).show()
                                    },
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(13.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Salin", fontSize = 11.sp)
                                }

                                Spacer(modifier = Modifier.width(8.dp))

                                Button(
                                    onClick = {
                                        val recipientEmail = selectedPreviewGuest?.email?.ifBlank { "guest@example.com" } ?: "guest@example.com"
                                        val intent = Intent(Intent.ACTION_SENDTO).apply {
                                            data = Uri.parse("mailto:$recipientEmail")
                                            putExtra(Intent.EXTRA_SUBJECT, renderedSubject)
                                            putExtra(Intent.EXTRA_TEXT, renderedBody)
                                        }
                                        try {
                                            context.startActivity(Intent.createChooser(intent, "Kirim Pengingat"))
                                        } catch (e: Exception) {
                                            Toast.makeText(context, "Tidak ada aplikasi email terpasang", Toast.LENGTH_SHORT).show()
                                        }
                                    },
                                    shape = RoundedCornerShape(8.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Icon(Icons.AutoMirrored.Filled.Send, contentDescription = null, modifier = Modifier.size(13.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Buka di Gmail", fontSize = 11.sp)
                                }
                            }
                        }
                    }
                }
            }
        }

        // Section 6: Direct Execution Trigger CTA
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFAF5FF)),
                border = BorderStroke(1.5.dp, Color(0xFFD8B4FE)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        "Trigger Eksekusi Pengingat Sekarang",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = InkDark
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        "Kirimkan blast pengingat personal langsung kepada ${pendingGuests.size} tamu yang saat ini belum konfirmasi kehadiran.",
                        fontSize = 12.sp,
                        color = MutedText,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Button(
                        onClick = { showConfirmTriggerDialog = true },
                        enabled = pendingGuests.isNotEmpty(),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary),
                        contentPadding = PaddingValues(vertical = 12.dp)
                    ) {
                        Icon(Icons.Default.Bolt, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            if (pendingGuests.isNotEmpty()) "Jalankan Trigger (${pendingGuests.size} Tamu Pending)"
                            else "Tidak Ada Tamu Pending",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                    }
                }
            }
        }
    }

    // Confirmation Modal for Triggering Reminders
    if (showConfirmTriggerDialog) {
        AlertDialog(
            onDismissRequest = { showConfirmTriggerDialog = false },
            title = {
                Text("Konfirmasi Pengingat Otomatis", fontWeight = FontWeight.Bold)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        "Anda akan mengirimkan email pengingat RSVP kepada ${pendingGuests.size} tamu berikut:"
                    )
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFFF1F5F9),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(8.dp)) {
                            pendingGuests.forEach { g ->
                                Text(
                                    "• ${g.name} (${g.email.ifBlank { "guest@email.com" }})",
                                    fontSize = 12.sp,
                                    color = InkDark
                                )
                            }
                        }
                    }
                    Text(
                        "Setiap tamu akan menerima link check-in & reservasi personal unik mereka.",
                        fontSize = 11.sp,
                        color = MutedText
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showConfirmTriggerDialog = false
                        val (sentCount, names) = EventRepository.triggerPendingRsvpRemindersNow(
                            triggerSource = "Trigger Manual Planners"
                        )
                        Toast.makeText(
                            context,
                            "Pengingat RSVP berhasil dikirim ke $sentCount tamu: ${names.joinToString(", ")}",
                            Toast.LENGTH_LONG
                        ).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                ) {
                    Text("Kirim Sekarang")
                }
            },
            dismissButton = {
                TextButton(onClick = { showConfirmTriggerDialog = false }) {
                    Text("Batal")
                }
            }
        )
    }

    // Add Milestone Dialog
    if (showAddRuleDialog) {
        AlertDialog(
            onDismissRequest = { showAddRuleDialog = false },
            title = {
                Text("Tambah Milestone Pengingat", fontWeight = FontWeight.Bold)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = newRuleTitle,
                        onValueChange = { newRuleTitle = it },
                        label = { Text("Judul Milestone") },
                        placeholder = { Text("Contoh: Pengingat Khusus Meja VIP") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = newRuleDateDisplay,
                        onValueChange = { newRuleDateDisplay = it },
                        label = { Text("Jadwal Waktu Eksekusi") },
                        placeholder = { Text("Contoh: 22 Okt 2026, 10:00 WIB") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (newRuleTitle.isNotBlank()) {
                            val newRule = AutoReminderRule(
                                title = newRuleTitle,
                                timing = ScheduleTiming.CUSTOM,
                                scheduledTimeDisplay = newRuleDateDisplay,
                                isEnabled = true
                            )
                            EventRepository.addOrUpdateAutoReminderRule(newRule)
                            newRuleTitle = ""
                            showAddRuleDialog = false
                            Toast.makeText(context, "Milestone jadwal berhasil ditambahkan!", Toast.LENGTH_SHORT).show()
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                ) {
                    Text("Simpan")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddRuleDialog = false }) {
                    Text("Batal")
                }
            }
        )
    }

    // Execution Audit Logs Dialog
    if (showLogsDialog) {
        AlertDialog(
            onDismissRequest = { showLogsDialog = false },
            title = {
                Text("Log Eksekusi Pengingat Otomatis", fontWeight = FontWeight.Bold)
            },
            text = {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 300.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(autoRsvpConfig.logs) { logItem ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color(0xFFF8FAFC),
                            border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        logItem.triggerSource,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp,
                                        color = PurplePrimary
                                    )
                                    Text(
                                        logItem.timestamp,
                                        fontSize = 10.sp,
                                        color = MutedText
                                    )
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    logItem.summary.ifBlank { "Terkirim ke ${logItem.recipientCount} tamu" },
                                    fontSize = 11.sp,
                                    color = InkDark
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    "Penerima: ${logItem.recipientNames.joinToString(", ")}",
                                    fontSize = 10.sp,
                                    color = MutedText
                                )
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Button(onClick = { showLogsDialog = false }) {
                    Text("Tutup")
                }
            }
        )
    }
}

// Helper scale modifier extension if not available
private fun Modifier.scale(scale: Float): Modifier = this.then(
    Modifier.size((scale * 48).dp)
)
