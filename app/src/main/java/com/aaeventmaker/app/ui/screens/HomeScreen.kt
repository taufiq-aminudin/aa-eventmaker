package com.aaeventmaker.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aaeventmaker.app.data.EventProject
import com.aaeventmaker.app.data.EventRepository
import com.aaeventmaker.app.data.EventType
import com.aaeventmaker.app.ui.components.SectionHeader
import com.aaeventmaker.app.ui.components.StatCard
import com.aaeventmaker.app.ui.components.StatusBadge
import com.aaeventmaker.app.ui.components.formatRupiah
import com.aaeventmaker.app.ui.theme.*

@Composable
fun HomeScreen(
    onNavigateToTab: (Int) -> Unit,
    onOpenPublicInvitation: () -> Unit,
    onOpenQrScanner: () -> Unit
) {
    val currentProject by EventRepository.currentProject.collectAsState()
    val allProjects by EventRepository.projects.collectAsState()
    val guests by EventRepository.guests.collectAsState()
    val tasks by EventRepository.tasks.collectAsState()
    val budgets by EventRepository.budgets.collectAsState()
    val invitation by EventRepository.invitation.collectAsState()

    var showProjectDialog by remember { mutableStateOf(false) }
    var showNewProjectDialog by remember { mutableStateOf(false) }

    val confirmedGuests = guests.filter { it.rsvpStatus.equals("Confirmed", ignoreCase = true) }
    val totalPax = guests.sumOf { it.pax }
    val confirmedPax = confirmedGuests.sumOf { it.pax }
    val checkedInCount = guests.count { it.isCheckedIn }

    val completedTasks = tasks.count { it.isCompleted }
    val totalTasks = tasks.size
    val taskPercentage = if (totalTasks > 0) (completedTasks * 100 / totalTasks) else 0

    val totalPlanned = budgets.sumOf { it.plannedAmount }
    val totalActual = budgets.sumOf { it.actualAmount }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 12.dp, bottom = 28.dp)
    ) {
        // Hero Card
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp)),
                shape = RoundedCornerShape(24.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            brush = Brush.linearGradient(
                                colors = listOf(
                                    Color(0xFF0F172A),
                                    Color(0xFF312E81),
                                    Color(0xFF701A75)
                                )
                            )
                        )
                        .padding(22.dp)
                ) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                shape = RoundedCornerShape(50),
                                color = Color.White.copy(alpha = 0.15f),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.2f))
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(8.dp)
                                            .clip(CircleShape)
                                            .background(EmeraldSuccess)
                                    )
                                    Text(
                                        text = currentProject.type.displayName.uppercase(),
                                        style = MaterialTheme.typography.labelSmall,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                }
                            }

                            FilledTonalButton(
                                onClick = { showProjectDialog = true },
                                colors = ButtonDefaults.filledTonalButtonColors(
                                    containerColor = Color.White.copy(alpha = 0.2f),
                                    contentColor = Color.White
                                ),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.SwapHoriz,
                                    contentDescription = "Ganti Event",
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "Ganti Event",
                                    style = MaterialTheme.typography.labelSmall
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))
                        Text(
                            text = currentProject.name,
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color.White
                        )

                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.CalendarToday,
                                contentDescription = null,
                                tint = PinkAccent,
                                modifier = Modifier.size(14.dp)
                            )
                            Text(
                                text = "${currentProject.date} • ${currentProject.time}",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color(0xFFE2E8F0)
                            )
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocationOn,
                                contentDescription = null,
                                tint = GoldAccent,
                                modifier = Modifier.size(14.dp)
                            )
                            Text(
                                text = currentProject.location,
                                style = MaterialTheme.typography.bodySmall,
                                color = Color(0xFFCBD5E1)
                            )
                        }

                        Spacer(modifier = Modifier.height(18.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Button(
                                onClick = onOpenPublicInvitation,
                                modifier = Modifier.weight(1f),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Color.White,
                                    contentColor = InkDark
                                ),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.RemoveRedEye,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Preview Undangan", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }

                            OutlinedButton(
                                onClick = onOpenQrScanner,
                                modifier = Modifier.weight(1f),
                                colors = ButtonDefaults.outlinedButtonColors(
                                    contentColor = Color.White
                                ),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.5f)),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.QrCodeScanner,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Scan Check-In", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                        }
                    }
                }
            }
        }

        // Stats Grid
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                StatCard(
                    modifier = Modifier.weight(1f),
                    title = "RSVP TAMU",
                    value = "$confirmedPax / $totalPax",
                    subtitle = "$checkedInCount Check-In",
                    icon = Icons.Default.People,
                    iconTint = PurplePrimary
                )
                StatCard(
                    modifier = Modifier.weight(1f),
                    title = "PERSIAPAN",
                    value = "$taskPercentage%",
                    subtitle = "$completedTasks dari $totalTasks tugas",
                    icon = Icons.Default.CheckCircle,
                    iconTint = EmeraldSuccess
                )
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                StatCard(
                    modifier = Modifier.weight(1f),
                    title = "SISA BUDGET",
                    value = formatRupiah(totalPlanned - totalActual),
                    subtitle = "Terpakai: ${formatRupiah(totalActual)}",
                    icon = Icons.Default.AccountBalanceWallet,
                    iconTint = GoldAccent
                )
                StatCard(
                    modifier = Modifier.weight(1f),
                    title = "VIEWS UNDANGAN",
                    value = "${invitation.views}",
                    subtitle = if (invitation.isPublished) "Status: Published" else "Draft",
                    icon = Icons.Default.Visibility,
                    iconTint = PinkAccent
                )
            }
        }

        // Quick Modules
        item {
            SectionHeader(title = "Modul Event")
        }

        item {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    ModuleButton(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.MailOutline,
                        iconBg = Color(0xFFEDE9FE),
                        iconTint = PurplePrimary,
                        title = "Invitation Maker",
                        desc = "Template & Editor",
                        onClick = { onNavigateToTab(1) }
                    )
                    ModuleButton(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.Groups,
                        iconBg = Color(0xFFFCE7F3),
                        iconTint = PinkAccent,
                        title = "Guest Manager",
                        desc = "RSVP & E-Pass",
                        onClick = { onNavigateToTab(2) }
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    ModuleButton(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.Assignment,
                        iconBg = Color(0xFFD1FAE5),
                        iconTint = EmeraldSuccess,
                        title = "Event Planner",
                        desc = "Checklist & Timeline",
                        onClick = { onNavigateToTab(3) }
                    )
                    ModuleButton(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.Savings,
                        iconBg = Color(0xFFFEF3C7),
                        iconTint = GoldAccent,
                        title = "Budget Tracker",
                        desc = "Rincian Keuangan",
                        onClick = { onNavigateToTab(4) }
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    ModuleButton(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.AutoAwesome,
                        iconBg = Color(0xFFE0E7FF),
                        iconTint = Color(0xFF4338CA),
                        title = "Creative Studio",
                        desc = "AI, Foto, & Desain",
                        onClick = { onNavigateToTab(5) }
                    )
                    ModuleButton(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.PinDrop,
                        iconBg = Color(0xFFFEE2E2),
                        iconTint = Color(0xFFDC2626),
                        title = "Lokasi & Memori",
                        desc = "Venue & Ucapan",
                        onClick = { onNavigateToTab(6) }
                    )
                }
            }
        }
    }

    // Switch Project Dialog
    if (showProjectDialog) {
        AlertDialog(
            onDismissRequest = { showProjectDialog = false },
            title = { Text("Pilih Project Acara", fontWeight = FontWeight.Bold) },
            text = {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    allProjects.forEach { proj ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    EventRepository.selectProject(proj)
                                    showProjectDialog = false
                                },
                            colors = CardDefaults.cardColors(
                                containerColor = if (proj.id == currentProject.id) PurpleLight else MaterialTheme.colorScheme.surfaceVariant
                            ),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(proj.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    Text("${proj.type.displayName} • ${proj.date}", style = MaterialTheme.typography.bodySmall, color = MutedText)
                                }
                                if (proj.id == currentProject.id) {
                                    Icon(Icons.Default.CheckCircle, contentDescription = "Active", tint = PurplePrimary)
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))
                    Button(
                        onClick = {
                            showProjectDialog = false
                            showNewProjectDialog = true
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Buat Project Baru")
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showProjectDialog = false }) {
                    Text("Tutup")
                }
            }
        )
    }

    // New Project Dialog
    if (showNewProjectDialog) {
        var newName by remember { mutableStateOf("") }
        var newDate by remember { mutableStateOf("12 Desember 2026") }
        var newTime by remember { mutableStateOf("10:00 - 14:00 WIB") }
        var newLocation by remember { mutableStateOf("Jakarta") }
        var selectedType by remember { mutableStateOf(EventType.WEDDING) }

        AlertDialog(
            onDismissRequest = { showNewProjectDialog = false },
            title = { Text("Buat Event Baru", fontWeight = FontWeight.Bold) },
            text = {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedTextField(
                        value = newName,
                        onValueChange = { newName = it },
                        label = { Text("Nama Acara") },
                        placeholder = { Text("Contoh: Dimas & Sarah Wedding") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = newDate,
                        onValueChange = { newDate = it },
                        label = { Text("Tanggal") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = newTime,
                        onValueChange = { newTime = it },
                        label = { Text("Waktu") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = newLocation,
                        onValueChange = { newLocation = it },
                        label = { Text("Lokasi / Venue") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (newName.isNotBlank()) {
                            EventRepository.createProject(
                                name = newName.trim(),
                                type = selectedType,
                                date = newDate.trim(),
                                time = newTime.trim(),
                                location = newLocation.trim()
                            )
                            showNewProjectDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                ) {
                    Text("Simpan Project")
                }
            },
            dismissButton = {
                TextButton(onClick = { showNewProjectDialog = false }) {
                    Text("Batal")
                }
            }
        )
    }
}

@Composable
private fun ModuleButton(
    modifier: Modifier = Modifier,
    icon: ImageVector,
    iconBg: Color,
    iconTint: Color,
    title: String,
    desc: String,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(iconBg),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = iconTint,
                    modifier = Modifier.size(22.dp)
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = desc,
                style = MaterialTheme.typography.bodySmall,
                color = MutedText,
                maxLines = 1
            )
        }
    }
}
