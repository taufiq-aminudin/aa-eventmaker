package com.aaeventmaker.app.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aaeventmaker.app.data.EventRepository
import com.aaeventmaker.app.data.SampleData
import com.aaeventmaker.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StudioScreen() {
    var selectedTab by remember { mutableStateOf(0) } // 0: AI Creator, 1: Photo Inspiration, 2: Video Story, 3: Design Maker

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
                text = { Text("AI Creator", fontSize = 12.sp, fontWeight = FontWeight.Bold) },
                icon = { Icon(Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(16.dp)) }
            )
            Tab(
                selected = selectedTab == 1,
                onClick = { selectedTab = 1 },
                text = { Text("Foto Mood", fontSize = 12.sp, fontWeight = FontWeight.Bold) },
                icon = { Icon(Icons.Default.PhotoCamera, contentDescription = null, modifier = Modifier.size(16.dp)) }
            )
            Tab(
                selected = selectedTab == 2,
                onClick = { selectedTab = 2 },
                text = { Text("Video", fontSize = 12.sp, fontWeight = FontWeight.Bold) },
                icon = { Icon(Icons.Default.Videocam, contentDescription = null, modifier = Modifier.size(16.dp)) }
            )
            Tab(
                selected = selectedTab == 3,
                onClick = { selectedTab = 3 },
                text = { Text("Desain", fontSize = 12.sp, fontWeight = FontWeight.Bold) },
                icon = { Icon(Icons.Default.DashboardCustomize, contentDescription = null, modifier = Modifier.size(16.dp)) }
            )
        }

        when (selectedTab) {
            0 -> AiCreatorTab()
            1 -> PhotoInspirationTab()
            2 -> VideoStoryboardTab()
            3 -> DesignMakerTab()
        }
    }
}

@Composable
fun AiCreatorTab() {
    val aiResult by EventRepository.aiDraftResult.collectAsState()
    val invitation by EventRepository.invitation.collectAsState()
    val context = LocalContext.current

    var promptInput by remember { mutableStateOf("") }
    var isGenerating by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(bottom = 40.dp)
    ) {
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
                        .padding(18.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .background(Color(0xFFEDE9FE), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = PurplePrimary, modifier = Modifier.size(18.dp))
                        }
                        Text("AI Event Concept Studio", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "Masukkan ide atau konsep pernikahan Anda, dan AI akan meracik tema estetika, palet warna, tipografi, narasi kata pembuka, serta panduan foto.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MutedText
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = promptInput,
                        onValueChange = { promptInput = it },
                        placeholder = { Text("Contoh: Pernikahan adat Sunda modern tema taman malam elegan...") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2,
                        shape = RoundedCornerShape(12.dp)
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Button(
                        onClick = {
                            isGenerating = true
                            EventRepository.generateAiConcept(promptInput)
                            isGenerating = false
                            Toast.makeText(context, "Konsep baru berhasil diracik!", Toast.LENGTH_SHORT).show()
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Generate Konsep Kreatif", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        if (aiResult != null) {
            val result = aiResult!!
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
                            .padding(18.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Surface(
                            shape = RoundedCornerShape(50),
                            color = Color(0xFFEDE9FE)
                        ) {
                            Text(
                                text = "REKOMENDASI AI",
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = PurplePrimary
                            )
                        }

                        Text(result.themeTitle, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)

                        Divider()

                        Text("Palet Warna Harmonis:", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            result.palette.forEach { colorName ->
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = Color(0xFFF1F5F9),
                                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0))
                                ) {
                                    Text(
                                        text = colorName,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                        style = MaterialTheme.typography.labelSmall,
                                        fontWeight = FontWeight.Medium
                                    )
                                }
                            }
                        }

                        Divider()

                        Text("Kombinasi Tipografi:", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text(result.typography, style = MaterialTheme.typography.bodyMedium, color = InkDark)

                        Divider()

                        Text("Narasi / Copywriting Undangan:", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = Color(0xFFF8FAFC),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = "\"${result.copywriting}\"",
                                modifier = Modifier.padding(12.dp),
                                style = MaterialTheme.typography.bodyMedium,
                                color = InkDark
                            )
                        }

                        Button(
                            onClick = {
                                EventRepository.updateInvitation(
                                    invitation.copy(opening = result.copywriting)
                                )
                                Toast.makeText(context, "Narasi AI diterapkan ke undangan digital!", Toast.LENGTH_SHORT).show()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = EmeraldSuccess),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Default.Check, contentDescription = null)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Terapkan Narasi Ini ke Undangan", fontWeight = FontWeight.Bold)
                        }

                        Divider()

                        Text("Panduan Arah Fotografi & Suasana:", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text(result.photoDirection, style = MaterialTheme.typography.bodySmall, color = MutedText)
                    }
                }
            }
        }
    }
}

