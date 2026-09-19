package com.aaeventmaker.app.ui.screens

import android.widget.Toast
import androidx.compose.foundation.Image
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
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aaeventmaker.app.R
import com.aaeventmaker.app.data.EventRepository
import com.aaeventmaker.app.data.SampleData
import com.aaeventmaker.app.data.TemplateItem
import com.aaeventmaker.app.ui.components.SectionHeader
import com.aaeventmaker.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InvitationScreen() {
    var selectedSubTab by remember { mutableStateOf(0) } // 0: Preview Undangan, 1: Editor Undangan, 2: Galeri Template

    val invitation by EventRepository.invitation.collectAsState()
    val context = LocalContext.current
    val clipboard = LocalClipboardManager.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Sub-tabs
        SecondaryTabRow(
            selectedTabIndex = selectedSubTab,
            containerColor = MaterialTheme.colorScheme.surface,
            contentColor = PurplePrimary
        ) {
            Tab(
                selected = selectedSubTab == 0,
                onClick = { selectedSubTab = 0 },
                text = { Text("Preview Undangan", fontWeight = FontWeight.Bold) },
                icon = { Icon(Icons.Default.RemoveRedEye, contentDescription = null, modifier = Modifier.size(18.dp)) }
            )
            Tab(
                selected = selectedSubTab == 1,
                onClick = { selectedSubTab = 1 },
                text = { Text("Editor", fontWeight = FontWeight.Bold) },
                icon = { Icon(Icons.Default.Edit, contentDescription = null, modifier = Modifier.size(18.dp)) }
            )
            Tab(
                selected = selectedSubTab == 2,
                onClick = { selectedSubTab = 2 },
                text = { Text("Template", fontWeight = FontWeight.Bold) },
                icon = { Icon(Icons.Default.Style, contentDescription = null, modifier = Modifier.size(18.dp)) }
            )
        }

        when (selectedSubTab) {
            0 -> LiveInvitationPreview(
                onEditClick = { selectedSubTab = 1 },
                onSelectTemplateClick = { selectedSubTab = 2 }
            )
            1 -> InvitationEditorForm(onSaved = { selectedSubTab = 0 })
            2 -> TemplateGallery(onTemplateChosen = { selectedSubTab = 0 })
        }
    }
}

