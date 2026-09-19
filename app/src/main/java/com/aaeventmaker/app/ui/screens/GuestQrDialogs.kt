package com.aaeventmaker.app.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
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
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.aaeventmaker.app.data.EventRepository
import com.aaeventmaker.app.data.Guest
import com.aaeventmaker.app.data.InvitationData
import com.aaeventmaker.app.ui.theme.*
import com.aaeventmaker.app.util.QrCodeUtil
import com.aaeventmaker.app.util.QrTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GuestQrGeneratorDialog(
    guest: Guest,
    invitation: InvitationData,
    onDismiss: () -> Unit,
    onCheckIn: (String) -> Unit,
    onPreviewWebLink: (Guest) -> Unit
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    val themes = QrCodeUtil.THEMES
    var selectedTheme by remember { mutableStateOf(themes[0]) } // Default to Purple Royale
    var selectedFormat by remember { mutableIntStateOf(0) } // 0: Web Link, 1: Compact Token

    val uniqueCheckInUrl = remember(guest.id, guest.checkInCode, invitation.slug) {
        guest.getCheckInUrl(invitation.slug)
    }

    val compactToken = remember(guest.id, guest.checkInCode) {
        "AA-PASS:${guest.checkInCode}:${guest.id}"
    }

    val qrContent = if (selectedFormat == 0) uniqueCheckInUrl else compactToken

    val qrImageBitmap = remember(qrContent, selectedTheme.id) {
        QrCodeUtil.generateQrImageBitmap(
            content = qrContent,
            size = 450,
            foregroundColor = selectedTheme.fgColor,
            backgroundColor = selectedTheme.bgColor
        )
    }

    val waMessage = remember(guest, invitation, uniqueCheckInUrl) {
        """
        Yth. ${guest.name},
        
        Dengan penuh rasa syukur, kami mengundang Anda untuk hadir pada perayaan:
        💍 *${invitation.title}*
        🗓️ ${invitation.date}
        ⏰ ${invitation.time}
        📍 ${invitation.venue}
        
        Berikut E-Pass & Tautan Check-In Mandiri resmi Anda:
        🔗 *Tautan Check-In:* $uniqueCheckInUrl
        🎫 *Kode Registrasi:* ${guest.checkInCode}
        🪑 *Alokasi Meja:* ${guest.tableNumber}
        👥 *Kuota Undangan:* ${guest.pax} Orang
        
        Mohon tunjukkan QR Code pada tautan di atas kepada resepsionis saat tiba di lokasi. Terima kasih!
        """.trimIndent()
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth(0.94f)
                .fillMaxHeight(0.92f),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxSize()
            ) {
                // Header Bar
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .background(Color(0xFFEDE9FE), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.QrCode, contentDescription = null, tint = PurplePrimary, modifier = Modifier.size(20.dp))
                        }
                        Column {
                            Text("QR Code Generator & Link", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Text("Check-In Pass Unik Tamu", style = MaterialTheme.typography.bodySmall, color = MutedText)
                        }
                    }

                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Tutup")
                    }
                }

                HorizontalDivider()

                LazyColumn(
                    modifier = Modifier
                        .weight(1f)
                        .padding(horizontal = 18.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                    contentPadding = PaddingValues(top = 14.dp, bottom = 20.dp)
                ) {
                    // Guest Identity Card
                    item {
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = Color(0xFFF8FAFC),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Surface(
                                        shape = RoundedCornerShape(50),
                                        color = PurpleLight
                                    ) {
                                        Text(
                                            text = guest.group.uppercase(),
                                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 3.dp),
                                            style = MaterialTheme.typography.labelSmall,
                                            fontWeight = FontWeight.Bold,
                                            color = PurplePrimary
                                        )
                                    }

                                    Surface(
                                        shape = RoundedCornerShape(8.dp),
                                        color = Color(0xFFEDE9FE),
                                        modifier = Modifier.clickable {
                                            clipboardManager.setText(AnnotatedString(guest.checkInCode))
                                            Toast.makeText(context, "Kode ${guest.checkInCode} disalin!", Toast.LENGTH_SHORT).show()
                                        }
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                                        ) {
                                            Icon(Icons.Default.Tag, contentDescription = null, tint = PurplePrimary, modifier = Modifier.size(13.dp))
                                            Text(guest.checkInCode, fontWeight = FontWeight.Bold, fontSize = 12.sp, color = PurplePrimary)
                                            Icon(Icons.Default.ContentCopy, contentDescription = null, tint = PurplePrimary, modifier = Modifier.size(12.dp))
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(8.dp))
                                Text(guest.name, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = InkDark)
                                Spacer(modifier = Modifier.height(4.dp))
                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text("Meja: ${guest.tableNumber}", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = InkDark)
                                    Text("• Kuota: ${guest.pax} Pax", fontSize = 13.sp, color = MutedText)
                                    if (guest.phone.isNotBlank()) {
                                        Text("• ${guest.phone}", fontSize = 13.sp, color = MutedText)
                                    }
                                }
                            }
                        }
                    }

                    // UNIQUE CHECK-IN LINK BOX
                    item {
                        Card(
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFFFAF5FF)),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE9D5FF)),
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
                                        Icon(Icons.Default.Link, contentDescription = null, tint = PurplePrimary, modifier = Modifier.size(16.dp))
                                        Text("Tautan Check-In Unik (Web URL):", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = PurplePrimary)
                                    }

                                    Surface(
                                        shape = RoundedCornerShape(50),
                                        color = EmeraldSuccess.copy(alpha = 0.15f)
                                    ) {
                                        Text(
                                            text = "HTTPS SSL SECURE",
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = EmeraldSuccess
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(8.dp))

                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = Color.White,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFDDD6FE)),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(
                                        text = uniqueCheckInUrl,
                                        modifier = Modifier.padding(10.dp),
                                        fontSize = 12.sp,
                                        color = InkDark,
                                        fontFamily = FontFamily.Monospace,
                                        maxLines = 2,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Button(
                                        onClick = {
                                            clipboardManager.setText(AnnotatedString(uniqueCheckInUrl))
                                            Toast.makeText(context, "Tautan Check-In untuk ${guest.name} berhasil disalin!", Toast.LENGTH_SHORT).show()
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary),
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(14.dp))
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text("Salin Tautan", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                    }

                                    OutlinedButton(
                                        onClick = { onPreviewWebLink(guest) },
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Icon(Icons.Default.OpenInBrowser, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text("Tes Buka Web", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }

                    // QR CODE DISPLAY & CUSTOMIZER
                    item {
                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text("Visualisasi QR Code E-Pass:", fontWeight = FontWeight.Bold, fontSize = 13.sp, modifier = Modifier.align(Alignment.Start))
                            Spacer(modifier = Modifier.height(8.dp))

                            // Format Toggle (URL vs Compact Token)
                            SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
                                SegmentedButton(
                                    selected = selectedFormat == 0,
                                    onClick = { selectedFormat = 0 },
                                    shape = SegmentedButtonDefaults.itemShape(index = 0, count = 2)
                                ) {
                                    Icon(Icons.Default.Link, contentDescription = null, modifier = Modifier.size(14.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Web Link URL", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                                SegmentedButton(
                                    selected = selectedFormat == 1,
                                    onClick = { selectedFormat = 1 },
                                    shape = SegmentedButtonDefaults.itemShape(index = 1, count = 2)
                                ) {
                                    Icon(Icons.Default.VpnKey, contentDescription = null, modifier = Modifier.size(14.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Compact Token", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // QR Frame Card
                            Card(
                                shape = RoundedCornerShape(20.dp),
                                colors = CardDefaults.cardColors(containerColor = Color(selectedTheme.bgColor)),
                                elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
                                border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFFE2E8F0)),
                                modifier = Modifier.padding(4.dp)
                            ) {
                                Column(
                                    modifier = Modifier.padding(16.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Surface(
                                        shape = RoundedCornerShape(50),
                                        color = if (selectedTheme.id == "dark_slate") Color.White.copy(alpha = 0.2f) else PurpleLight
                                    ) {
                                        Text(
                                            text = "AA EVENT PASS • ${guest.checkInCode}",
                                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 3.dp),
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (selectedTheme.id == "dark_slate") Color.White else PurplePrimary
                                        )
                                    }

                                    Spacer(modifier = Modifier.height(10.dp))

                                    Image(
                                        bitmap = qrImageBitmap,
                                        contentDescription = "QR Code Check-In Tamu",
                                        modifier = Modifier
                                            .size(200.dp)
                                            .clip(RoundedCornerShape(8.dp))
                                    )

                                    Spacer(modifier = Modifier.height(10.dp))

                                    Text(
                                        text = if (selectedFormat == 0) "Scan untuk membuka link check-in tamu" else "Scan langsung via Terminal Resepsionis",
                                        fontSize = 10.sp,
                                        color = if (selectedTheme.id == "dark_slate") Color(0xFF94A3B8) else MutedText,
                                        textAlign = TextAlign.Center
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Color Theme Selector
                            Text("Pilihan Gaya & Warna QR:", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.align(Alignment.Start))
                            Spacer(modifier = Modifier.height(6.dp))
                            LazyRow(
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                items(themes) { theme ->
                                    val isSelected = selectedTheme.id == theme.id
                                    Surface(
                                        shape = RoundedCornerShape(10.dp),
                                        color = if (isSelected) PurplePrimary else Color(0xFFF1F5F9),
                                        border = androidx.compose.foundation.BorderStroke(
                                            1.dp,
                                            if (isSelected) PurplePrimary else Color(0xFFCBD5E1)
                                        ),
                                        modifier = Modifier.clickable { selectedTheme = theme }
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                                        ) {
                                            Box(
                                                modifier = Modifier
                                                    .size(12.dp)
                                                    .background(Color(theme.fgColor), CircleShape)
                                                    .border(1.dp, Color.LightGray, CircleShape)
                                            )
                                            Text(
                                                text = theme.name,
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = if (isSelected) Color.White else InkDark
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // WHATSAPP SHARE GENERATOR
                    item {
                        Card(
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFFF0FDF4)),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFBBF7D0)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Icon(Icons.Default.Send, contentDescription = null, tint = Color(0xFF16A34A), modifier = Modifier.size(16.dp))
                                    Text("Broadcast WhatsApp / SMS Undangan:", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Color(0xFF166534))
                                }

                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    "Pesan personal berisi salam, nama tamu, no. meja, dan tautan check-in unik siap kirim.",
                                    fontSize = 11.sp,
                                    color = Color(0xFF15803D)
                                )

                                Spacer(modifier = Modifier.height(10.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Button(
                                        onClick = {
                                            val phoneClean = guest.phone.replace("[^0-9]".toRegex(), "")
                                            val targetPhone = if (phoneClean.startsWith("0")) "62" + phoneClean.drop(1) else phoneClean
                                            val uri = Uri.parse("https://api.whatsapp.com/send?phone=$targetPhone&text=${Uri.encode(waMessage)}")
                                            val intent = Intent(Intent.ACTION_VIEW, uri)
                                            try {
                                                context.startActivity(intent)
                                            } catch (e: Exception) {
                                                // Fallback to clipboard
                                                clipboardManager.setText(AnnotatedString(waMessage))
                                                Toast.makeText(context, "Pesan WA disalin ke clipboard!", Toast.LENGTH_SHORT).show()
                                            }
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF16A34A)),
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Icon(Icons.Default.Chat, contentDescription = null, modifier = Modifier.size(14.dp))
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text("Kirim WhatsApp", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }

                                    OutlinedButton(
                                        onClick = {
                                            clipboardManager.setText(AnnotatedString(waMessage))
                                            Toast.makeText(context, "Format pesan WA disalin!", Toast.LENGTH_SHORT).show()
                                        },
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(14.dp))
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text("Salin Pesan", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }
                }

                // Bottom Direct Action Bar
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.surface,
                    shadowElevation = 8.dp
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedButton(
                            onClick = onDismiss,
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Tutup")
                        }

                        if (guest.isCheckedIn) {
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = Color(0xFFDCFCE7),
                                modifier = Modifier.weight(1.4f)
                            ) {
                                Row(
                                    modifier = Modifier.padding(vertical = 10.dp, horizontal = 12.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.Center
                                ) {
                                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = EmeraldSuccess, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("Sudah Check-In (${guest.checkInTime ?: "OK"})", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = EmeraldSuccess)
                                }
                            }
                        } else {
                            Button(
                                onClick = {
                                    onCheckIn(guest.id)
                                    Toast.makeText(context, "${guest.name} berhasil check-in!", Toast.LENGTH_SHORT).show()
                                    onDismiss()
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = EmeraldSuccess),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.weight(1.4f)
                            ) {
                                Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Check-In Sekarang", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * Mobile Web Check-In Simulator
 * Displays the mobile browser landing page that opens when the guest scans or opens their unique check-in link.
 */
@Composable
fun GuestMobileWebCheckInDialog(
    guest: Guest,
    invitation: InvitationData,
    onDismiss: () -> Unit,
    onConfirmCheckIn: (String) -> Unit
) {
    val context = LocalContext.current
    var isCheckedInState by remember { mutableStateOf(guest.isCheckedIn) }
    var arrivalTime by remember { mutableStateOf(guest.checkInTime ?: "") }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .fillMaxHeight(0.88f),
            shape = RoundedCornerShape(26.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 10.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxSize()
            ) {
                // Simulated Mobile Browser Address Bar
                Surface(
                    color = Color(0xFF1E293B),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 14.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Surface(
                            shape = RoundedCornerShape(50),
                            color = Color(0xFF334155),
                            modifier = Modifier.weight(1f)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(Icons.Default.Lock, contentDescription = null, tint = EmeraldSuccess, modifier = Modifier.size(12.dp))
                                Text(
                                    text = "aaeventmaker.app/events/${invitation.slug}/checkin",
                                    color = Color(0xFFF1F5F9),
                                    fontSize = 11.sp,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }

                        IconButton(onClick = onDismiss, modifier = Modifier.size(28.dp)) {
                            Icon(Icons.Default.Close, contentDescription = "Tutup", tint = Color.White, modifier = Modifier.size(18.dp))
                        }
                    }
                }

                // Webpage Content
                LazyColumn(
                    modifier = Modifier
                        .weight(1f)
                        .padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    item {
                        Surface(
                            shape = RoundedCornerShape(50),
                            color = PurpleLight
                        ) {
                            Text(
                                text = "SELF CHECK-IN PORTAL",
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = PurplePrimary
                            )
                        }
                    }

                    item {
                        Text(
                            text = invitation.title,
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            textAlign = TextAlign.Center
                        )
                        Text(
                            text = "${invitation.date} • ${invitation.venue}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MutedText,
                            textAlign = TextAlign.Center
                        )
                    }

                    item {
                        HorizontalDivider()
                    }

                    // Guest Personalized Welcome
                    item {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(18.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (isCheckedInState) Color(0xFFECFDF5) else Color(0xFFF8FAFC)
                            ),
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                if (isCheckedInState) Color(0xFF86EFAC) else Color(0xFFE2E8F0)
                            )
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(18.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(54.dp)
                                        .background(
                                            if (isCheckedInState) EmeraldSuccess else PurplePrimary,
                                            CircleShape
                                        ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = if (isCheckedInState) Icons.Default.CheckCircle else Icons.Default.Person,
                                        contentDescription = null,
                                        tint = Color.White,
                                        modifier = Modifier.size(30.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.height(10.dp))
                                Text("Selamat Datang,", fontSize = 12.sp, color = MutedText)
                                Text(
                                    guest.name,
                                    style = MaterialTheme.typography.headlineSmall,
                                    fontWeight = FontWeight.Bold,
                                    textAlign = TextAlign.Center,
                                    color = InkDark
                                )

                                Spacer(modifier = Modifier.height(12.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceAround
                                ) {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text("Nomor Meja", fontSize = 11.sp, color = MutedText)
                                        Text(guest.tableNumber, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = PurplePrimary)
                                    }
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text("Kuota Tamu", fontSize = 11.sp, color = MutedText)
                                        Text("${guest.pax} Pax", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = InkDark)
                                    }
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text("Kode E-Pass", fontSize = 11.sp, color = MutedText)
                                        Text(guest.checkInCode, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = GoldAccent)
                                    }
                                }
                            }
                        }
                    }

                    // Check-In Status & Action
                    item {
                        if (isCheckedInState) {
                            Surface(
                                shape = RoundedCornerShape(16.dp),
                                color = Color(0xFFDCFCE7),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF86EFAC)),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(
                                    modifier = Modifier.padding(16.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Icon(Icons.Default.Verified, contentDescription = null, tint = EmeraldSuccess, modifier = Modifier.size(36.dp))
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text("Check-In Berhasil!", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color(0xFF166534))
                                    Text("Tercatat tiba: ${arrivalTime.ifEmpty { "Hari ini" }}", fontSize = 12.sp, color = Color(0xFF166534))
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text(
                                        "Terima kasih telah hadir! Silakan langsung menuju meja ${guest.tableNumber} yang telah disiapkan khusus untuk Anda.",
                                        fontSize = 11.sp,
                                        textAlign = TextAlign.Center,
                                        color = Color(0xFF15803D)
                                    )
                                }
                            }
                        } else {
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Button(
                                    onClick = {
                                        onConfirmCheckIn(guest.id)
                                        val updated = EventRepository.checkInGuest(guest.id)
                                        isCheckedInState = true
                                        arrivalTime = updated?.checkInTime ?: "Baru saja"
                                        Toast.makeText(context, "Selamat Datang! Check-In berhasil.", Toast.LENGTH_SHORT).show()
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldSuccess),
                                    shape = RoundedCornerShape(14.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(50.dp)
                                ) {
                                    Icon(Icons.Default.QrCodeScanner, contentDescription = null)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Konfirmasi Kehadiran Sekarang", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                }

                                Text(
                                    "Tekan tombol di atas saat tiba di pintu masuk venue untuk mengonfirmasi kehadiran tanpa antre.",
                                    fontSize = 11.sp,
                                    color = MutedText,
                                    textAlign = TextAlign.Center
                                )
                            }
                        }
                    }
                }

                // Close footer
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.surface,
                    shadowElevation = 6.dp
                ) {
                    Button(
                        onClick = onDismiss,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = InkDark)
                    ) {
                        Text("Tutup Simulasi Web")
                    }
                }
            }
        }
    }
}

/**
 * Batch QR & Links Hub Dialog
 * Allows viewing all guests' unique check-in links and copying them all at once.
 */
@Composable
fun BatchQrLinksDialog(
    guests: List<Guest>,
    invitation: InvitationData,
    onDismiss: () -> Unit,
    onSelectGuest: (Guest) -> Unit
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current
    var searchQuery by remember { mutableStateOf("") }

    val filtered = remember(guests, searchQuery) {
        if (searchQuery.isBlank()) guests else {
            guests.filter { it.name.contains(searchQuery, ignoreCase = true) || it.checkInCode.contains(searchQuery, ignoreCase = true) || it.tableNumber.contains(searchQuery, ignoreCase = true) }
        }
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth(0.94f)
                .fillMaxHeight(0.92f),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxSize()
            ) {
                // Top Header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Hub Tautan & QR Check-In", fontWeight = FontWeight.Bold, fontSize = 17.sp)
                        Text("${guests.size} Tamu Terdaftar • 100% Memiliki Tautan Unik", fontSize = 12.sp, color = MutedText)
                    }

                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Tutup")
                    }
                }

                HorizontalDivider()

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    // Search bar
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        placeholder = { Text("Cari nama tamu, kode, atau meja...") },
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Master Batch Copy Button
                    Button(
                        onClick = {
                            val batchText = buildString {
                                appendLine("=== DAFTAR TAUTAN CHECK-IN TAMU - ${invitation.title} ===")
                                guests.forEachIndexed { index, g ->
                                    appendLine("${index + 1}. ${g.name} (${g.pax} Pax) • Meja ${g.tableNumber}")
                                    appendLine("   Kode: ${g.checkInCode}")
                                    appendLine("   Link: ${g.getCheckInUrl(invitation.slug)}")
                                    appendLine()
                                }
                            }
                            clipboardManager.setText(AnnotatedString(batchText))
                            Toast.makeText(context, "Seluruh ${guests.size} tautan tamu disalin ke clipboard!", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Salin Semua Tautan Tamu (${guests.size} Tamu)", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    }
                }

                // Guest List with Check-In Links
                LazyColumn(
                    modifier = Modifier
                        .weight(1f)
                        .padding(horizontal = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    contentPadding = PaddingValues(bottom = 20.dp)
                ) {
                    items(filtered) { guest ->
                        val link = guest.getCheckInUrl(invitation.slug)
                        Surface(
                            shape = RoundedCornerShape(14.dp),
                            color = Color(0xFFF8FAFC),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(guest.name, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = InkDark)
                                        Text("Meja ${guest.tableNumber} • ${guest.pax} Pax • ${guest.group}", fontSize = 11.sp, color = MutedText)
                                    }

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
                                }

                                Spacer(modifier = Modifier.height(8.dp))

                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = Color.White,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0)),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(
                                        text = link,
                                        modifier = Modifier.padding(6.dp),
                                        fontSize = 10.sp,
                                        color = Color(0xFF64748B),
                                        fontFamily = FontFamily.Monospace,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                }

                                Spacer(modifier = Modifier.height(8.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.End,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    TextButton(
                                        onClick = {
                                            clipboardManager.setText(AnnotatedString(link))
                                            Toast.makeText(context, "Tautan untuk ${guest.name} disalin!", Toast.LENGTH_SHORT).show()
                                        },
                                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)
                                    ) {
                                        Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(14.dp), tint = PurplePrimary)
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("Salin Link", fontSize = 11.sp, color = PurplePrimary, fontWeight = FontWeight.Bold)
                                    }

                                    Spacer(modifier = Modifier.width(6.dp))

                                    FilledTonalButton(
                                        onClick = {
                                            onSelectGuest(guest)
                                            onDismiss()
                                        },
                                        shape = RoundedCornerShape(8.dp),
                                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 2.dp)
                                    ) {
                                        Icon(Icons.Default.QrCode, contentDescription = null, modifier = Modifier.size(14.dp))
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("Buka QR Pass", fontSize = 11.sp)
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
