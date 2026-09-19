package com.aaeventmaker.app.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.aaeventmaker.app.data.*
import com.aaeventmaker.app.ui.theme.*
import com.aaeventmaker.app.util.EmailTemplateEngine
import com.aaeventmaker.app.util.TemplateTag

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GuestEmailCampaignDialog(
    guests: List<Guest>,
    invitation: InvitationData,
    project: EventProject?,
    initialGuest: Guest? = null,
    initialTab: Int = 0,
    onDismiss: () -> Unit
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    val allTemplates by EventRepository.emailTemplates.collectAsState()
    val allCampaigns by EventRepository.campaigns.collectAsState()

    var activeTab by remember { mutableStateOf(initialTab) } // 0: Auto RSVP Scheduler, 1: Draf & Template, 2: Jadwal Blast, 3: Kampanye Aktif

    // Current editing template state
    var selectedTemplate by remember { mutableStateOf(allTemplates.firstOrNull() ?: EmailTemplateEngine.DEFAULT_TEMPLATES.first()) }
    var campaignTitle by remember { mutableStateOf(selectedTemplate.name) }
    var emailSubject by remember { mutableStateOf(selectedTemplate.subject) }
    var emailBody by remember { mutableStateOf(selectedTemplate.body) }

    // Preview guest selection
    var previewGuest by remember { mutableStateOf(initialGuest ?: guests.firstOrNull() ?: Guest(projectId = "1", name = "Budi Santoso", pax = 2, tableNumber = "Table 05", group = "VIP")) }

    // Scheduling states
    var selectedTarget by remember { mutableStateOf(CampaignTarget.ALL) }
    var selectedTiming by remember { mutableStateOf(ScheduleTiming.H_MINUS_7) }
    var customTimeInput by remember { mutableStateOf("22 Okt 2026, 09:00 WIB") }
    var showPreviewCampaignDetail by remember { mutableStateOf<EmailScheduleCampaign?>(null) }

    // When template changes, load values
    LaunchedEffect(selectedTemplate.id) {
        campaignTitle = selectedTemplate.name
        emailSubject = selectedTemplate.subject
        emailBody = selectedTemplate.body
    }

    val targetRecipients = remember(selectedTarget, guests) {
        EmailTemplateEngine.filterRecipients(selectedTarget, guests)
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.96f)
                .fillMaxHeight(0.94f)
                .clip(RoundedCornerShape(24.dp)),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
            ) {
                // Top Dialog Bar
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = PurpleLight
                        ) {
                            Icon(
                                Icons.Default.Email,
                                contentDescription = null,
                                tint = PurplePrimary,
                                modifier = Modifier
                                    .padding(8.dp)
                                    .size(22.dp)
                            )
                        }
                        Column {
                            Text(
                                "Template Engine & Email Blast",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = InkDark
                            )
                            Text(
                                "Personalisasi Undangan & Pengingat RSVP Otomatis",
                                style = MaterialTheme.typography.bodySmall,
                                color = MutedText
                            )
                        }
                    }

                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Tutup", tint = MutedText)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Navigation Tabs
                TabRow(
                    selectedTabIndex = activeTab,
                    containerColor = Color(0xFFF1F5F9),
                    modifier = Modifier.clip(RoundedCornerShape(12.dp))
                ) {
                    Tab(
                        selected = activeTab == 0,
                        onClick = { activeTab = 0 },
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                Icon(Icons.Default.Bolt, contentDescription = null, modifier = Modifier.size(15.dp), tint = if (activeTab == 0) PurplePrimary else MutedText)
                                Text("Auto RSVP", fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                            }
                        }
                    )
                    Tab(
                        selected = activeTab == 1,
                        onClick = { activeTab = 1 },
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                Icon(Icons.Default.DesignServices, contentDescription = null, modifier = Modifier.size(15.dp))
                                Text("Template", fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                            }
                        }
                    )
                    Tab(
                        selected = activeTab == 2,
                        onClick = { activeTab = 2 },
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                Icon(Icons.Default.ScheduleSend, contentDescription = null, modifier = Modifier.size(15.dp))
                                Text("Jadwal Blast", fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                            }
                        }
                    )
                    Tab(
                        selected = activeTab == 3,
                        onClick = { activeTab = 3 },
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                Icon(Icons.Default.History, contentDescription = null, modifier = Modifier.size(15.dp))
                                Text("Riwayat (${allCampaigns.size})", fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                            }
                        }
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Tab Content
                Box(modifier = Modifier.weight(1f)) {
                    when (activeTab) {
                        0 -> AutoRsvpSchedulerTab(
                            guests = guests,
                            invitation = invitation,
                            project = project,
                            onViewHistory = { activeTab = 3 }
                        )

                        1 -> TemplateEditorTab(
                            templates = allTemplates,
                            selectedTemplate = selectedTemplate,
                            onSelectTemplate = { selectedTemplate = it },
                            campaignTitle = campaignTitle,
                            onTitleChange = { campaignTitle = it },
                            emailSubject = emailSubject,
                            onSubjectChange = { emailSubject = it },
                            emailBody = emailBody,
                            onBodyChange = { emailBody = it },
                            guests = guests,
                            previewGuest = previewGuest,
                            onSelectPreviewGuest = { previewGuest = it },
                            invitation = invitation,
                            project = project,
                            onSaveTemplate = {
                                val updated = selectedTemplate.copy(
                                    name = campaignTitle,
                                    subject = emailSubject,
                                    body = emailBody,
                                    updatedAt = System.currentTimeMillis()
                                )
                                EventRepository.saveEmailTemplate(updated)
                                Toast.makeText(context, "Template '${campaignTitle}' berhasil disimpan!", Toast.LENGTH_SHORT).show()
                            },
                            onProceedToSchedule = {
                                activeTab = 2
                            }
                        )

                        2 -> CampaignSchedulerTab(
                            guests = guests,
                            campaignTitle = campaignTitle,
                            emailSubject = emailSubject,
                            emailBody = emailBody,
                            selectedTemplate = selectedTemplate,
                            selectedTarget = selectedTarget,
                            onSelectTarget = { selectedTarget = it },
                            targetRecipients = targetRecipients,
                            selectedTiming = selectedTiming,
                            onSelectTiming = { selectedTiming = it },
                            customTimeInput = customTimeInput,
                            onCustomTimeChange = { customTimeInput = it },
                            invitation = invitation,
                            project = project,
                            onScheduleConfirmed = { isImmediate ->
                                val timing = if (isImmediate) ScheduleTiming.IMMEDIATE else selectedTiming
                                val newCampaign = EventRepository.scheduleCampaign(
                                    title = campaignTitle,
                                    templateId = selectedTemplate.id,
                                    subject = emailSubject,
                                    bodyTemplate = emailBody,
                                    target = selectedTarget,
                                    scheduleTiming = timing,
                                    customTimeDisplay = customTimeInput
                                )
                                Toast.makeText(
                                    context,
                                    if (isImmediate) "Email berhasil dikirim ke ${newCampaign.recipientCount} tamu!"
                                    else "Kampanye dijadwalkan untuk ${newCampaign.recipientCount} tamu!",
                                    Toast.LENGTH_LONG
                                ).show()
                                activeTab = 3
                            }
                        )

                        3 -> CampaignHistoryTab(
                            campaigns = allCampaigns,
                            onDispatchNow = { campaign ->
                                EventRepository.updateCampaignStatus(campaign.id, CampaignStatus.SENT)
                                Toast.makeText(context, "Email '${campaign.title}' telah dikirim ke ${campaign.recipientCount} penerima!", Toast.LENGTH_SHORT).show()
                            },
                            onDeleteCampaign = { campaignId ->
                                EventRepository.deleteCampaign(campaignId)
                                Toast.makeText(context, "Kampanye dihapus", Toast.LENGTH_SHORT).show()
                            },
                            onPreviewDetail = { campaign ->
                                showPreviewCampaignDetail = campaign
                            }
                        )
                    }
                }

            }
        }
    }

    // Detail Dialog for Campaign Preview
    if (showPreviewCampaignDetail != null) {
        val camp = showPreviewCampaignDetail!!
        val sampleGuest = guests.firstOrNull() ?: previewGuest
        val renderedPreview = EmailTemplateEngine.render(camp.bodyTemplate, sampleGuest, invitation, project)
        AlertDialog(
            onDismissRequest = { showPreviewCampaignDetail = null },
            title = {
                Column {
                    Text(camp.title, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                    Text("Target: ${camp.target.displayName} (${camp.recipientCount} Tamu)", style = MaterialTheme.typography.bodySmall, color = MutedText)
                }
            },
            text = {
                Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Subjek: ${camp.subject}", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                    Divider()
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFFF8FAFC),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = renderedPreview,
                            fontFamily = FontFamily.Monospace,
                            fontSize = 12.sp,
                            modifier = Modifier.padding(10.dp),
                            color = InkDark
                        )
                    }
                }
            },
            confirmButton = {
                Button(onClick = { showPreviewCampaignDetail = null }) {
                    Text("Tutup")
                }
            }
        )
    }
}

