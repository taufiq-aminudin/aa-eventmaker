package com.aaeventmaker.app.ui.screens

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aaeventmaker.app.data.EventRepository
import com.aaeventmaker.app.data.Guest
import com.aaeventmaker.app.ui.components.SectionHeader
import com.aaeventmaker.app.ui.components.StatusBadge
import com.aaeventmaker.app.ui.theme.*
import com.aaeventmaker.app.util.QrCodeUtil

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GuestScreen(
    initialOpenScanner: Boolean = false
) {
    val guests by EventRepository.guests.collectAsState()
    val context = LocalContext.current

    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf("All") }

    var selectedGuestForPass by remember { mutableStateOf<Guest?>(null) }
    var showAddGuestDialog by remember { mutableStateOf(false) }
    var showScannerDialog by remember { mutableStateOf(initialOpenScanner) }

    val totalPax = guests.sumOf { it.pax }
    val confirmedPax = guests.filter { it.rsvpStatus.equals("Confirmed", ignoreCase = true) }.sumOf { it.pax }
    val checkedInCount = guests.count { it.isCheckedIn }

    val filterOptions = listOf("All", "VIP", "Family", "Friend", "Confirmed", "Pending", "Checked In")

    val filteredGuests = guests.filter { guest ->
        val matchesSearch = guest.name.contains(searchQuery, ignoreCase = true) ||
                guest.phone.contains(searchQuery) ||
                guest.tableNumber.contains(searchQuery, ignoreCase = true)

        val matchesFilter = when (selectedFilter) {
            "All" -> true
            "VIP" -> guest.group.equals("VIP", ignoreCase = true)
            "Family" -> guest.group.equals("Family", ignoreCase = true)
            "Friend" -> guest.group.equals("Friend", ignoreCase = true)
            "Confirmed" -> guest.rsvpStatus.equals("Confirmed", ignoreCase = true)
            "Pending" -> guest.rsvpStatus.equals("Pending", ignoreCase = true)
            "Checked In" -> guest.isCheckedIn
            else -> true
        }

        matchesSearch && matchesFilter
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddGuestDialog = true },
                containerColor = PurplePrimary,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.PersonAdd, contentDescription = "Tambah Tamu")
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(MaterialTheme.colorScheme.background)
                .padding(horizontal = 16.dp)
        ) {
            Spacer(modifier = Modifier.height(10.dp))

            // Header & Terminal Scanner Button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Daftar Tamu & E-Pass", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    Text("Total: ${guests.size} Undangan ($totalPax Pax)", style = MaterialTheme.typography.bodySmall, color = MutedText)
                }

                Button(
                    onClick = { showScannerDialog = true },
                    colors = ButtonDefaults.buttonColors(containerColor = InkDark),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.QrCodeScanner, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Buku Tamu / Scan")
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Quick Stats Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Terkonfirmasi", style = MaterialTheme.typography.labelSmall, color = MutedText)
                        Text("$confirmedPax Pax", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = EmeraldSuccess)
                    }
                    Divider(modifier = Modifier.height(36.dp).width(1.dp))
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Sudah Check-In", style = MaterialTheme.typography.labelSmall, color = MutedText)
                        Text("$checkedInCount Tamu", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = PurplePrimary)
                    }
                    Divider(modifier = Modifier.height(36.dp).width(1.dp))
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Pending", style = MaterialTheme.typography.labelSmall, color = MutedText)
                        Text("${guests.count { it.rsvpStatus == "Pending" }} Tamu", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = GoldAccent)
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Cari nama tamu, no hp, atau meja...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Category Chips
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                contentPadding = PaddingValues(vertical = 4.dp)
            ) {
                items(filterOptions) { filter ->
                    FilterChip(
                        selected = selectedFilter == filter,
                        onClick = { selectedFilter = filter },
                        label = { Text(filter) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = PurplePrimary,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Guest List
            if (filteredGuests.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text("Tidak ada data tamu yang cocok.", color = MutedText)
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    contentPadding = PaddingValues(bottom = 80.dp)
                ) {
                    items(filteredGuests) { guest ->
                        GuestItemCard(
                            guest = guest,
                            onViewPass = { selectedGuestForPass = guest },
                            onCheckIn = {
                                EventRepository.checkInGuest(guest.id)
                                vibrateDevice(context)
                                Toast.makeText(context, "${guest.name} berhasil check-in!", Toast.LENGTH_SHORT).show()
                            }
                        )
                    }
                }
            }
        }
    }

    // E-Pass QR Ticket Dialog
    if (selectedGuestForPass != null) {
        val guest = selectedGuestForPass!!
        val qrPayload = remember(guest.id) {
            "{\"id\":\"${guest.id}\",\"name\":\"${guest.name}\",\"pax\":${guest.pax},\"type\":\"EVENT_PASS\"}"
        }
        val qrImageBitmap = remember(qrPayload) {
            QrCodeUtil.generateQrImageBitmap(qrPayload, 400)
        }

        AlertDialog(
            onDismissRequest = { selectedGuestForPass = null },
            title = {
                Text("E-Pass Check-In", textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth(), fontWeight = FontWeight.Bold)
            },
            text = {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Surface(
                        shape = RoundedCornerShape(50),
                        color = PurpleLight
                    ) {
                        Text(
                            text = "OFFICIAL EVENT PASS",
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = PurplePrimary
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Text(guest.name, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
                    Text("Kuota: ${guest.pax} Orang • Meja: ${guest.tableNumber}", style = MaterialTheme.typography.bodyMedium, color = MutedText)

                    Spacer(modifier = Modifier.height(16.dp))

                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                        modifier = Modifier.padding(8.dp)
                    ) {
                        Image(
                            bitmap = qrImageBitmap,
                            contentDescription = "QR Code E-Pass",
                            modifier = Modifier
                                .size(200.dp)
                                .padding(12.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "Tunjukkan QR Code ini kepada resepsionis saat tiba di lokasi acara untuk registrasi instan.",
                        style = MaterialTheme.typography.bodySmall,
                        textAlign = TextAlign.Center,
                        color = MutedText
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (!guest.isCheckedIn) {
                            EventRepository.checkInGuest(guest.id)
                            vibrateDevice(context)
                            Toast.makeText(context, "${guest.name} tercatat check-in!", Toast.LENGTH_SHORT).show()
                        }
                        selectedGuestForPass = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = if (guest.isCheckedIn) EmeraldSuccess else PurplePrimary)
                ) {
                    Text(if (guest.isCheckedIn) "Sudah Check-In ✓" else "Check-In Sekarang")
                }
            },
            dismissButton = {
                TextButton(onClick = { selectedGuestForPass = null }) {
                    Text("Tutup")
                }
            }
        )
    }

    // Buku Tamu & Scanner Terminal Dialog
    if (showScannerDialog) {
        CheckInScannerDialog(
            guests = guests,
            onDismiss = { showScannerDialog = false },
            onCheckIn = { guestId ->
                val checked = EventRepository.checkInGuest(guestId)
                vibrateDevice(context)
                checked
            }
        )
    }

    // Add Guest Dialog
    if (showAddGuestDialog) {
        var name by remember { mutableStateOf("") }
        var group by remember { mutableStateOf("General") }
        var pax by remember { mutableIntStateOf(2) }
        var phone by remember { mutableStateOf("") }
        var email by remember { mutableStateOf("") }
        var table by remember { mutableStateOf("Table 01") }

        AlertDialog(
            onDismissRequest = { showAddGuestDialog = false },
            title = { Text("Tambah Tamu Baru", fontWeight = FontWeight.Bold) },
            text = {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Nama Tamu / Keluarga") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedTextField(
                            value = group,
                            onValueChange = { group = it },
                            label = { Text("Kategori (VIP/Family/dll)") },
                            modifier = Modifier.weight(1f),
                            singleLine = true
                        )
                        OutlinedTextField(
                            value = table,
                            onValueChange = { table = it },
                            label = { Text("No. Meja") },
                            modifier = Modifier.weight(1f),
                            singleLine = true
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Jumlah Tamu (Pax):", style = MaterialTheme.typography.bodyMedium)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            IconButton(onClick = { if (pax > 1) pax-- }) {
                                Icon(Icons.Default.RemoveCircleOutline, contentDescription = null)
                            }
                            Text("$pax Pax", fontWeight = FontWeight.Bold)
                            IconButton(onClick = { pax++ }) {
                                Icon(Icons.Default.AddCircleOutline, contentDescription = null)
                            }
                        }
                    }

                    OutlinedTextField(
                        value = phone,
                        onValueChange = { phone = it },
                        label = { Text("No. Telepon / WhatsApp") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (name.isNotBlank()) {
                            EventRepository.addGuest(
                                name = name.trim(),
                                group = group.trim(),
                                pax = pax,
                                phone = phone.trim(),
                                email = email.trim(),
                                table = table.trim()
                            )
                            Toast.makeText(context, "Tamu berhasil ditambahkan!", Toast.LENGTH_SHORT).show()
                            showAddGuestDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                ) {
                    Text("Simpan Tamu")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddGuestDialog = false }) {
                    Text("Batal")
                }
            }
        )
    }
}

@Composable
fun GuestItemCard(
    guest: Guest,
    onViewPass: () -> Unit,
    onCheckIn: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = PurpleLight
                    ) {
                        Text(
                            text = guest.group,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            style = MaterialTheme.typography.labelSmall,
                            color = PurplePrimary,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Text("Meja ${guest.tableNumber}", style = MaterialTheme.typography.bodySmall, color = MutedText)
                }

                StatusBadge(status = guest.rsvpStatus)
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text(guest.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

            Spacer(modifier = Modifier.height(4.dp))
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("${guest.pax} Orang", style = MaterialTheme.typography.bodySmall, color = InkDark, fontWeight = FontWeight.Medium)
                if (guest.phone.isNotBlank()) {
                    Text("• ${guest.phone}", style = MaterialTheme.typography.bodySmall, color = MutedText)
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
            Divider()
            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (guest.isCheckedIn) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = EmeraldSuccess, modifier = Modifier.size(16.dp))
                        Text("Check-In: ${guest.checkInTime ?: "Tercatat"}", style = MaterialTheme.typography.labelSmall, color = EmeraldSuccess, fontWeight = FontWeight.Bold)
                    }
                } else {
                    OutlinedButton(
                        onClick = onCheckIn,
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                    ) {
                        Icon(Icons.Default.QrCodeScanner, contentDescription = null, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Check-In", fontSize = 12.sp)
                    }
                }

                FilledTonalButton(
                    onClick = onViewPass,
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.filledTonalButtonColors(containerColor = PurpleLight, contentColor = PurplePrimary),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                ) {
                    Icon(Icons.Default.QrCode, contentDescription = null, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("E-Pass QR", fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
fun CheckInScannerDialog(
    guests: List<Guest>,
    onDismiss: () -> Unit,
    onCheckIn: (String) -> Guest?
) {
    var manualInput by remember { mutableStateOf("") }
    var scanSuccessGuest by remember { mutableStateOf<Guest?>(null) }
    var errorMsg by remember { mutableStateOf<String?>(null) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(Icons.Default.QrCodeScanner, contentDescription = null, tint = PurplePrimary)
                Text("Buku Tamu & Scan QR", fontWeight = FontWeight.Bold)
            }
        },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(
                    "Simulasi Scanner Resepsionis: Masukkan nama atau scan payload QR E-Pass tamu.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MutedText
                )

                // Simulated Scanner Frame
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(130.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFF0F172A))
                        .border(1.dp, Color(0xFF334155), RoundedCornerShape(16.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Default.CenterFocusWeak, contentDescription = null, tint = PurpleLight, modifier = Modifier.size(48.dp))
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("Area Pemindaian QR Kamera Aktif", style = MaterialTheme.typography.bodySmall, color = Color(0xFF94A3B8))
                    }
                }

                if (scanSuccessGuest != null) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color(0xFFDCFCE7),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF86EFAC)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("✓ BERHASIL CHECK-IN", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = Color(0xFF166534))
                                Text(scanSuccessGuest!!.checkInTime ?: "", style = MaterialTheme.typography.labelSmall, color = Color(0xFF166534))
                            }
                            Text(scanSuccessGuest!!.name, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = InkDark)
                            Text("Jumlah: ${scanSuccessGuest!!.pax} Pax • Meja: ${scanSuccessGuest!!.tableNumber}", style = MaterialTheme.typography.bodySmall, color = Color(0xFF166534))
                        }
                    }
                }

                if (errorMsg != null) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color(0xFFFEE2E2),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFCA5A5)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = errorMsg!!,
                            color = Color(0xFF991B1B),
                            modifier = Modifier.padding(10.dp),
                            style = MaterialTheme.typography.bodySmall
                        )
                    }
                }

                OutlinedTextField(
                    value = manualInput,
                    onValueChange = { manualInput = it },
                    label = { Text("Ketik Nama / Kode Tamu") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )

                Button(
                    onClick = {
                        if (manualInput.isNotBlank()) {
                            val matched = guests.find {
                                it.name.contains(manualInput.trim(), ignoreCase = true) || it.id.contains(manualInput.trim())
                            }
                            if (matched != null) {
                                val checked = onCheckIn(matched.id)
                                scanSuccessGuest = checked
                                errorMsg = null
                                manualInput = ""
                            } else {
                                errorMsg = "Tamu tidak ditemukan dalam daftar acara."
                                scanSuccessGuest = null
                            }
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                ) {
                    Text("Verifikasi & Check-In Tamu")
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text("Tutup Terminal")
            }
        }
    )
}

private fun vibrateDevice(context: Context) {
    try {
        val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator?.vibrate(VibrationEffect.createOneShot(100, VibrationEffect.DEFAULT_AMPLITUDE))
        } else {
            @Suppress("DEPRECATION")
            vibrator?.vibrate(100)
        }
    } catch (_: Exception) {}
}
