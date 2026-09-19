package com.aaeventmaker.app.ui.screens

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.aaeventmaker.app.data.EventProject
import com.aaeventmaker.app.data.Guest
import com.aaeventmaker.app.data.InvitationData
import com.aaeventmaker.app.ui.theme.*
import com.aaeventmaker.app.util.ExportResult
import com.aaeventmaker.app.util.GuestExportFilter
import com.aaeventmaker.app.util.GuestReportExporter
import com.aaeventmaker.app.util.ReportFormat
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExportReportDialog(
    guests: List<Guest>,
    invitation: InvitationData,
    project: EventProject?,
    onDismiss: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var selectedFormat by remember { mutableStateOf(ReportFormat.PDF) }
    var selectedFilter by remember { mutableStateOf(GuestExportFilter.ALL) }
    var isGenerating by remember { mutableStateOf(false) }
    var exportResult by remember { mutableStateOf<ExportResult?>(null) }

    val checkedInCount = remember(guests) { guests.count { it.isCheckedIn } }
    val confirmedCount = remember(guests) { guests.count { it.rsvpStatus.equals("Confirmed", ignoreCase = true) } }
    val pendingCount = remember(guests) {
        guests.count {
            it.rsvpStatus.equals("Pending", ignoreCase = true) ||
            it.rsvpStatus.equals("Maybe", ignoreCase = true) ||
            it.rsvpStatus.isBlank()
        }
    }

    val filteredCount = remember(guests, selectedFilter) {
        when (selectedFilter) {
            GuestExportFilter.ALL -> guests.size
            GuestExportFilter.CHECKED_IN -> checkedInCount
            GuestExportFilter.CONFIRMED -> confirmedCount
            GuestExportFilter.PENDING -> pendingCount
            GuestExportFilter.DECLINED -> guests.count { it.rsvpStatus.equals("Declined", ignoreCase = true) }
        }
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth(0.94f)
                .fillMaxHeight(0.88f),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
            ) {
                // Dialog Top Header
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
                            shape = CircleShape,
                            color = Color(0xFFEFF6FF)
                        ) {
                            Icon(
                                Icons.Default.FileDownload,
                                contentDescription = null,
                                tint = Color(0xFF2563EB),
                                modifier = Modifier
                                    .padding(8.dp)
                                    .size(22.dp)
                            )
                        }
                        Column {
                            Text(
                                "Ekspor Laporan Tamu",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = InkDark
                            )
                            Text(
                                "Unduh rekapitulasi kehadiran & RSVP",
                                fontSize = 12.sp,
                                color = MutedText
                            )
                        }
                    }

                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Tutup", tint = MutedText)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))
                Divider(color = Color(0xFFF1F5F9))
                Spacer(modifier = Modifier.height(14.dp))

                // Scrollable Content
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    // Success Result Banner if exported
                    AnimatedVisibility(visible = exportResult != null) {
                        exportResult?.let { res ->
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = Color(0xFFF0FDF4)),
                                border = BorderStroke(1.2.dp, Color(0xFF86EFAC))
                            ) {
                                Column(modifier = Modifier.padding(14.dp)) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        Icon(
                                            Icons.Default.CheckCircle,
                                            contentDescription = null,
                                            tint = Color(0xFF16A34A),
                                            modifier = Modifier.size(20.dp)
                                        )
                                        Text(
                                            "Laporan Berhasil Dibuat!",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 14.sp,
                                            color = Color(0xFF15803D)
                                        )
                                    }

                                    Spacer(modifier = Modifier.height(6.dp))

                                    Text(
                                        res.fileName,
                                        fontWeight = FontWeight.SemiBold,
                                        fontSize = 12.sp,
                                        color = InkDark
                                    )

                                    val fileSizeKb = (res.file.length() / 1024).coerceAtLeast(1)
                                    Text(
                                        "Ukuran berkas: $fileSizeKb KB • Tersimpan di ${res.downloadPath ?: "Penyimpanan Aplikasi"}",
                                        fontSize = 11.sp,
                                        color = MutedText
                                    )

                                    Spacer(modifier = Modifier.height(12.dp))

                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        OutlinedButton(
                                            onClick = { GuestReportExporter.openReport(context, res) },
                                            shape = RoundedCornerShape(10.dp),
                                            modifier = Modifier.weight(1f),
                                            colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF15803D)),
                                            border = BorderStroke(1.dp, Color(0xFF86EFAC)),
                                            contentPadding = PaddingValues(vertical = 8.dp)
                                        ) {
                                            Icon(Icons.Default.OpenInNew, contentDescription = null, modifier = Modifier.size(15.dp))
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text("Buka File", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                        }

                                        Button(
                                            onClick = { GuestReportExporter.shareReport(context, res) },
                                            shape = RoundedCornerShape(10.dp),
                                            modifier = Modifier.weight(1f),
                                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF16A34A)),
                                            contentPadding = PaddingValues(vertical = 8.dp)
                                        ) {
                                            Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(15.dp))
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text("Bagikan", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Section 1: Choose Format
                    Text(
                        "1. Pilih Format Laporan",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = InkDark
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        // PDF Option Card
                        Card(
                            modifier = Modifier
                                .weight(1f)
                                .clickable {
                                    selectedFormat = ReportFormat.PDF
                                    exportResult = null
                                },
                            shape = RoundedCornerShape(14.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (selectedFormat == ReportFormat.PDF) Color(0xFFFEF2F2) else Color(0xFFF8FAFC)
                            ),
                            border = BorderStroke(
                                if (selectedFormat == ReportFormat.PDF) 1.8.dp else 1.dp,
                                if (selectedFormat == ReportFormat.PDF) Color(0xFFEF4444) else Color(0xFFE2E8F0)
                            )
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Surface(
                                        shape = RoundedCornerShape(8.dp),
                                        color = if (selectedFormat == ReportFormat.PDF) Color(0xFFFEE2E2) else Color(0xFFF1F5F9)
                                    ) {
                                        Icon(
                                            Icons.Default.PictureAsPdf,
                                            contentDescription = null,
                                            tint = Color(0xFFDC2626),
                                            modifier = Modifier.padding(6.dp).size(20.dp)
                                        )
                                    }

                                    RadioButton(
                                        selected = selectedFormat == ReportFormat.PDF,
                                        onClick = {
                                            selectedFormat = ReportFormat.PDF
                                            exportResult = null
                                        },
                                        colors = RadioButtonDefaults.colors(selectedColor = Color(0xFFDC2626))
                                    )
                                }

                                Spacer(modifier = Modifier.height(8.dp))
                                Text("Laporan PDF", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = InkDark)
                                Text("Dokumen cetak A4 siap print dengan kop acara, ringkasan visual, & tabel.", fontSize = 11.sp, color = MutedText, lineHeight = 15.sp)
                            }
                        }

                        // Excel / CSV Option Card
                        Card(
                            modifier = Modifier
                                .weight(1f)
                                .clickable {
                                    selectedFormat = ReportFormat.EXCEL_CSV
                                    exportResult = null
                                },
                            shape = RoundedCornerShape(14.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (selectedFormat == ReportFormat.EXCEL_CSV) Color(0xFFF0FDF4) else Color(0xFFF8FAFC)
                            ),
                            border = BorderStroke(
                                if (selectedFormat == ReportFormat.EXCEL_CSV) 1.8.dp else 1.dp,
                                if (selectedFormat == ReportFormat.EXCEL_CSV) Color(0xFF10B981) else Color(0xFFE2E8F0)
                            )
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Surface(
                                        shape = RoundedCornerShape(8.dp),
                                        color = if (selectedFormat == ReportFormat.EXCEL_CSV) Color(0xFFDCFCE7) else Color(0xFFF1F5F9)
                                    ) {
                                        Icon(
                                            Icons.Default.TableChart,
                                            contentDescription = null,
                                            tint = Color(0xFF16A34A),
                                            modifier = Modifier.padding(6.dp).size(20.dp)
                                        )
                                    }

                                    RadioButton(
                                        selected = selectedFormat == ReportFormat.EXCEL_CSV,
                                        onClick = {
                                            selectedFormat = ReportFormat.EXCEL_CSV
                                            exportResult = null
                                        },
                                        colors = RadioButtonDefaults.colors(selectedColor = Color(0xFF16A34A))
                                    )
                                }

                                Spacer(modifier = Modifier.height(8.dp))
                                Text("Excel / CSV", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = InkDark)
                                Text("Data spreadsheet lengkap untuk Microsoft Excel & Google Sheets (UTF-8).", fontSize = 11.sp, color = MutedText, lineHeight = 15.sp)
                            }
                        }
                    }

                    // Section 2: Filter Data
                    Text(
                        "2. Cakupan Tamu yang Diekspor",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = InkDark
                    )

                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        val filterOptions = listOf(
                            GuestExportFilter.ALL to "Semua Tamu (${guests.size} Tamu)",
                            GuestExportFilter.CHECKED_IN to "Sudah Hadir ($checkedInCount Tamu)",
                            GuestExportFilter.CONFIRMED to "Terkonfirmasi Hadir ($confirmedCount Tamu)",
                            GuestExportFilter.PENDING to "Belum Konfirmasi / Pending ($pendingCount Tamu)"
                        )

                        filterOptions.forEach { (filter, label) ->
                            val isSelected = selectedFilter == filter
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = if (isSelected) Color(0xFFEFF6FF) else Color(0xFFF8FAFC),
                                border = BorderStroke(
                                    1.dp,
                                    if (isSelected) Color(0xFF3B82F6) else Color(0xFFE2E8F0)
                                ),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        selectedFilter = filter
                                        exportResult = null
                                    }
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        label,
                                        fontSize = 12.sp,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                        color = if (isSelected) Color(0xFF1E40AF) else InkDark
                                    )
                                    RadioButton(
                                        selected = isSelected,
                                        onClick = {
                                            selectedFilter = filter
                                            exportResult = null
                                        },
                                        colors = RadioButtonDefaults.colors(selectedColor = Color(0xFF2563EB)),
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }
                        }
                    }

                    // Section 3: Summary Preview Card
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFF8FAFC)),
                        border = BorderStroke(1.dp, Color(0xFFE2E8F0))
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("Detail Informasi yang Masuk Laporan:", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = InkDark)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                "• Nama lengkap tamu, grup/kategori, dan nomor meja\n" +
                                "• Jumlah pax per tamu & status RSVP aktual\n" +
                                "• Status kehadiran & waktu presensi check-in\n" +
                                "• Kode unik E-Pass & tautan undangan digital",
                                fontSize = 11.sp,
                                color = MutedText,
                                lineHeight = 16.sp
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Bottom Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Tutup", color = InkDark)
                    }

                    Button(
                        onClick = {
                            if (filteredCount == 0) {
                                Toast.makeText(context, "Tidak ada data tamu pada filter ini", Toast.LENGTH_SHORT).show()
                                return@Button
                            }

                            isGenerating = true
                            coroutineScope.launch {
                                val result = withContext(Dispatchers.IO) {
                                    when (selectedFormat) {
                                        ReportFormat.PDF -> GuestReportExporter.generatePdfReport(
                                            context = context,
                                            guests = guests,
                                            invitation = invitation,
                                            project = project,
                                            filter = selectedFilter
                                        )
                                        ReportFormat.EXCEL_CSV -> GuestReportExporter.generateCsvReport(
                                            context = context,
                                            guests = guests,
                                            invitation = invitation,
                                            project = project,
                                            filter = selectedFilter
                                        )
                                    }
                                }
                                isGenerating = false
                                exportResult = result
                                Toast.makeText(
                                    context,
                                    "✓ Laporan ${if (selectedFormat == ReportFormat.PDF) "PDF" else "Excel"} berhasil digenerate!",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                        },
                        enabled = !isGenerating,
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (selectedFormat == ReportFormat.PDF) Color(0xFFDC2626) else Color(0xFF16A34A)
                        ),
                        modifier = Modifier.weight(1.8f)
                    ) {
                        if (isGenerating) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(16.dp),
                                color = Color.White,
                                strokeWidth = 2.dp
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Memproses...", fontSize = 12.sp)
                        } else {
                            Icon(
                                if (selectedFormat == ReportFormat.PDF) Icons.Default.PictureAsPdf else Icons.Default.TableChart,
                                contentDescription = null,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                "Generate ${if (selectedFormat == ReportFormat.PDF) "PDF" else "Excel"} ($filteredCount)",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }
    }
}
