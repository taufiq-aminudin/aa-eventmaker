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
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aaeventmaker.app.data.EventRepository
import com.aaeventmaker.app.data.Guest
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import android.Manifest
import android.content.pm.PackageManager
import com.aaeventmaker.app.ui.components.CameraBarcodeScannerView
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
    val invitation by EventRepository.invitation.collectAsState()
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf("All") }

    var selectedGuestForPass by remember { mutableStateOf<Guest?>(null) }
    var selectedGuestForWebSim by remember { mutableStateOf<Guest?>(null) }
    var showBatchQrDialog by remember { mutableStateOf(false) }
    var showAddGuestDialog by remember { mutableStateOf(false) }
    var showScannerDialog by remember { mutableStateOf(initialOpenScanner) }

    val totalPax = guests.sumOf { it.pax }
    val confirmedPax = guests.filter { it.rsvpStatus.equals("Confirmed", ignoreCase = true) }.sumOf { it.pax }
    val checkedInCount = guests.count { it.isCheckedIn }

    val filterOptions = listOf("All", "VIP", "Family", "Friend", "Confirmed", "Pending", "Checked In")

    val filteredGuests = guests.filter { guest ->
        val matchesSearch = guest.name.contains(searchQuery, ignoreCase = true) ||
                guest.phone.contains(searchQuery) ||
                guest.tableNumber.contains(searchQuery, ignoreCase = true) ||
                guest.checkInCode.contains(searchQuery, ignoreCase = true)

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

            // Header & Action Buttons
            Column(modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Daftar Tamu & E-Pass", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                        Text("Total: ${guests.size} Undangan ($totalPax Pax) • Link Unik Aktif", style = MaterialTheme.typography.bodySmall, color = MutedText)
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilledTonalButton(
                            onClick = { showBatchQrDialog = true },
                            shape = RoundedCornerShape(12.dp),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Icon(Icons.Default.Link, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Hub Link & QR", fontSize = 12.sp)
                        }

                        Button(
                            onClick = { showScannerDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = InkDark),
                            shape = RoundedCornerShape(12.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Icon(Icons.Default.QrCodeScanner, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Scan QR", fontSize = 12.sp)
                        }
                    }
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
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Terkonfirmasi", style = MaterialTheme.typography.labelSmall, color = MutedText)
                        Text("$confirmedPax Pax", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = EmeraldSuccess)
                    }
                    Divider(modifier = Modifier.height(36.dp).width(1.dp))
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Sudah Hadir", style = MaterialTheme.typography.labelSmall, color = MutedText)
                        Text("$checkedInCount Tamu", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = PurplePrimary)
                    }
                    Divider(modifier = Modifier.height(36.dp).width(1.dp))
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Pending", style = MaterialTheme.typography.labelSmall, color = MutedText)
                        Text("${guests.count { it.rsvpStatus == "Pending" }} Tamu", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = GoldAccent)
                    }
                    Divider(modifier = Modifier.height(36.dp).width(1.dp))
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Link QR Unik", style = MaterialTheme.typography.labelSmall, color = MutedText)
                        Text("${guests.size}/${guests.size}", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = PurplePrimary)
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
                            invitationSlug = invitation.slug,
                            onViewPass = { selectedGuestForPass = guest },
                            onPreviewWeb = { selectedGuestForWebSim = guest },
                            onCopyLink = {
                                val link = guest.getCheckInUrl(invitation.slug)
                                clipboardManager.setText(AnnotatedString(link))
                                Toast.makeText(context, "Tautan untuk ${guest.name} disalin!", Toast.LENGTH_SHORT).show()
                            },
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

    // QR Code Generator & Unique Link Dialog
    if (selectedGuestForPass != null) {
        GuestQrGeneratorDialog(
            guest = selectedGuestForPass!!,
            invitation = invitation,
            onDismiss = { selectedGuestForPass = null },
            onCheckIn = { guestId ->
                EventRepository.checkInGuest(guestId)
                vibrateDevice(context)
            },
            onPreviewWebLink = { guestToPreview ->
                selectedGuestForWebSim = guestToPreview
            }
        )
    }

    // Mobile Web Check-In Simulator Dialog
    if (selectedGuestForWebSim != null) {
        GuestMobileWebCheckInDialog(
            guest = selectedGuestForWebSim!!,
            invitation = invitation,
            onDismiss = { selectedGuestForWebSim = null },
            onConfirmCheckIn = { guestId ->
                EventRepository.checkInGuest(guestId)
                vibrateDevice(context)
            }
        )
    }

    // Batch QR & Links Hub Dialog
    if (showBatchQrDialog) {
        BatchQrLinksDialog(
            guests = guests,
            invitation = invitation,
            onDismiss = { showBatchQrDialog = false },
            onSelectGuest = { guest ->
                selectedGuestForPass = guest
            }
        )
    }

    // Buku Tamu & Scanner Terminal Dialog
    if (showScannerDialog) {
        CheckInScannerDialog(
            guests = guests,
            invitationSlug = invitation.slug,
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
    invitationSlug: String,
    onViewPass: () -> Unit,
    onPreviewWeb: () -> Unit,
    onCopyLink: () -> Unit,
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

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = Color(0xFFEDE9FE)
                    ) {
                        Text(
                            text = guest.checkInCode,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = PurplePrimary
                        )
                    }
                    StatusBadge(status = guest.rsvpStatus)
                }
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

            Spacer(modifier = Modifier.height(10.dp))
            Divider()
            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    if (guest.isCheckedIn) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = EmeraldSuccess, modifier = Modifier.size(16.dp))
                            Text("Hadir: ${guest.checkInTime ?: "OK"}", style = MaterialTheme.typography.labelSmall, color = EmeraldSuccess, fontWeight = FontWeight.Bold)
                        }
                    } else {
                        OutlinedButton(
                            onClick = onCheckIn,
                            shape = RoundedCornerShape(10.dp),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Check-In", fontSize = 12.sp)
                        }
                    }

                    // Quick copy link icon button
                    IconButton(
                        onClick = onCopyLink,
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(Icons.Default.Link, contentDescription = "Salin Link", tint = PurplePrimary, modifier = Modifier.size(18.dp))
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
                    Text("QR & Link Pass", fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
fun CheckInScannerDialog(
    guests: List<Guest>,
    invitationSlug: String,
    onDismiss: () -> Unit,
    onCheckIn: (String) -> Guest?
) {
    val context = LocalContext.current
    var manualInput by remember { mutableStateOf("") }
    var scanSuccessGuest by remember { mutableStateOf<Guest?>(null) }
    var errorMsg by remember { mutableStateOf<String?>(null) }
    var activeTab by remember { mutableStateOf(0) } // 0: Live Kamera, 1: Input / Simulasi Manual

    var hasCameraPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED
        )
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        hasCameraPermission = isGranted
        if (!isGranted) {
            Toast.makeText(context, "Izin kamera diperlukan untuk memindai QR secara langsung", Toast.LENGTH_SHORT).show()
        }
    }

    fun processCheckIn(query: String) {
        val trimmed = query.trim()
        if (trimmed.isNotBlank()) {
            val extractedIdOrCode = QrCodeUtil.extractGuestCodeOrId(trimmed)
            val matched = guests.find {
                it.checkInCode.equals(extractedIdOrCode, ignoreCase = true) ||
                        it.id.equals(extractedIdOrCode, ignoreCase = true) ||
                        it.name.contains(trimmed, ignoreCase = true) ||
                        (it.phone.isNotBlank() && trimmed.contains(it.phone))
            }
            if (matched != null) {
                val checked = onCheckIn(matched.id)
                scanSuccessGuest = checked
                errorMsg = null
                manualInput = ""
            } else {
                errorMsg = "QR Link / Kode Check-In tidak dikenali atau tamu tidak terdaftar: '$trimmed'"
                scanSuccessGuest = null
            }
        }
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(Icons.Default.QrCodeScanner, contentDescription = null, tint = PurplePrimary)
                    Text("QR Scanner Resepsionis", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                }
                IconButton(onClick = onDismiss, modifier = Modifier.size(28.dp)) {
                    Icon(Icons.Default.Close, contentDescription = "Tutup", tint = MutedText, modifier = Modifier.size(18.dp))
                }
            }
        },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Tab switch: Kamera Langsung vs Input Cepat / Manual
                TabRow(
                    selectedTabIndex = activeTab,
                    containerColor = Color(0xFFF1F5F9),
                    modifier = Modifier.clip(RoundedCornerShape(10.dp))
                ) {
                    Tab(
                        selected = activeTab == 0,
                        onClick = { activeTab = 0 },
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                Icon(Icons.Default.CameraAlt, contentDescription = null, modifier = Modifier.size(16.dp))
                                Text("Kamera Live", fontSize = 13.sp)
                            }
                        }
                    )
                    Tab(
                        selected = activeTab == 1,
                        onClick = { activeTab = 1 },
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                Icon(Icons.Default.Edit, contentDescription = null, modifier = Modifier.size(16.dp))
                                Text("Input / Uji Coba", fontSize = 13.sp)
                            }
                        }
                    )
                }

                if (activeTab == 0) {
                    // Camera Live Scanning View
                    if (hasCameraPermission) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(210.dp)
                                .clip(RoundedCornerShape(16.dp))
                        ) {
                            CameraBarcodeScannerView(
                                modifier = Modifier.fillMaxSize(),
                                onBarcodeScanned = { rawBarcode ->
                                    processCheckIn(rawBarcode)
                                }
                            )
                        }
                        Text(
                            "Arahkan kamera ke QR Code undangan tamu untuk check-in instan.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MutedText,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth()
                        )
                    } else {
                        // Permission Request Card
                        Card(
                            shape = RoundedCornerShape(14.dp),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFFFAF5FF)),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFDDD6FE)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Icon(
                                    Icons.Default.CameraAlt,
                                    contentDescription = null,
                                    tint = PurplePrimary,
                                    modifier = Modifier.size(36.dp)
                                )
                                Text(
                                    "Izin Kamera Diperlukan",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp,
                                    color = InkDark
                                )
                                Text(
                                    "Izinkan akses kamera untuk mengaktifkan pemindai barcode/QR code otomatis.",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MutedText,
                                    textAlign = TextAlign.Center
                                )
                                Button(
                                    onClick = { permissionLauncher.launch(Manifest.permission.CAMERA) },
                                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Icon(Icons.Default.LockOpen, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("Aktifkan Akses Kamera")
                                }
                            }
                        }
                    }
                } else {
                    // Manual Input & Quick Test simulation chips
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            "Ketik nama tamu, nomor kode check-in, atau paste tautan QR E-Pass tamu.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MutedText
                        )

                        // Quick Testing Simulation Chips
                        if (guests.isNotEmpty()) {
                            Text("Klik untuk simulasi scan tamu:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MutedText)
                            LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                items(guests.take(4)) { guestItem ->
                                    AssistChip(
                                        onClick = {
                                            val sampleUrl = guestItem.getCheckInUrl(invitationSlug)
                                            manualInput = sampleUrl
                                            processCheckIn(sampleUrl)
                                        },
                                        label = { Text("${guestItem.name.take(10)} (${guestItem.checkInCode})", fontSize = 10.sp) },
                                        leadingIcon = { Icon(Icons.Default.QrCode, contentDescription = null, modifier = Modifier.size(12.dp)) }
                                    )
                                }
                            }
                        }

                        OutlinedTextField(
                            value = manualInput,
                            onValueChange = { manualInput = it },
                            label = { Text("Nama / Kode / URL E-Pass") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )

                        Button(
                            onClick = { processCheckIn(manualInput) },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                        ) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Verifikasi & Check-In Tamu")
                        }
                    }
                }

                // Scan Success Banner
                if (scanSuccessGuest != null) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color(0xFFDCFCE7),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF86EFAC)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .background(Color(0xFF16A34A), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Check, contentDescription = null, tint = Color.White, modifier = Modifier.size(20.dp))
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("BERHASIL CHECK-IN", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = Color(0xFF166534))
                                    Text(scanSuccessGuest!!.checkInTime ?: "Sekarang", style = MaterialTheme.typography.labelSmall, color = Color(0xFF166534), fontWeight = FontWeight.Bold)
                                }
                                Text(scanSuccessGuest!!.name, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = InkDark)
                                Text("Jumlah: ${scanSuccessGuest!!.pax} Pax • Meja: ${scanSuccessGuest!!.tableNumber}", style = MaterialTheme.typography.bodySmall, color = Color(0xFF166534))
                                Text("Kode: ${scanSuccessGuest!!.checkInCode} (${scanSuccessGuest!!.group})", fontSize = 11.sp, color = Color(0xFF166534), fontWeight = FontWeight.Medium)
                            }
                        }
                    }
                }

                // Error Message
                if (errorMsg != null) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color(0xFFFEE2E2),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFCA5A5)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(Icons.Default.Warning, contentDescription = null, tint = Color(0xFFDC2626), modifier = Modifier.size(20.dp))
                            Text(
                                text = errorMsg!!,
                                color = Color(0xFF991B1B),
                                style = MaterialTheme.typography.bodySmall
                            )
                        }
                    }
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