@Composable
private fun TemplateEditorTab(
    templates: List<EmailTemplate>,
    selectedTemplate: EmailTemplate,
    onSelectTemplate: (EmailTemplate) -> Unit,
    campaignTitle: String,
    onTitleChange: (String) -> Unit,
    emailSubject: String,
    onSubjectChange: (String) -> Unit,
    emailBody: String,
    onBodyChange: (String) -> Unit,
    guests: List<Guest>,
    previewGuest: Guest,
    onSelectPreviewGuest: (Guest) -> Unit,
    invitation: InvitationData,
    project: EventProject?,
    onSaveTemplate: () -> Unit,
    onProceedToSchedule: () -> Unit
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    // Target which field currently receives tag insertion
    var insertTargetSubject by remember { mutableStateOf(false) }

    val renderedSubject = remember(emailSubject, previewGuest, invitation) {
        EmailTemplateEngine.render(emailSubject, previewGuest, invitation, project)
    }

    val renderedBody = remember(emailBody, previewGuest, invitation) {
        EmailTemplateEngine.render(emailBody, previewGuest, invitation, project)
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Preset Template Selector Chips
        item {
            Column {
                Text("Pilih Template Bawaan:", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = MutedText)
                Spacer(modifier = Modifier.height(6.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(templates) { tmpl ->
                        val isSelected = tmpl.id == selectedTemplate.id
                        FilterChip(
                            selected = isSelected,
                            onClick = { onSelectTemplate(tmpl) },
                            label = { Text(tmpl.name, fontSize = 12.sp) },
                            leadingIcon = {
                                Icon(
                                    when (tmpl.category) {
                                        EmailTemplateCategory.INVITATION -> Icons.Default.Mail
                                        EmailTemplateCategory.RSVP_REMINDER -> Icons.Default.NotificationsActive
                                        EmailTemplateCategory.VENUE_GUIDE -> Icons.Default.QrCode
                                        EmailTemplateCategory.THANK_YOU -> Icons.Default.Favorite
                                    },
                                    contentDescription = null,
                                    modifier = Modifier.size(14.dp)
                                )
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = PurpleLight,
                                selectedLabelColor = PurplePrimary
                            )
                        )
                    }
                }
            }
        }

        // Campaign & Template Name
        item {
            OutlinedTextField(
                value = campaignTitle,
                onValueChange = onTitleChange,
                label = { Text("Nama Template / Draf Kampanye") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
        }

        // Merge Tags Bar (Dynamic Tag Inserter)
        item {
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF8FAFC)),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            "Sisipkan Variabel Otomatis (Merge Tags):",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = InkDark
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                if (insertTargetSubject) "Tujuan: Subjek" else "Tujuan: Isi Body",
                                fontSize = 10.sp,
                                color = PurplePrimary,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            TextButton(
                                onClick = { insertTargetSubject = !insertTargetSubject },
                                contentPadding = PaddingValues(horizontal = 6.dp, vertical = 0.dp)
                            ) {
                                Text("Ganti", fontSize = 10.sp)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        items(EmailTemplateEngine.AVAILABLE_TAGS) { tagItem ->
                            AssistChip(
                                onClick = {
                                    if (insertTargetSubject) {
                                        onSubjectChange(emailSubject + " " + tagItem.tag)
                                    } else {
                                        onBodyChange(emailBody + " " + tagItem.tag)
                                    }
                                    Toast.makeText(context, "${tagItem.tag} disisipkan!", Toast.LENGTH_SHORT).show()
                                },
                                label = { Text(tagItem.tag, fontSize = 11.sp, fontFamily = FontFamily.Monospace) },
                                colors = AssistChipDefaults.assistChipColors(containerColor = Color.White)
                            )
                        }
                    }
                }
            }
        }

        // Subject Input
        item {
            OutlinedTextField(
                value = emailSubject,
                onValueChange = onSubjectChange,
                label = { Text("Subjek Email") },
                placeholder = { Text("Contoh: Undangan Pernikahan: {{event_title}} - {{guest_name}}") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
        }

        // Body Template Input
        item {
            OutlinedTextField(
                value = emailBody,
                onValueChange = onBodyChange,
                label = { Text("Isi Pesan Template Email") },
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 180.dp),
                textStyle = MaterialTheme.typography.bodyMedium.copy(fontSize = 13.sp)
            )
        }

        // Quick Save & Action Row
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedButton(
                    onClick = onSaveTemplate,
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Icon(Icons.Default.Save, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Simpan Template")
                }

                Button(
                    onClick = onProceedToSchedule,
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                ) {
                    Text("Lanjut ke Jadwal Blast")
                    Spacer(modifier = Modifier.width(6.dp))
                    Icon(Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(16.dp))
                }
            }
        }

        // Live Personalized Email Preview Card
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF9FAFB)),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE5E7EB)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    // Header with Guest Selector
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Icon(Icons.Default.Visibility, contentDescription = null, tint = PurplePrimary, modifier = Modifier.size(18.dp))
                            Text("Pratinjau Nyata untuk Tamu:", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = InkDark)
                        }

                        // Guest selector chip
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = PurpleLight
                        ) {
                            Text(
                                text = previewGuest.name,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = PurplePrimary
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    // Switch preview guest
                    if (guests.isNotEmpty()) {
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            items(guests) { g ->
                                val isSelected = g.id == previewGuest.id
                                SuggestionChip(
                                    onClick = { onSelectPreviewGuest(g) },
                                    label = { Text(g.name.take(14), fontSize = 10.sp) },
                                    colors = SuggestionChipDefaults.suggestionChipColors(
                                        containerColor = if (isSelected) PurplePrimary else Color.White,
                                        labelColor = if (isSelected) Color.White else InkDark
                                    )
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                    }

                    // Email Mock Container
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color.White,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            // Email Client Header
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Kepada: ", fontSize = 12.sp, color = MutedText, fontWeight = FontWeight.Bold)
                                Text(
                                    "${previewGuest.name} <${previewGuest.email.ifBlank { "guest@email.com" }}>",
                                    fontSize = 12.sp,
                                    color = InkDark
                                )
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Subjek: ", fontSize = 12.sp, color = MutedText, fontWeight = FontWeight.Bold)
                                Text(renderedSubject, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = PurplePrimary)
                            }

                            Spacer(modifier = Modifier.height(8.dp))
                            Divider()
                            Spacer(modifier = Modifier.height(8.dp))

                            // Rendered Body Text
                            Text(
                                text = renderedBody,
                                style = MaterialTheme.typography.bodySmall.copy(lineHeight = 18.sp),
                                color = InkDark
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            // Action buttons: Test Real Email via Intent / Copy
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.End,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                OutlinedButton(
                                    onClick = {
                                        clipboardManager.setText(AnnotatedString("$renderedSubject\n\n$renderedBody"))
                                        Toast.makeText(context, "Isi email disalin ke clipboard!", Toast.LENGTH_SHORT).show()
                                    },
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(14.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Salin", fontSize = 11.sp)
                                }

                                Spacer(modifier = Modifier.width(8.dp))

                                Button(
                                    onClick = {
                                        val recipientEmail = previewGuest.email.ifBlank { "guest@example.com" }
                                        val intent = Intent(Intent.ACTION_SENDTO).apply {
                                            data = Uri.parse("mailto:$recipientEmail")
                                            putExtra(Intent.EXTRA_SUBJECT, renderedSubject)
                                            putExtra(Intent.EXTRA_TEXT, renderedBody)
                                        }
                                        try {
                                            context.startActivity(Intent.createChooser(intent, "Buka Aplikasi Email"))
                                        } catch (e: Exception) {
                                            Toast.makeText(context, "Tidak ada aplikasi email yang terpasang", Toast.LENGTH_SHORT).show()
                                        }
                                    },
                                    shape = RoundedCornerShape(8.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary),
                                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                                ) {
                                    Icon(Icons.AutoMirrored.Filled.Send, contentDescription = null, modifier = Modifier.size(14.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Buka di Gmail / Email", fontSize = 11.sp)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CampaignSchedulerTab(
    guests: List<Guest>,
    campaignTitle: String,
    emailSubject: String,
    emailBody: String,
    selectedTemplate: EmailTemplate,
    selectedTarget: CampaignTarget,
    onSelectTarget: (CampaignTarget) -> Unit,
    targetRecipients: List<Guest>,
    selectedTiming: ScheduleTiming,
    onSelectTiming: (ScheduleTiming) -> Unit,
    customTimeInput: String,
    onCustomTimeChange: (String) -> Unit,
    invitation: InvitationData,
    project: EventProject?,
    onScheduleConfirmed: (Boolean) -> Unit
) {
    var showConfirmDialog by remember { mutableStateOf(false) }
    var isTriggeringImmediate by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Step 1: Audience / Target Recipient Filter
        item {
            Text("1. Pilih Target Penerima Email", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = InkDark)
            Spacer(modifier = Modifier.height(6.dp))

            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                CampaignTarget.values().forEach { target ->
                    val isSelected = target == selectedTarget
                    val count = EmailTemplateEngine.filterRecipients(target, guests).size

                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = if (isSelected) Color(0xFFF3E8FF) else Color.White,
                        border = androidx.compose.foundation.BorderStroke(
                            if (isSelected) 1.5.dp else 1.dp,
                            if (isSelected) PurplePrimary else Color(0xFFE2E8F0)
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onSelectTarget(target) }
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                RadioButton(
                                    selected = isSelected,
                                    onClick = { onSelectTarget(target) },
                                    colors = RadioButtonDefaults.colors(selectedColor = PurplePrimary)
                                )
                                Column {
                                    Text(target.displayName, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = InkDark)
                                    Text(target.description, fontSize = 11.sp, color = MutedText)
                                }
                            }

                            Surface(
                                shape = RoundedCornerShape(20.dp),
                                color = if (isSelected) PurplePrimary else Color(0xFFF1F5F9)
                            ) {
                                Text(
                                    text = "$count Tamu",
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSelected) Color.White else MutedText
                                )
                            }
                        }
                    }
                }
            }
        }

        // Recipient Summary Preview Chips
        item {
            if (targetRecipients.isNotEmpty()) {
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = Color(0xFFF8FAFC),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Text(
                            "Daftar Tamu Terpilih (${targetRecipients.size} Orang):",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = MutedText
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            items(targetRecipients) { g ->
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = Color.White,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0))
                                ) {
                                    Text(
                                        "${g.name} (${g.rsvpStatus})",
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                        fontSize = 10.sp,
                                        color = InkDark
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Step 2: Scheduling Timing
        item {
            Text("2. Tentukan Waktu Pengiriman", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = InkDark)
            Spacer(modifier = Modifier.height(6.dp))

            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                ScheduleTiming.values().forEach { timing ->
                    val isSelected = timing == selectedTiming

                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = if (isSelected) Color(0xFFF3E8FF) else Color.White,
                        border = androidx.compose.foundation.BorderStroke(
                            if (isSelected) 1.5.dp else 1.dp,
                            if (isSelected) PurplePrimary else Color(0xFFE2E8F0)
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onSelectTiming(timing) }
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = isSelected,
                                onClick = { onSelectTiming(timing) },
                                colors = RadioButtonDefaults.colors(selectedColor = PurplePrimary)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(timing.displayName, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = InkDark)
                                Text(timing.offsetLabel, fontSize = 11.sp, color = MutedText)
                            }
                        }
                    }
                }

                if (selectedTiming == ScheduleTiming.CUSTOM) {
                    OutlinedTextField(
                        value = customTimeInput,
                        onValueChange = onCustomTimeChange,
                        label = { Text("Jadwal Tanggal & Jam Pengiriman") },
                        placeholder = { Text("Contoh: 22 Okt 2026, 09:00 WIB") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }

        // Step 3: Summary & Dispatch Actions
        item {
            Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFAF5FF)),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE9D5FF)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("Ringkasan Kampanye:", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = PurplePrimary)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("• Judul: $campaignTitle", fontSize = 12.sp, color = InkDark)
                    Text("• Target: ${selectedTarget.displayName} (${targetRecipients.size} Penerima)", fontSize = 12.sp, color = InkDark)
                    Text("• Jadwal: ${selectedTiming.displayName}", fontSize = 12.sp, color = InkDark)

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedButton(
                            onClick = {
                                isTriggeringImmediate = false
                                showConfirmDialog = true
                            },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(Icons.Default.Schedule, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Simpan Jadwal")
                        }

                        Button(
                            onClick = {
                                isTriggeringImmediate = true
                                showConfirmDialog = true
                            },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                        ) {
                            Icon(Icons.AutoMirrored.Filled.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Kirim Sekarang")
                        }
                    }
                }
            }
        }
    }

    if (showConfirmDialog) {
        AlertDialog(
            onDismissRequest = { showConfirmDialog = false },
            title = {
                Text(
                    if (isTriggeringImmediate) "Konfirmasi Pengiriman Langsung" else "Konfirmasi Penjadwalan Email",
                    fontWeight = FontWeight.Bold
                )
            },
            text = {
                Text(
                    if (isTriggeringImmediate) {
                        "Apakah Anda yakin ingin mengirimkan email '$campaignTitle' sekarang kepada ${targetRecipients.size} tamu terpilih?"
                    } else {
                        "Kampanye '$campaignTitle' akan dijadwalkan untuk ${targetRecipients.size} tamu dengan waktu: ${selectedTiming.displayName}."
                    }
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        showConfirmDialog = false
                        onScheduleConfirmed(isTriggeringImmediate)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                ) {
                    Text(if (isTriggeringImmediate) "Kirim Sekarang" else "Konfirmasi Jadwal")
                }
            },
            dismissButton = {
                TextButton(onClick = { showConfirmDialog = false }) {
                    Text("Batal")
                }
            }
        )
    }
}