@Composable
fun LiveInvitationPreview(
    onEditClick: () -> Unit,
    onSelectTemplateClick: () -> Unit
) {
    val invitation by EventRepository.invitation.collectAsState()
    val context = LocalContext.current
    val clipboard = LocalClipboardManager.current

    var guestRsvpName by remember { mutableStateOf("") }
    var selectedAttendance by remember { mutableStateOf("Hadir") }
    var guestPax by remember { mutableIntStateOf(2) }
    var rsvpNotes by remember { mutableStateOf("") }
    var rsvpSubmittedMessage by remember { mutableStateOf<String?>(null) }

    val activeTemplate = SampleData.TEMPLATES.find { it.title.equals(invitation.templateName, ignoreCase = true) }
        ?: SampleData.TEMPLATES.first()

    val gradientColors = activeTemplate.gradientColors.map { Color(it) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 40.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Quick Action Bar
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = onEditClick,
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.Edit, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Edit Teks")
                }

                OutlinedButton(
                    onClick = onSelectTemplateClick,
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.Palette, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Tema: ${activeTemplate.title}")
                }

                IconButton(
                    onClick = {
                        val shareUrl = "https://aaeventmaker.app/invitation/${invitation.slug}"
                        clipboard.setText(AnnotatedString(shareUrl))
                        Toast.makeText(context, "Link undangan disalin ke clipboard!", Toast.LENGTH_SHORT).show()
                    },
                    modifier = Modifier
                        .size(40.dp)
                        .background(PurpleLight, RoundedCornerShape(10.dp))
                ) {
                    Icon(Icons.Default.Share, contentDescription = "Bagikan", tint = PurplePrimary)
                }
            }
        }

        // Live Invitation Cover
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(26.dp)),
                shape = RoundedCornerShape(26.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Brush.verticalGradient(colors = gradientColors))
                        .padding(vertical = 38.dp, horizontal = 24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Surface(
                            shape = RoundedCornerShape(50),
                            color = Color.Black.copy(alpha = 0.35f),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.25f))
                        ) {
                            Text(
                                text = "THE WEDDING CELEBRATION",
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 5.dp),
                                style = MaterialTheme.typography.labelSmall,
                                letterSpacing = 2.sp,
                                color = GoldAccent,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Spacer(modifier = Modifier.height(18.dp))

                        // Realistic Couple Portrait in Circular Gold Border
                        Box(
                            modifier = Modifier
                                .size(110.dp)
                                .clip(CircleShape)
                                .border(2.5.dp, GoldAccent, CircleShape)
                        ) {
                            Image(
                                painter = painterResource(id = R.drawable.img_wedding_photo_template),
                                contentDescription = "Foto Mempelai",
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Crop
                            )
                        }

                        Spacer(modifier = Modifier.height(18.dp))
                        Text(
                            text = invitation.hosts,
                            style = MaterialTheme.typography.displayMedium,
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            textAlign = TextAlign.Center
                        )

                        Spacer(modifier = Modifier.height(10.dp))
                        Box(
                            modifier = Modifier
                                .width(50.dp)
                                .height(2.dp)
                                .background(GoldAccent)
                        )

                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = invitation.date,
                            style = MaterialTheme.typography.titleMedium,
                            color = Color.White.copy(alpha = 0.95f),
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = invitation.venue,
                            style = MaterialTheme.typography.bodyMedium,
                            color = Color.White.copy(alpha = 0.8f),
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        }

        // Opening message
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(22.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        imageVector = Icons.Default.Favorite,
                        contentDescription = null,
                        tint = PinkAccent,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "Salam Hangat",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = invitation.opening,
                        style = MaterialTheme.typography.bodyMedium,
                        textAlign = TextAlign.Center,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        lineHeight = 22.sp
                    )
                }
            }
        }

        // Agenda / Event Schedule Cards
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Text(
                        text = "Rangkaian Acara",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )

                    // Akad Nikah
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFF8FAFC), RoundedCornerShape(14.dp))
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .background(Color(0xFFEDE9FE), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Celebration, contentDescription = null, tint = PurplePrimary)
                        }
                        Spacer(modifier = Modifier.width(14.dp))
                        Column {
                            Text("Akad Nikah", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Text("Pukul 08:00 WIB • Khidmat", style = MaterialTheme.typography.bodySmall, color = MutedText)
                            Text(invitation.venue, style = MaterialTheme.typography.bodySmall, color = InkDark)
                        }
                    }

                    // Resepsi
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFF8FAFC), RoundedCornerShape(14.dp))
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .background(Color(0xFFFCE7F3), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Restaurant, contentDescription = null, tint = PinkAccent)
                        }
                        Spacer(modifier = Modifier.width(14.dp))
                        Column {
                            Text("Resepsi Pernikahan", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Text(invitation.time, style = MaterialTheme.typography.bodySmall, color = MutedText)
                            Text(invitation.address, style = MaterialTheme.typography.bodySmall, color = InkDark)
                        }
                    }
                }
            }
        }

        // Live RSVP Interactive Form
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Konfirmasi Kehadiran (RSVP)",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Mohon konfirmasi kehadiran Anda untuk membantu kami mempersiapkan jamuan terbaik.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MutedText
                    )

                    OutlinedTextField(
                        value = guestRsvpName,
                        onValueChange = { guestRsvpName = it },
                        label = { Text("Nama Lengkap Anda") },
                        placeholder = { Text("Contoh: Rizky & Istri") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    Text("Apakah Anda akan hadir?", style = MaterialTheme.typography.labelMedium)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf("Hadir", "Maaf Tidak Bisa", "Mungkin").forEach { option ->
                            val isSelected = selectedAttendance == option
                            FilterChip(
                                selected = isSelected,
                                onClick = { selectedAttendance = option },
                                label = { Text(option, fontSize = 12.sp) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = PurplePrimary,
                                    selectedLabelColor = Color.White
                                )
                            )
                        }
                    }

                    if (selectedAttendance == "Hadir") {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Jumlah Tamu Hadir (Pax):", style = MaterialTheme.typography.bodyMedium)
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                IconButton(
                                    onClick = { if (guestPax > 1) guestPax-- },
                                    enabled = guestPax > 1
                                ) {
                                    Icon(Icons.Default.RemoveCircleOutline, contentDescription = "Kurang")
                                }
                                Text("$guestPax Orang", fontWeight = FontWeight.Bold)
                                IconButton(
                                    onClick = { if (guestPax < 10) guestPax++ }
                                ) {
                                    Icon(Icons.Default.AddCircleOutline, contentDescription = "Tambah")
                                }
                            }
                        }
                    }

                    OutlinedTextField(
                        value = rsvpNotes,
                        onValueChange = { rsvpNotes = it },
                        label = { Text("Ucapan & Doa Restu (Opsional)") },
                        placeholder = { Text("Tuliskan ucapan selamat untuk kedua mempelai...") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2
                    )

                    if (rsvpSubmittedMessage != null) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = Color(0xFFDCFCE7),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF86EFAC))
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Color(0xFF166534))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = rsvpSubmittedMessage!!,
                                    color = Color(0xFF166534),
                                    fontWeight = FontWeight.Medium,
                                    fontSize = 13.sp
                                )
                            }
                        }
                    }

                    Button(
                        onClick = {
                            if (guestRsvpName.isNotBlank()) {
                                val status = when (selectedAttendance) {
                                    "Hadir" -> "Confirmed"
                                    "Maaf Tidak Bisa" -> "Declined"
                                    else -> "Maybe"
                                }
                                EventRepository.submitRsvp(
                                    guestName = guestRsvpName.trim(),
                                    status = status,
                                    pax = if (status == "Confirmed") guestPax else 0,
                                    notes = rsvpNotes.trim()
                                )
                                rsvpSubmittedMessage = "Terima kasih $guestRsvpName! Konfirmasi kehadiran Anda berhasil dicatat."
                                Toast.makeText(context, "RSVP Berhasil Disimpan!", Toast.LENGTH_SHORT).show()
                            } else {
                                Toast.makeText(context, "Silakan masukkan nama Anda", Toast.LENGTH_SHORT).show()
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                    ) {
                        Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Kirim Konfirmasi RSVP", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun InvitationEditorForm(onSaved: () -> Unit) {
    val invitation by EventRepository.invitation.collectAsState()
    val context = LocalContext.current

    var title by remember { mutableStateOf(invitation.title) }
    var hosts by remember { mutableStateOf(invitation.hosts) }
    var opening by remember { mutableStateOf(invitation.opening) }
    var date by remember { mutableStateOf(invitation.date) }
    var time by remember { mutableStateOf(invitation.time) }
    var venue by remember { mutableStateOf(invitation.venue) }
    var address by remember { mutableStateOf(invitation.address) }
    var slug by remember { mutableStateOf(invitation.slug) }
    var isPublished by remember { mutableStateOf(invitation.isPublished) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        contentPadding = PaddingValues(bottom = 30.dp)
    ) {
        item {
            Text("Pengaturan Informasi Undangan", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text("Sesuaikan data mempelai, waktu, tempat, dan narasi undangan digital.", style = MaterialTheme.typography.bodySmall, color = MutedText)
        }

        item {
            OutlinedTextField(
                value = title,
                onValueChange = { title = it },
                label = { Text("Judul Undangan") },
                modifier = Modifier.fillMaxWidth()
            )
        }

        item {
            OutlinedTextField(
                value = hosts,
                onValueChange = { hosts = it },
                label = { Text("Nama Mempelai / Tuan Rumah") },
                placeholder = { Text("Contoh: Andi Pratama & Ayu Maharani") },
                modifier = Modifier.fillMaxWidth()
            )
        }

        item {
            OutlinedTextField(
                value = opening,
                onValueChange = { opening = it },
                label = { Text("Kalimat Pembuka / Doa") },
                minLines = 3,
                modifier = Modifier.fillMaxWidth()
            )
        }

        item {
            OutlinedTextField(
                value = date,
                onValueChange = { date = it },
                label = { Text("Tanggal Acara") },
                modifier = Modifier.fillMaxWidth()
            )
        }

        item {
            OutlinedTextField(
                value = time,
                onValueChange = { time = it },
                label = { Text("Waktu & Sesi") },
                modifier = Modifier.fillMaxWidth()
            )
        }

        item {
            OutlinedTextField(
                value = venue,
                onValueChange = { venue = it },
                label = { Text("Nama Gedung / Lokasi") },
                modifier = Modifier.fillMaxWidth()
            )
        }

        item {
            OutlinedTextField(
                value = address,
                onValueChange = { address = it },
                label = { Text("Alamat Lengkap") },
                minLines = 2,
                modifier = Modifier.fillMaxWidth()
            )
        }

        item {
            OutlinedTextField(
                value = slug,
                onValueChange = { slug = it.lowercase().replace(" ", "-") },
                label = { Text("Kustom Link URL (Slug)") },
                prefix = { Text("aaeventmaker.app/invitation/", fontSize = 12.sp, color = MutedText) },
                modifier = Modifier.fillMaxWidth()
            )
        }

        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surface, RoundedCornerShape(12.dp))
                    .padding(14.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Publikasikan Undangan", fontWeight = FontWeight.Bold)
                    Text("Tamu dapat mengakses via link digital", style = MaterialTheme.typography.bodySmall, color = MutedText)
                }
                Switch(
                    checked = isPublished,
                    onCheckedChange = { isPublished = it }
                )
            }
        }

        item {
            Button(
                onClick = {
                    EventRepository.updateInvitation(
                        invitation.copy(
                            title = title.trim(),
                            hosts = hosts.trim(),
                            opening = opening.trim(),
                            date = date.trim(),
                            time = time.trim(),
                            venue = venue.trim(),
                            address = address.trim(),
                            slug = slug.trim(),
                            isPublished = isPublished
                        )
                    )
                    Toast.makeText(context, "Perubahan undangan berhasil disimpan!", Toast.LENGTH_SHORT).show()
                    onSaved()
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Save, contentDescription = null)
                Spacer(modifier = Modifier.width(6.dp))
                Text("Simpan Perubahan", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun TemplateGallery(onTemplateChosen: () -> Unit) {
    val invitation by EventRepository.invitation.collectAsState()
    val context = LocalContext.current
    var selectedCategory by remember { mutableStateOf("All") }

    val categories = listOf("All", "Wedding", "Adat Heritage", "Modern", "Birthday", "Corporate")

    val filteredTemplates = if (selectedCategory == "All") {
        SampleData.TEMPLATES
    } else {
        SampleData.TEMPLATES.filter { it.category.equals(selectedCategory, ignoreCase = true) }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Koleksi Template Undangan",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "Pilih dari gaya adat nusantara hingga pernikahan modern elegan.",
            style = MaterialTheme.typography.bodySmall,
            color = MutedText
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Category Filter Chips
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            contentPadding = PaddingValues(bottom = 8.dp)
        ) {
            items(categories) { cat ->
                FilterChip(
                    selected = selectedCategory == cat,
                    onClick = { selectedCategory = cat },
                    label = { Text(cat) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = PurplePrimary,
                        selectedLabelColor = Color.White
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(14.dp),
            contentPadding = PaddingValues(bottom = 30.dp)
        ) {
            items(filteredTemplates) { template ->
                val isCurrent = invitation.templateName.equals(template.title, ignoreCase = true)
                val gradient = template.gradientColors.map { Color(it) }

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(18.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column {
                        // Visual Banner
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(140.dp)
                                .background(Brush.linearGradient(gradient))
                                .padding(14.dp)
                        ) {
                            Column(
                                modifier = Modifier.fillMaxSize(),
                                verticalArrangement = Arrangement.SpaceBetween
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Surface(
                                        shape = RoundedCornerShape(50),
                                        color = Color.Black.copy(alpha = 0.4f)
                                    ) {
                                        Text(
                                            text = template.category,
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                            style = MaterialTheme.typography.labelSmall,
                                            color = Color.White
                                        )
                                    }
                                    Surface(
                                        shape = RoundedCornerShape(50),
                                        color = Color.White.copy(alpha = 0.25f)
                                    ) {
                                        Text(
                                            text = template.styleTag,
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                            style = MaterialTheme.typography.labelSmall,
                                            color = Color.White,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                }

                                Text(
                                    text = template.title,
                                    style = MaterialTheme.typography.headlineMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            }
                        }

                        // Info & Action
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = template.description,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MutedText,
                                    maxLines = 2
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Button(
                                onClick = {
                                    EventRepository.selectTemplate(template.title)
                                    Toast.makeText(context, "Template ${template.title} diterapkan!", Toast.LENGTH_SHORT).show()
                                    onTemplateChosen()
                                },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (isCurrent) EmeraldSuccess else PurplePrimary
                                ),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Text(if (isCurrent) "Sedang Aktif" else "Gunakan")
                            }
                        }
                    }
                }
            }
        }
    }
}
