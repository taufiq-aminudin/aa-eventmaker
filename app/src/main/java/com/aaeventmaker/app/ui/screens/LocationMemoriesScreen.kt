package com.aaeventmaker.app.ui.screens

import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aaeventmaker.app.data.EventRepository
import com.aaeventmaker.app.data.MemoryItem
import com.aaeventmaker.app.data.VenueLocation
import com.aaeventmaker.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LocationMemoriesScreen() {
    var selectedTab by remember { mutableStateOf(0) } // 0: Lokasi & Venue, 1: Memori & Doa Tamu

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        SecondaryTabRow(
            selectedTabIndex = selectedTab,
            containerColor = MaterialTheme.colorScheme.surface,
            contentColor = PurplePrimary
        ) {
            Tab(
                selected = selectedTab == 0,
                onClick = { selectedTab = 0 },
                text = { Text("Lokasi & Venue", fontWeight = FontWeight.Bold) },
                icon = { Icon(Icons.Default.LocationOn, contentDescription = null, modifier = Modifier.size(18.dp)) }
            )
            Tab(
                selected = selectedTab == 1,
                onClick = { selectedTab = 1 },
                text = { Text("Doa & Memori Tamu", fontWeight = FontWeight.Bold) },
                icon = { Icon(Icons.Default.Favorite, contentDescription = null, modifier = Modifier.size(18.dp)) }
            )
        }

        when (selectedTab) {
            0 -> LocationsTab()
            1 -> MemoriesTab()
        }
    }
}

@Composable
fun LocationsTab() {
    val locations by EventRepository.locations.collectAsState()
    val context = LocalContext.current
    var showAddDialog by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = PurplePrimary,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.AddLocationAlt, contentDescription = "Tambah Lokasi")
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {
            Text("Lokasi & Panduan Venue Acara", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text("Titik kumpul dan alamat venue untuk memudahkan mobilisasi tamu.", style = MaterialTheme.typography.bodySmall, color = MutedText)

            Spacer(modifier = Modifier.height(14.dp))

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(14.dp),
                contentPadding = PaddingValues(bottom = 80.dp)
            ) {
                items(locations) { loc ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = PurpleLight
                                ) {
                                    Text(
                                        text = loc.type,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                        style = MaterialTheme.typography.labelSmall,
                                        color = PurplePrimary,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                                Text(loc.time, style = MaterialTheme.typography.bodySmall, color = MutedText)
                            }

                            Spacer(modifier = Modifier.height(10.dp))
                            Text(loc.name, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(loc.address, style = MaterialTheme.typography.bodySmall, color = MutedText)

                            Spacer(modifier = Modifier.height(12.dp))

                            OutlinedButton(
                                onClick = {
                                    val uri = Uri.parse(if (loc.mapUrl.isNotBlank()) loc.mapUrl else "geo:0,0?q=${Uri.encode(loc.name + " " + loc.address)}")
                                    val intent = Intent(Intent.ACTION_VIEW, uri)
                                    try {
                                        context.startActivity(intent)
                                    } catch (_: Exception) {
                                        Toast.makeText(context, "Membuka peta: ${loc.name}", Toast.LENGTH_SHORT).show()
                                    }
                                },
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Icon(Icons.Default.Directions, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Buka Navigasi Google Maps")
                            }
                        }
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        var name by remember { mutableStateOf("") }
        var type by remember { mutableStateOf("Resepsi / Reception") }
        var address by remember { mutableStateOf("") }
        var time by remember { mutableStateOf("11:00 - 14:00 WIB") }
        var mapUrl by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = { Text("Tambah Lokasi Acara", fontWeight = FontWeight.Bold) },
            text = {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Nama Tempat / Gedung") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                    OutlinedTextField(
                        value = type,
                        onValueChange = { type = it },
                        label = { Text("Sesi (Akad/Resepsi/After Party)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                    OutlinedTextField(
                        value = address,
                        onValueChange = { address = it },
                        label = { Text("Alamat Lengkap") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = time,
                        onValueChange = { time = it },
                        label = { Text("Waktu Pelaksanaan") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (name.isNotBlank()) {
                            EventRepository.addLocation(
                                name = name.trim(),
                                type = type.trim(),
                                address = address.trim(),
                                time = time.trim(),
                                mapUrl = mapUrl.trim()
                            )
                            Toast.makeText(context, "Lokasi baru ditambahkan!", Toast.LENGTH_SHORT).show()
                            showAddDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                ) {
                    Text("Simpan Lokasi")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddDialog = false }) {
                    Text("Batal")
                }
            }
        )
    }
}

@Composable
fun MemoriesTab() {
    val memories by EventRepository.memories.collectAsState()
    val context = LocalContext.current
    var showAddWishDialog by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddWishDialog = true },
                containerColor = PinkAccent,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.AddComment, contentDescription = "Tulis Ucapan")
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {
            Text("Buku Tamu Digital & Doa Restu", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text("Kumpulan doa dan ucapan hangat dari para sahabat dan keluarga tercinta.", style = MaterialTheme.typography.bodySmall, color = MutedText)

            Spacer(modifier = Modifier.height(14.dp))

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                contentPadding = PaddingValues(bottom = 80.dp)
            ) {
                items(memories) { mem ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp)
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
                                    Box(
                                        modifier = Modifier
                                            .size(32.dp)
                                            .background(Color(0xFFFCE7F3), CircleShape),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = mem.guestName.take(1).uppercase(),
                                            fontWeight = FontWeight.Bold,
                                            color = PinkAccent,
                                            fontSize = 14.sp
                                        )
                                    }
                                    Text(mem.guestName, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                                }
                                Text(mem.timestamp, style = MaterialTheme.typography.labelSmall, color = MutedText)
                            }

                            Spacer(modifier = Modifier.height(10.dp))
                            Text(
                                text = "\"${mem.message}\"",
                                style = MaterialTheme.typography.bodyMedium,
                                color = InkDark
                            )
                        }
                    }
                }
            }
        }
    }

    if (showAddWishDialog) {
        var name by remember { mutableStateOf("") }
        var wish by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showAddWishDialog = false },
            title = { Text("Tulis Doa & Ucapan", fontWeight = FontWeight.Bold) },
            text = {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Nama Anda") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                    OutlinedTextField(
                        value = wish,
                        onValueChange = { wish = it },
                        label = { Text("Pesan & Doa") },
                        minLines = 3,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (name.isNotBlank() && wish.isNotBlank()) {
                            EventRepository.addMemory(name.trim(), wish.trim())
                            Toast.makeText(context, "Ucapan tersimpan di Buku Tamu!", Toast.LENGTH_SHORT).show()
                            showAddWishDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PinkAccent)
                ) {
                    Text("Kirim Ucapan")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddWishDialog = false }) {
                    Text("Batal")
                }
            }
        )
    }
}