@Composable
private fun CampaignHistoryTab(
    campaigns: List<EmailScheduleCampaign>,
    onDispatchNow: (EmailScheduleCampaign) -> Unit,
    onDeleteCampaign: (String) -> Unit,
    onPreviewDetail: (EmailScheduleCampaign) -> Unit
) {
    if (campaigns.isEmpty()) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Default.Inbox, contentDescription = null, tint = MutedText, modifier = Modifier.size(48.dp))
                Spacer(modifier = Modifier.height(8.dp))
                Text("Belum Ada Kampanye Email", fontWeight = FontWeight.Bold, color = InkDark)
                Text("Draf atau jadwalkan kampanye email pertama Anda pada tab sebelumnya.", style = MaterialTheme.typography.bodySmall, color = MutedText, textAlign = TextAlign.Center)
            }
        }
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(campaigns) { camp ->
                Card(
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(camp.title, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = InkDark)
                                Text("Subjek: ${camp.subject}", fontSize = 12.sp, color = MutedText, maxLines = 1, overflow = TextOverflow.Ellipsis)
                            }

                            // Status Badge
                            val badgeColor = when (camp.status) {
                                CampaignStatus.SENT -> Color(0xFFDCFCE7)
                                CampaignStatus.SCHEDULED -> Color(0xFFF3E8FF)
                                CampaignStatus.DRAFT -> Color(0xFFF1F5F9)
                            }
                            val textColor = when (camp.status) {
                                CampaignStatus.SENT -> Color(0xFF166534)
                                CampaignStatus.SCHEDULED -> PurplePrimary
                                CampaignStatus.DRAFT -> MutedText
                            }

                            Surface(
                                shape = RoundedCornerShape(20.dp),
                                color = badgeColor
                            ) {
                                Text(
                                    text = camp.status.displayName,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = textColor
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Divider()
                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                    Icon(Icons.Default.People, contentDescription = null, tint = MutedText, modifier = Modifier.size(14.dp))
                                    Text("${camp.recipientCount} Penerima (${camp.target.displayName})", fontSize = 11.sp, color = MutedText)
                                }
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                    Icon(Icons.Default.Schedule, contentDescription = null, tint = MutedText, modifier = Modifier.size(14.dp))
                                    Text(
                                        if (camp.status == CampaignStatus.SENT) "Terkirim: ${camp.sentAt ?: "Selesai"}" else "Jadwal: ${camp.scheduledTimeDisplay}",
                                        fontSize = 11.sp,
                                        color = MutedText
                                    )
                                }
                            }

                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                IconButton(onClick = { onPreviewDetail(camp) }, modifier = Modifier.size(32.dp)) {
                                    Icon(Icons.Default.Visibility, contentDescription = "Pratinjau", tint = InkDark, modifier = Modifier.size(18.dp))
                                }

                                if (camp.status != CampaignStatus.SENT) {
                                    IconButton(onClick = { onDispatchNow(camp) }, modifier = Modifier.size(32.dp)) {
                                        Icon(Icons.AutoMirrored.Filled.Send, contentDescription = "Kirim Sekarang", tint = PurplePrimary, modifier = Modifier.size(18.dp))
                                    }
                                }

                                IconButton(onClick = { onDeleteCampaign(camp.id) }, modifier = Modifier.size(32.dp)) {
                                    Icon(Icons.Default.DeleteOutline, contentDescription = "Hapus", tint = Color(0xFFEF4444), modifier = Modifier.size(18.dp))
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
