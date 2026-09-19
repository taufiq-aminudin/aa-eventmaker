package com.aaeventmaker.app.ui.screens

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
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
import com.aaeventmaker.app.data.*
import com.aaeventmaker.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StudioScreen() {
    var selectedTab by remember { mutableIntStateOf(1) } // Default to 1: Edit Foto

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
                text = { Text("AI Creator", fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                icon = { Icon(Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(16.dp)) }
            )
            Tab(
                selected = selectedTab == 1,
                onClick = { selectedTab = 1 },
                text = { Text("Edit Foto", fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                icon = { Icon(Icons.Default.PhotoCamera, contentDescription = null, modifier = Modifier.size(16.dp)) }
            )
            Tab(
                selected = selectedTab == 2,
                onClick = { selectedTab = 2 },
                text = { Text("Edit Video", fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                icon = { Icon(Icons.Default.Videocam, contentDescription = null, modifier = Modifier.size(16.dp)) }
            )
            Tab(
                selected = selectedTab == 3,
                onClick = { selectedTab = 3 },
                text = { Text("Desain", fontSize = 11.sp, fontWeight = FontWeight.Bold) },
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

                        HorizontalDivider()

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

                        HorizontalDivider()

                        Text("Kombinasi Tipografi:", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text(result.typography, style = MaterialTheme.typography.bodyMedium, color = InkDark)

                        HorizontalDivider()

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

                        HorizontalDivider()

                        Text("Panduan Arah Fotografi & Suasana:", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text(result.photoDirection, style = MaterialTheme.typography.bodySmall, color = MutedText)
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PhotoInspirationTab() {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    val presets = SampleData.PHOTO_PRESETS
    var selectedPreset by remember { mutableStateOf(presets[1]) } // Golden Amber Glow
    var selectedCategory by remember { mutableStateOf("All") }
    val categories = listOf("All", "Dresses", "Flowers", "Design", "Rings", "Cakes")

    // Interactive adjustment sliders
    var exposureAdjustment by remember { mutableFloatStateOf(0f) }
    var warmthAdjustment by remember { mutableFloatStateOf(0f) }
    var contrastLevel by remember { mutableFloatStateOf(1.0f) }

    // Before / After comparison interaction
    val compareInteractionSource = remember { MutableInteractionSource() }
    val isComparingRaw by compareInteractionSource.collectIsPressedAsState()

    val items = if (selectedCategory == "All") {
        SampleData.INSPIRATIONS
    } else {
        SampleData.INSPIRATIONS.filter { it.category.equals(selectedCategory, ignoreCase = true) }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(bottom = 40.dp)
    ) {
        item {
            Column {
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
                        Icon(Icons.Default.PhotoFilter, contentDescription = null, tint = PurplePrimary, modifier = Modifier.size(18.dp))
                    }
                    Column {
                        Text("Template Visualisasi & Color Grading Foto", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Text("Preview realistis preset warna sinematik fine-art pernikahan", style = MaterialTheme.typography.bodySmall, color = MutedText)
                    }
                }
            }
        }

        // FEATURED REALISTIC PHOTO EDIT TEMPLATE VIEWER
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(22.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp)
                ) {
                    // Photo Preview with Live Realistic Color Grading LUT
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(280.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color.Black)
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.img_wedding_photo_template),
                            contentDescription = "Realistic Wedding Photo Edit Template",
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Crop
                        )

                        // Color Grade LUT simulation layer (hidden when user is comparing RAW)
                        if (!isComparingRaw) {
                            val tintColor = Color(selectedPreset.tintColorHex)
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .background(
                                        Brush.verticalGradient(
                                            listOf(
                                                tintColor.copy(alpha = (selectedPreset.tintAlpha * 0.8f + warmthAdjustment * 0.1f).coerceIn(0f, 0.8f)),
                                                tintColor.copy(alpha = (selectedPreset.tintAlpha * 1.2f + warmthAdjustment * 0.15f).coerceIn(0f, 0.8f))
                                            )
                                        )
                                    )
                            )
                        }

                        // Top Badges (Preset Name & Compare indicator)
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                shape = RoundedCornerShape(50),
                                color = if (isComparingRaw) Color(0xFFDC2626) else Color.Black.copy(alpha = 0.65f)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Icon(
                                        imageVector = if (isComparingRaw) Icons.Default.VisibilityOff else Icons.Default.AutoFixHigh,
                                        contentDescription = null,
                                        tint = Color.White,
                                        modifier = Modifier.size(14.dp)
                                    )
                                    Text(
                                        text = if (isComparingRaw) "RAW / ORIGINAL" else "LUT: ${selectedPreset.name.uppercase()}",
                                        color = Color.White,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }

                            Surface(
                                shape = RoundedCornerShape(50),
                                color = Color.Black.copy(alpha = 0.65f)
                            ) {
                                Text(
                                    text = "50mm f/1.4 • 1/250s • ISO 100",
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                    color = Color.White,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }

                        // Bottom Floating "Hold to Compare RAW" action
                        Surface(
                            modifier = Modifier
                                .align(Alignment.BottomEnd)
                                .padding(12.dp)
                                .clickable(
                                    interactionSource = compareInteractionSource,
                                    indication = null,
                                    onClick = {}
                                ),
                            shape = RoundedCornerShape(50),
                            color = if (isComparingRaw) Color(0xFFDC2626) else Color.Black.copy(alpha = 0.75f),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.4f))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(Icons.Default.Compare, contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp))
                                Text(
                                    text = if (isComparingRaw) "Melepas untuk LUT" else "Tekan untuk Bandingkan RAW",
                                    color = Color.White,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Preset Selector Row
                    Text("Pilihan Preset Color Grading (Fine Art):", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        contentPadding = PaddingValues(vertical = 4.dp)
                    ) {
                        items(presets) { preset ->
                            val isSelected = selectedPreset.id == preset.id
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = if (isSelected) PurplePrimary else Color(0xFFF1F5F9),
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp,
                                    if (isSelected) PurplePrimary else Color(0xFFE2E8F0)
                                ),
                                modifier = Modifier.clickable { selectedPreset = preset }
                            ) {
                                Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)) {
                                    Text(
                                        text = preset.name,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp,
                                        color = if (isSelected) Color.White else InkDark
                                    )
                                    Text(
                                        text = preset.toneTag,
                                        fontSize = 10.sp,
                                        color = if (isSelected) Color.White.copy(alpha = 0.8f) else MutedText
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Recipe Parameters Card
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color(0xFFF8FAFC),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Formula Lightroom (.XMP):",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = InkDark
                                )
                                TextButton(
                                    onClick = {
                                        val textToCopy = """
                                            [AA EVENT MAKER - PRESET ${selectedPreset.name}]
                                            Temp: ${selectedPreset.temp}
                                            Tint: ${selectedPreset.tint}
                                            Exposure: ${selectedPreset.exposure}
                                            Contrast: ${selectedPreset.contrast}
                                            Highlights: ${selectedPreset.highlights}
                                            Shadows: ${selectedPreset.shadows}
                                        """.trimIndent()
                                        clipboardManager.setText(AnnotatedString(textToCopy))
                                        Toast.makeText(context, "Formula preset ${selectedPreset.name} disalin!", Toast.LENGTH_SHORT).show()
                                    },
                                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)
                                ) {
                                    Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(14.dp), tint = PurplePrimary)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Salin Formula", fontSize = 11.sp, color = PurplePrimary, fontWeight = FontWeight.Bold)
                                }
                            }

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column {
                                    Text("Temp: ${selectedPreset.temp}", fontSize = 11.sp, color = MutedText)
                                    Text("Tint: ${selectedPreset.tint}", fontSize = 11.sp, color = MutedText)
                                }
                                Column {
                                    Text("Exposure: ${selectedPreset.exposure}", fontSize = 11.sp, color = MutedText)
                                    Text("Contrast: ${selectedPreset.contrast}", fontSize = 11.sp, color = MutedText)
                                }
                                Column {
                                    Text("Highlights: ${selectedPreset.highlights}", fontSize = 11.sp, color = MutedText)
                                    Text("Shadows: ${selectedPreset.shadows}", fontSize = 11.sp, color = MutedText)
                                }
                            }

                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = selectedPreset.description,
                                fontSize = 11.sp,
                                color = InkDark,
                                fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Micro adjustment sliders
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text("Warmth:", fontSize = 11.sp, fontWeight = FontWeight.Medium, modifier = Modifier.width(54.dp))
                        Slider(
                            value = warmthAdjustment,
                            onValueChange = { warmthAdjustment = it },
                            valueRange = -0.5f..0.5f,
                            modifier = Modifier.weight(1f)
                        )
                        IconButton(onClick = { warmthAdjustment = 0f }, modifier = Modifier.size(24.dp)) {
                            Icon(Icons.Default.RestartAlt, contentDescription = "Reset", modifier = Modifier.size(16.dp))
                        }
                    }
                }
            }
        }

        // MOODBOARD & INSPIRATION GALLERY
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Katalog Inspirasi & Moodboard", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Text("${items.size} Ide", fontSize = 12.sp, color = MutedText)
            }
        }

        item {
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
        }

        items(items) { insp ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column {
                    if (insp.drawableRes != null) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(160.dp)
                        ) {
                            Image(
                                painter = painterResource(id = insp.drawableRes),
                                contentDescription = insp.title,
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Crop
                            )
                            Surface(
                                modifier = Modifier
                                    .align(Alignment.BottomStart)
                                    .padding(12.dp),
                                shape = RoundedCornerShape(50),
                                color = Color.Black.copy(alpha = 0.6f)
                            ) {
                                Text(
                                    text = insp.category.uppercase(),
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                    style = MaterialTheme.typography.labelSmall,
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    } else {
                        val gradient = insp.gradientColors.map { Color(it) }
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
                    }

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp)
                    ) {
                        Text(insp.title, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(insp.description, style = MaterialTheme.typography.bodySmall, color = MutedText)
                    }
                }
            }
        }
    }
}