@Composable
fun PhotoInspirationTab() {
    var selectedCategory by remember { mutableStateOf("All") }
    val categories = listOf("All", "Dresses", "Flowers", "Rings", "Cakes", "Invitations")

    val items = if (selectedCategory == "All") {
        SampleData.INSPIRATIONS
    } else {
        SampleData.INSPIRATIONS.filter { it.category.equals(selectedCategory, ignoreCase = true) }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text("Galeri Inspirasi & Moodboard", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        Text("Koleksi kurasi gaun, floral, cincin, dan tata dekorasi pernikahan.", style = MaterialTheme.typography.bodySmall, color = MutedText)

        Spacer(modifier = Modifier.height(10.dp))

        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            contentPadding = PaddingValues(vertical = 4.dp)
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

        Spacer(modifier = Modifier.height(10.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(14.dp),
            contentPadding = PaddingValues(bottom = 40.dp)
        ) {
            items(items) { insp ->
                val gradient = insp.gradientColors.map { Color(it) }
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp)
                                .background(Brush.linearGradient(gradient))
                                .padding(14.dp),
                            contentAlignment = Alignment.BottomStart
                        ) {
                            Surface(
                                shape = RoundedCornerShape(50),
                                color = Color.Black.copy(alpha = 0.5f)
                            ) {
                                Text(
                                    text = insp.category.uppercase(),
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                    style = MaterialTheme.typography.labelSmall,
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp)
                        ) {
                            Text(insp.title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(insp.description, style = MaterialTheme.typography.bodySmall, color = MutedText)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun VideoStoryboardTab() {
    val formats = listOf(
        Triple("Reels & TikTok (9:16)", "Vertikal Fullscreen • Durasi 30-60 Detik", "Ideal untuk teaser akad, transisi busana kebaya, dan cinematic highlight."),
        Triple("Landscape Cinematic (16:9)", "Format Sinema • Durasi 3-5 Menit", "Dokumentasi komprehensif akad nikah, ijab qabul, prosesi sungkeman, dan resepsi."),
        Triple("Feed Post (1:1 / 4:5)", "Square Carousel • Durasi 1 Menit", "Highlight singkat momen sakral untuk dibagikan di feed Instagram/sosial media.")
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        contentPadding = PaddingValues(bottom = 40.dp)
    ) {
        item {
            Text("Video Studio & Panduan Sinematik", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text("Format dan konsep sinematik untuk tim videografer acara Anda.", style = MaterialTheme.typography.bodySmall, color = MutedText)
        }

        items(formats) { (title, subtitle, desc) ->
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
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .background(Color(0xFFEDE9FE), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Videocam, contentDescription = null, tint = PurplePrimary)
                        }
                        Column {
                            Text(title, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Text(subtitle, style = MaterialTheme.typography.labelSmall, color = PurplePrimary)
                        }
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(desc, style = MaterialTheme.typography.bodySmall, color = MutedText)
                }
            }
        }
    }
}

@Composable
fun DesignMakerTab() {
    val items = listOf(
        Pair("Welcome Sign Akrilik (A1 / 60x80cm)", "Papan selamat datang elegan dengan aksen bunga segar di pintu masuk ballroom."),
        Pair("Seating Chart / Denah Tamu (A2)", "Daftar susunan meja untuk tamu VIP, keluarga mempelai, dan rekan kantor."),
        Pair("Nomor Meja Eksklusif (Table Numbers)", "Desain nomor meja berpadu foil emas untuk memudahkan usher memandu tamu."),
        Pair("Tag Souvenir & Kartu Terima Kasih", "Ucapan terima kasih berukuran 5x9cm yang disematkan pada bingkisan souvenir.")
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        contentPadding = PaddingValues(bottom = 40.dp)
    ) {
        item {
            Text("Design Maker Acara", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text("Kebutuhan cetak dan signage visual pelengkap hari bahagia.", style = MaterialTheme.typography.bodySmall, color = MutedText)
        }

        items(items) { (name, desc) ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .background(Color(0xFFFCE7F3), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.DesignServices, contentDescription = null, tint = PinkAccent)
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(name, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(desc, style = MaterialTheme.typography.bodySmall, color = MutedText)
                    }
                }
            }
        }
    }
}