@Composable
fun VideoStoryboardTab() {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    val videoTemplates = SampleData.VIDEO_TEMPLATES
    var selectedVideoIndex by remember { mutableIntStateOf(0) } // 0: 9:16 Reels, 1: 16:9 Cinema
    val currentVideo = videoTemplates[selectedVideoIndex.coerceIn(0, videoTemplates.lastIndex)]

    var isPlaying by remember { mutableStateOf(false) }
    var currentBeatIndex by remember { mutableIntStateOf(0) }

    // Simulated playback progress
    var playbackProgress by remember { mutableFloatStateOf(0.42f) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(bottom = 40.dp)
    ) {
        item {
            Column {
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
                        Icon(Icons.Default.Movie, contentDescription = null, tint = PurplePrimary, modifier = Modifier.size(18.dp))
                    }
                    Column {
                        Text("Template Visualisasi & Storyboard Video", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Text("Panduan sinematik, rasio video, beat musik, dan arahan kamera", style = MaterialTheme.typography.bodySmall, color = MutedText)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Video Format Selector
                SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
                    SegmentedButton(
                        selected = selectedVideoIndex == 0,
                        onClick = {
                            selectedVideoIndex = 0
                            currentBeatIndex = 0
                        },
                        shape = SegmentedButtonDefaults.itemShape(index = 0, count = 2)
                    ) {
                        Icon(Icons.Default.PhoneAndroid, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Reels 9:16", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                    SegmentedButton(
                        selected = selectedVideoIndex == 1,
                        onClick = {
                            selectedVideoIndex = 1
                            currentBeatIndex = 0
                        },
                        shape = SegmentedButtonDefaults.itemShape(index = 1, count = 2)
                    ) {
                        Icon(Icons.Default.Tv, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Cinema 16:9", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // REALISTIC VIDEO FRAME VISUALIZER
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(22.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp)
                ) {
                    if (selectedVideoIndex == 0) {
                        // 9:16 VERTICAL REELS MOCKUP
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(380.dp)
                                .clip(RoundedCornerShape(18.dp))
                                .background(Color.Black)
                        ) {
                            Image(
                                painter = painterResource(id = R.drawable.img_video_reels_template),
                                contentDescription = "Reels Video Template Frame",
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Crop
                            )

                            // Subtle dark gradient for readability
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .background(
                                        Brush.verticalGradient(
                                            listOf(
                                                Color.Black.copy(alpha = 0.4f),
                                                Color.Transparent,
                                                Color.Black.copy(alpha = 0.75f)
                                            )
                                        )
                                    )
                            )

                            // Reels Top Header
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(14.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Surface(
                                    shape = RoundedCornerShape(50),
                                    color = Color.Black.copy(alpha = 0.6f)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(8.dp)
                                                .background(Color.Red, CircleShape)
                                        )
                                        Text("REELS • 9:16", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                    }
                                }

                                Surface(
                                    shape = RoundedCornerShape(50),
                                    color = Color.Black.copy(alpha = 0.6f)
                                ) {
                                    Text(
                                        text = currentVideo.duration,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                        color = Color.White,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Medium
                                    )
                                }
                            }

                            // Center Play / Pause toggle
                            IconButton(
                                onClick = { isPlaying = !isPlaying },
                                modifier = Modifier
                                    .align(Alignment.Center)
                                    .size(54.dp)
                                    .background(Color.Black.copy(alpha = 0.5f), CircleShape)
                            ) {
                                Icon(
                                    imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                                    contentDescription = "Play/Pause",
                                    tint = Color.White,
                                    modifier = Modifier.size(32.dp)
                                )
                            }

                            // Right Side Action Bar (Mockup Instagram/TikTok)
                            Column(
                                modifier = Modifier
                                    .align(Alignment.BottomEnd)
                                    .padding(end = 12.dp, bottom = 64.dp),
                                verticalArrangement = Arrangement.spacedBy(14.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(Icons.Default.Favorite, contentDescription = null, tint = Color.White, modifier = Modifier.size(24.dp))
                                    Text("4.8k", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                }
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(Icons.Default.ChatBubble, contentDescription = null, tint = Color.White, modifier = Modifier.size(22.dp))
                                    Text("320", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                }
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(Icons.Default.Bookmark, contentDescription = null, tint = Color.White, modifier = Modifier.size(22.dp))
                                    Text("890", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                }
                            }

                            // Bottom Caption & Audio Pill
                            Column(
                                modifier = Modifier
                                    .align(Alignment.BottomStart)
                                    .padding(start = 14.dp, bottom = 14.dp, end = 60.dp)
                            ) {
                                Text(
                                    text = "@aaeventmaker • Official Wedding Teaser",
                                    color = Color.White,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "Momen sakral janji suci Andi & Ayu dengan busana adat Sunda modern.",
                                    color = Color.White.copy(alpha = 0.9f),
                                    fontSize = 11.sp,
                                    maxLines = 1
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Surface(
                                    shape = RoundedCornerShape(50),
                                    color = Color.White.copy(alpha = 0.25f)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                                    ) {
                                        Icon(Icons.Default.MusicNote, contentDescription = null, tint = Color.White, modifier = Modifier.size(12.dp))
                                        Text(
                                            text = "${currentVideo.musicStyle} (${currentVideo.bpm})",
                                            color = Color.White,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Medium
                                        )
                                    }
                                }
                            }
                        }
                    } else {
                        // 16:9 WIDESCREEN CINEMATIC MOCKUP
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(210.dp)
                                .clip(RoundedCornerShape(18.dp))
                                .background(Color.Black)
                        ) {
                            Image(
                                painter = painterResource(id = R.drawable.img_video_cinema_template),
                                contentDescription = "Cinematic 16:9 Video Template Frame",
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Crop
                            )

                            // Top & Bottom Cinematic Letterbox Widescreen Bars
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(18.dp)
                                    .background(Color.Black)
                                    .align(Alignment.TopCenter)
                            )
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(18.dp)
                                    .background(Color.Black)
                                    .align(Alignment.BottomCenter)
                            )

                            // Cinema Camera HUD Overlay
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 14.dp, vertical = 22.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(10.dp)
                                            .background(Color.Red, CircleShape)
                                    )
                                    Text("REC", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.ExtraBold)
                                    Text("00:02:14:18", color = Color(0xFFFBBF24), fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                                }

                                Text("24.00 FPS • 4K DCI • ARRI LOG-C", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            }

                            // Center Play / Pause toggle
                            IconButton(
                                onClick = { isPlaying = !isPlaying },
                                modifier = Modifier
                                    .align(Alignment.Center)
                                    .size(48.dp)
                                    .background(Color.Black.copy(alpha = 0.5f), CircleShape)
                            ) {
                                Icon(
                                    imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                                    contentDescription = "Play/Pause",
                                    tint = Color.White,
                                    modifier = Modifier.size(28.dp)
                                )
                            }

                            // Bottom Subtitle & Audio Track
                            Text(
                                text = "“Dua hati, satu janji suci di bawah indahnya temaram malam.”",
                                color = Color.White,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Medium,
                                textAlign = TextAlign.Center,
                                modifier = Modifier
                                    .align(Alignment.BottomCenter)
                                    .padding(bottom = 24.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Video Specifications Badge Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color(0xFFEDE9FE)
                        ) {
                            Text(
                                text = "Kamera: ${currentVideo.cameraGear}",
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = PurplePrimary
                            )
                        }
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color(0xFFFEF3C7)
                        ) {
                            Text(
                                text = "LUT: ${currentVideo.colorLut}",
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFFB45309)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = currentVideo.description,
                        style = MaterialTheme.typography.bodySmall,
                        color = MutedText
                    )
                }
            }
        }

        // SCENE STORYBOARD BEAT TIMELINE
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Daftar Shot & Timeline Adegan (Storyboard)", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                TextButton(
                    onClick = {
                        val fullPlan = buildString {
                            appendLine("STORYBOARD VIDEO: ${currentVideo.title}")
                            appendLine("Format: ${currentVideo.format} | Durasi: ${currentVideo.duration}")
                            appendLine("Gear: ${currentVideo.cameraGear}")
                            appendLine("Music: ${currentVideo.musicStyle} (${currentVideo.bpm})")
                            appendLine("LUT: ${currentVideo.colorLut}")
                            appendLine("---")
                            currentVideo.sceneBeats.forEachIndexed { i, beat ->
                                appendLine("${i + 1}. [${beat.timestamp}] ${beat.action} | Shot: ${beat.shotType} | Transisi: ${beat.transition}")
                            }
                        }
                        clipboardManager.setText(AnnotatedString(fullPlan))
                        Toast.makeText(context, "Shotlist storyboard disalin untuk videografer!", Toast.LENGTH_SHORT).show()
                    }
                ) {
                    Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(14.dp), tint = PurplePrimary)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Bagikan Shotlist", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = PurplePrimary)
                }
            }
        }

        itemsIndexed(currentVideo.sceneBeats) { index, beat ->
            val isSelectedBeat = currentBeatIndex == index
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { currentBeatIndex = index },
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (isSelectedBeat) Color(0xFFF3E8FF) else MaterialTheme.colorScheme.surface
                ),
                border = if (isSelectedBeat) androidx.compose.foundation.BorderStroke(1.5.dp, PurplePrimary) else null,
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Beat Number Badge
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .background(
                                if (isSelectedBeat) PurplePrimary else Color(0xFFE2E8F0),
                                CircleShape
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "${index + 1}",
                            color = if (isSelectedBeat) Color.White else InkDark,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(
                                text = beat.timestamp,
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                color = PurplePrimary
                            )
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = Color(0xFFEDE9FE)
                            ) {
                                Text(
                                    text = beat.shotType,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = beat.action,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = InkDark
                        )

                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Transisi: ${beat.transition}",
                            fontSize = 11.sp,
                            color = MutedText
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun DesignMakerTab() {
    val context = LocalContext.current
    val currentProject by EventRepository.currentProject.collectAsState()
    val invitation by EventRepository.invitation.collectAsState()

    var customCoupleName by remember { mutableStateOf(invitation.hosts.ifEmpty { "Andi & Ayu" }) }
    var customEventDate by remember { mutableStateOf(invitation.date.ifEmpty { "24 Oktober 2026" }) }

    val items = listOf(
        Pair("Welcome Sign Akrilik (A1 / 60x80cm)", "Papan selamat datang transparan elegan dengan aksen bunga segar di pintu masuk ballroom."),
        Pair("Seating Chart / Denah Tamu (A2)", "Daftar susunan meja untuk tamu VIP, keluarga mempelai, dan rekan kantor."),
        Pair("Nomor Meja Eksklusif (Table Numbers)", "Desain nomor meja berpadu foil emas untuk memudahkan usher memandu tamu."),
        Pair("Tag Souvenir & Kartu Terima Kasih", "Ucapan terima kasih berukuran 5x9cm yang disematkan pada bingkisan souvenir.")
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(bottom = 40.dp)
    ) {
        item {
            Column {
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
                        Icon(Icons.Default.DashboardCustomize, contentDescription = null, tint = PinkAccent, modifier = Modifier.size(18.dp))
                    }
                    Column {
                        Text("Design Maker & Signage Acara", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Text("Preview realistis cetak signage akrilik dan kebutuhan visual venue", style = MaterialTheme.typography.bodySmall, color = MutedText)
                    }
                }
            }
        }

        // REALISTIC ACRYLIC SIGNAGE PREVIEW
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(22.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(260.dp)
                            .clip(RoundedCornerShape(16.dp))
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.img_design_sign_template),
                            contentDescription = "Realistic Acrylic Signage Template",
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Crop
                        )

                        // Acrylic Glass overlay reflection with live couple names
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(
                                    Brush.radialGradient(
                                        colors = listOf(Color.White.copy(alpha = 0.2f), Color.Transparent),
                                        radius = 350f
                                    )
                                )
                        )

                        // Center customized signage text on top of the easel
                        Column(
                            modifier = Modifier
                                .align(Alignment.Center)
                                .padding(16.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "WELCOME TO THE WEDDING OF",
                                fontSize = 10.sp,
                                letterSpacing = 2.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFFB45309),
                                textAlign = TextAlign.Center
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = customCoupleName,
                                fontSize = 22.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color(0xFF78350F),
                                textAlign = TextAlign.Center
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = customEventDate,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Color(0xFF92400E),
                                textAlign = TextAlign.Center
                            )
                        }

                        Surface(
                            modifier = Modifier
                                .align(Alignment.BottomStart)
                                .padding(10.dp),
                            shape = RoundedCornerShape(50),
                            color = Color.Black.copy(alpha = 0.65f)
                        ) {
                            Text(
                                text = "A1 Acrylic 3mm • Gold Foil",
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                color = Color.White,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text("Kustomisasi Teks Signage:", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedTextField(
                            value = customCoupleName,
                            onValueChange = { customCoupleName = it },
                            label = { Text("Nama Mempelai") },
                            modifier = Modifier.weight(1f),
                            singleLine = true,
                            shape = RoundedCornerShape(10.dp)
                        )
                        OutlinedTextField(
                            value = customEventDate,
                            onValueChange = { customEventDate = it },
                            label = { Text("Tanggal") },
                            modifier = Modifier.weight(1f),
                            singleLine = true,
                            shape = RoundedCornerShape(10.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Button(
                        onClick = {
                            Toast.makeText(context, "Desain Signage siap diekspor ke format cetak A1!", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.Print, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Export High-Res PDF Siap Cetak (A1)", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // OTHER PRINT ASSETS LIST
        item {
            Text("Daftar Kebutuhan Visual Cetak Lainnya", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
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
                        Text(name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(desc, style = MaterialTheme.typography.bodySmall, color = MutedText)
                    }
                }
            }
        }
    }
}
