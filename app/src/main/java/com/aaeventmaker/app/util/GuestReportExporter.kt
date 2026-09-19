package com.aaeventmaker.app.util

import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.graphics.*
import android.graphics.pdf.PdfDocument
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import androidx.core.content.FileProvider
import com.aaeventmaker.app.data.EventProject
import com.aaeventmaker.app.data.Guest
import com.aaeventmaker.app.data.InvitationData
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.*

enum class ReportFormat {
    PDF,
    EXCEL_CSV
}

enum class GuestExportFilter(val displayName: String) {
    ALL("Semua Tamu"),
    CHECKED_IN("Sudah Hadir (Check-In)"),
    CONFIRMED("Terkonfirmasi (RSVP Ya)"),
    PENDING("Menunggu Respon (Pending)"),
    DECLINED("Berhalangan (Declined)")
}

data class ExportResult(
    val file: File,
    val uri: Uri,
    val mimeType: String,
    val fileName: String,
    val savedToDownloads: Boolean = false,
    val downloadPath: String? = null
)

object GuestReportExporter {

    private fun getSanitizedTitle(title: String): String {
        return title.replace(Regex("[^a-zA-Z0-9_-]"), "_").take(30)
    }

    /**
     * Generates a printable PDF report for the guest list.
     */
    fun generatePdfReport(
        context: Context,
        guests: List<Guest>,
        invitation: InvitationData,
        project: EventProject?,
        filter: GuestExportFilter = GuestExportFilter.ALL
    ): ExportResult {
        val filteredGuests = when (filter) {
            GuestExportFilter.ALL -> guests
            GuestExportFilter.CHECKED_IN -> guests.filter { it.isCheckedIn }
            GuestExportFilter.CONFIRMED -> guests.filter { it.rsvpStatus.equals("Confirmed", ignoreCase = true) }
            GuestExportFilter.PENDING -> guests.filter {
                it.rsvpStatus.equals("Pending", ignoreCase = true) ||
                it.rsvpStatus.equals("Maybe", ignoreCase = true) ||
                it.rsvpStatus.isBlank()
            }
            GuestExportFilter.DECLINED -> guests.filter { it.rsvpStatus.equals("Declined", ignoreCase = true) }
        }

        val eventTitle = project?.name ?: invitation.title
        val eventDate = invitation.date
        val venue = invitation.venue
        val hosts = invitation.hosts

        val timestamp = SimpleDateFormat("dd MMM yyyy, HH:mm", Locale("id", "ID")).format(Date())
        val fileDateSuffix = SimpleDateFormat("yyyyMMdd_HHmm", Locale.US).format(Date())
        val fileName = "Laporan_Tamu_${getSanitizedTitle(eventTitle)}_$fileDateSuffix.pdf"

        val reportsDir = File(context.cacheDir, "reports").apply { mkdirs() }
        val pdfFile = File(reportsDir, fileName)

        val document = PdfDocument()

        val pageWidth = 595
        val pageHeight = 842
        val margin = 36f
        val contentWidth = pageWidth - (margin * 2)

        // Statistics
        val totalPax = guests.sumOf { it.pax }
        val confirmedPax = guests.filter { it.rsvpStatus.equals("Confirmed", ignoreCase = true) }.sumOf { it.pax }
        val checkedInCount = guests.count { it.isCheckedIn }
        val checkedInPax = guests.filter { it.isCheckedIn }.sumOf { it.pax }
        val pendingCount = guests.count {
            it.rsvpStatus.equals("Pending", ignoreCase = true) ||
            it.rsvpStatus.equals("Maybe", ignoreCase = true) ||
            it.rsvpStatus.isBlank()
        }
        val attendancePercent = if (confirmedPax > 0) ((checkedInPax.toFloat() / confirmedPax.toFloat()) * 100).toInt() else 0

        // Column widths matching contentWidth = 523f
        val colNo = 22f
        val colName = 125f
        val colCategory = 65f
        val colTable = 38f
        val colPax = 28f
        val colRsvp = 62f
        val colCheckIn = 65f
        val colTime = 65f
        val colCode = 53f

        val paint = Paint().apply { isAntiAlias = true }
        val rowHeight = 20f

        // Pagination calculation
        val page1HeaderHeight = 185f
        val pageSubsequentHeaderHeight = 55f
        val footerHeight = 40f

        val page1AvailableHeight = pageHeight - margin - page1HeaderHeight - footerHeight
        val subsequentAvailableHeight = pageHeight - margin - pageSubsequentHeaderHeight - footerHeight

        val page1RowCount = (page1AvailableHeight / rowHeight).toInt()
        val subsequentRowCount = (subsequentAvailableHeight / rowHeight).toInt()

        val totalPages = if (filteredGuests.size <= page1RowCount) {
            1
        } else {
            val remaining = filteredGuests.size - page1RowCount
            1 + (remaining + subsequentRowCount - 1) / subsequentRowCount
        }

        var guestIndex = 0

        for (pageIndex in 1..totalPages) {
            val pageInfo = PdfDocument.PageInfo.Builder(pageWidth, pageHeight, pageIndex).create()
            val page = document.startPage(pageInfo)
            val canvas = page.canvas

            var y = margin

            if (pageIndex == 1) {
                // Page 1 Header Banner
                val bannerRect = RectF(margin, y, margin + contentWidth, y + 68f)
                paint.color = Color.rgb(107, 70, 193) // Purple Primary
                canvas.drawRoundRect(bannerRect, 10f, 10f, paint)

                // Header Text
                paint.color = Color.WHITE
                paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                paint.textSize = 14f
                canvas.drawText(eventTitle.take(45), margin + 14f, y + 22f, paint)

                paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
                paint.textSize = 9.5f
                canvas.drawText("Tanggal: $eventDate  •  Lokasi: ${venue.take(50)}", margin + 14f, y + 38f, paint)
                canvas.drawText("Tuan Rumah: $hosts  •  Laporan Diekspor: $timestamp WIB", margin + 14f, y + 52f, paint)

                y += 78f

                // Document Title & Filter tag
                paint.color = Color.rgb(30, 41, 59)
                paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                paint.textSize = 12f
                canvas.drawText("LAPORAN KEHADIRAN & RSVP TAMU", margin, y + 10f, paint)

                paint.color = Color.rgb(100, 116, 139)
                paint.textSize = 9f
                paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
                canvas.drawText("Filter Data: ${filter.displayName} (${filteredGuests.size} dari ${guests.size} Tamu)", margin, y + 23f, paint)

                y += 32f

                // KPI Stats Cards (4 columns)
                val cardWidth = (contentWidth - (3 * 8f)) / 4f
                val cardHeight = 44f

                fun drawStatCard(x: Float, label: String, value: String, sub: String, accentColor: Int) {
                    val cardRect = RectF(x, y, x + cardWidth, y + cardHeight)
                    paint.color = Color.rgb(248, 250, 252)
                    canvas.drawRoundRect(cardRect, 6f, 6f, paint)

                    paint.style = Paint.Style.STROKE
                    paint.strokeWidth = 1f
                    paint.color = Color.rgb(226, 232, 240)
                    canvas.drawRoundRect(cardRect, 6f, 6f, paint)
                    paint.style = Paint.Style.FILL

                    // Top strip
                    paint.color = accentColor
                    canvas.drawRoundRect(RectF(x, y, x + cardWidth, y + 3f), 2f, 2f, paint)

                    paint.color = Color.rgb(100, 116, 139)
                    paint.textSize = 7.5f
                    paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                    canvas.drawText(label.uppercase(), x + 7f, y + 14f, paint)

                    paint.color = Color.rgb(15, 23, 42)
                    paint.textSize = 11f
                    paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                    canvas.drawText(value, x + 7f, y + 28f, paint)

                    paint.color = Color.rgb(100, 116, 139)
                    paint.textSize = 7.5f
                    paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
                    canvas.drawText(sub, x + 7f, y + 39f, paint)
                }

                drawStatCard(margin, "Total Undangan", "${guests.size} Tamu", "Kapasitas: $totalPax Pax", Color.rgb(99, 102, 241))
                drawStatCard(margin + cardWidth + 8f, "Konfirmasi RSVP", "$confirmedPax Pax", "${guests.count { it.rsvpStatus == "Confirmed" }} Tamu Ya", Color.rgb(16, 185, 129))
                drawStatCard(margin + (cardWidth + 8f) * 2, "Sudah Check-In", "$checkedInCount Tamu", "$checkedInPax Pax ($attendancePercent%)", Color.rgb(139, 92, 246))
                drawStatCard(margin + (cardWidth + 8f) * 3, "Pending RSVP", "$pendingCount Tamu", "Belum merespon", Color.rgb(245, 158, 11))

                y += cardHeight + 16f
            } else {
                // Subsequent page compact header
                paint.color = Color.rgb(107, 70, 193)
                paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                paint.textSize = 10f
                canvas.drawText("LAPORAN KEHADIRAN: $eventTitle", margin, y + 14f, paint)

                paint.color = Color.rgb(100, 116, 139)
                paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
                paint.textSize = 8f
                canvas.drawText("Halaman $pageIndex dari $totalPages  •  Filter: ${filter.displayName}", margin, y + 26f, paint)

                paint.color = Color.rgb(226, 232, 240)
                paint.strokeWidth = 1f
                canvas.drawLine(margin, y + 32f, margin + contentWidth, y + 32f, paint)

                y += 40f
            }

            // Table Header Bar
            val tableHeaderRect = RectF(margin, y, margin + contentWidth, y + 22f)
            paint.color = Color.rgb(241, 245, 249) // Light Slate
            canvas.drawRoundRect(tableHeaderRect, 4f, 4f, paint)

            paint.color = Color.rgb(51, 65, 85)
            paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            paint.textSize = 8f

            var colX = margin + 4f
            canvas.drawText("NO", colX, y + 14f, paint); colX += colNo
            canvas.drawText("NAMA TAMU", colX, y + 14f, paint); colX += colName
            canvas.drawText("KATEGORI", colX, y + 14f, paint); colX += colCategory
            canvas.drawText("MEJA", colX, y + 14f, paint); colX += colTable
            canvas.drawText("PAX", colX, y + 14f, paint); colX += colPax
            canvas.drawText("STATUS RSVP", colX, y + 14f, paint); colX += colRsvp
            canvas.drawText("KEHADIRAN", colX, y + 14f, paint); colX += colCheckIn
            canvas.drawText("WAKTU MASUK", colX, y + 14f, paint); colX += colTime
            canvas.drawText("E-PASS", colX, y + 14f, paint)

            y += 24f

            // Rows on this page
            val rowsForThisPage = if (pageIndex == 1) page1RowCount else subsequentRowCount
            var rowsPrinted = 0

            while (guestIndex < filteredGuests.size && rowsPrinted < rowsForThisPage) {
                val guest = filteredGuests[guestIndex]
                val isEven = rowsPrinted % 2 == 0

                // Row background
                if (isEven) {
                    paint.color = Color.rgb(248, 250, 252)
                    canvas.drawRect(margin, y, margin + contentWidth, y + rowHeight, paint)
                }

                // Row border bottom
                paint.color = Color.rgb(241, 245, 249)
                paint.strokeWidth = 0.5f
                canvas.drawLine(margin, y + rowHeight, margin + contentWidth, y + rowHeight, paint)

                val textY = y + 13.5f
                colX = margin + 4f

                // 1. No
                paint.color = Color.rgb(100, 116, 139)
                paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
                paint.textSize = 7.5f
                canvas.drawText("${guestIndex + 1}", colX, textY, paint)
                colX += colNo

                // 2. Name
                paint.color = Color.rgb(15, 23, 42)
                paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                paint.textSize = 8f
                canvas.drawText(guest.name.take(24), colX, textY, paint)
                colX += colName

                // 3. Category
                paint.color = Color.rgb(71, 85, 105)
                paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
                paint.textSize = 7.5f
                canvas.drawText(guest.group.take(13), colX, textY, paint)
                colX += colCategory

                // 4. Table
                paint.color = Color.rgb(71, 85, 105)
                canvas.drawText(guest.tableNumber.ifBlank { "-" }, colX, textY, paint)
                colX += colTable

                // 5. Pax
                paint.color = Color.rgb(15, 23, 42)
                paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                canvas.drawText("${guest.pax}", colX, textY, paint)
                colX += colPax

                // 6. RSVP Status
                val rsvpColor = when {
                    guest.rsvpStatus.equals("Confirmed", ignoreCase = true) -> Color.rgb(22, 101, 52)
                    guest.rsvpStatus.equals("Declined", ignoreCase = true) -> Color.rgb(185, 28, 28)
                    else -> Color.rgb(180, 83, 9)
                }
                paint.color = rsvpColor
                paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                paint.textSize = 7.5f
                canvas.drawText(guest.rsvpStatus.ifBlank { "Pending" }, colX, textY, paint)
                colX += colRsvp

                // 7. Check-In Status
                val checkInColor = if (guest.isCheckedIn) Color.rgb(21, 128, 61) else Color.rgb(100, 116, 139)
                paint.color = checkInColor
                paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                canvas.drawText(if (guest.isCheckedIn) "✓ Hadir" else "Belum", colX, textY, paint)
                colX += colCheckIn

                // 8. Time
                paint.color = Color.rgb(100, 116, 139)
                paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
                paint.textSize = 7f
                canvas.drawText(guest.checkInTime ?: "-", colX, textY, paint)
                colX += colTime

                // 9. Pass Code
                paint.color = Color.rgb(107, 70, 193)
                paint.typeface = Typeface.create(Typeface.MONOSPACE, Typeface.NORMAL)
                paint.textSize = 7f
                canvas.drawText(guest.checkInCode.take(8), colX, textY, paint)

                y += rowHeight
                guestIndex++
                rowsPrinted++
            }

            // Footer on each page
            val footerY = pageHeight - margin + 8f
            paint.color = Color.rgb(226, 232, 240)
            paint.strokeWidth = 1f
            canvas.drawLine(margin, footerY - 14f, margin + contentWidth, footerY - 14f, paint)

            paint.color = Color.rgb(148, 163, 184)
            paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
            paint.textSize = 7.5f
            canvas.drawText("AA Event Maker  •  Sistem Manajemen Tamu & E-Pass Digital", margin, footerY, paint)

            val pageStr = "Halaman $pageIndex dari $totalPages"
            val pageStrWidth = paint.measureText(pageStr)
            canvas.drawText(pageStr, margin + contentWidth - pageStrWidth, footerY, paint)

            document.finishPage(page)
        }

        FileOutputStream(pdfFile).use { out ->
            document.writeTo(out)
        }
        document.close()

        // Also attempt to copy to Downloads public storage
        val downloadSaved = saveFileToPublicDownloads(context, pdfFile, fileName, "application/pdf")

        val contentUri = FileProvider.getUriForFile(
            context,
            "${context.packageName}.fileprovider",
            pdfFile
        )

        return ExportResult(
            file = pdfFile,
            uri = contentUri,
            mimeType = "application/pdf",
            fileName = fileName,
            savedToDownloads = downloadSaved,
            downloadPath = if (downloadSaved) "Folder Downloads perangkat" else null
        )
    }

    /**
     * Generates a Microsoft Excel and Google Sheets compatible CSV with UTF-8 BOM.
     */
    fun generateCsvReport(
        context: Context,
        guests: List<Guest>,
        invitation: InvitationData,
        project: EventProject?,
        filter: GuestExportFilter = GuestExportFilter.ALL
    ): ExportResult {
        val filteredGuests = when (filter) {
            GuestExportFilter.ALL -> guests
            GuestExportFilter.CHECKED_IN -> guests.filter { it.isCheckedIn }
            GuestExportFilter.CONFIRMED -> guests.filter { it.rsvpStatus.equals("Confirmed", ignoreCase = true) }
            GuestExportFilter.PENDING -> guests.filter {
                it.rsvpStatus.equals("Pending", ignoreCase = true) ||
                it.rsvpStatus.equals("Maybe", ignoreCase = true) ||
                it.rsvpStatus.isBlank()
            }
            GuestExportFilter.DECLINED -> guests.filter { it.rsvpStatus.equals("Declined", ignoreCase = true) }
        }

        val eventTitle = project?.name ?: invitation.title
        val timestamp = SimpleDateFormat("dd MMM yyyy HH:mm", Locale("id", "ID")).format(Date())
        val fileDateSuffix = SimpleDateFormat("yyyyMMdd_HHmm", Locale.US).format(Date())
        val fileName = "Laporan_Tamu_${getSanitizedTitle(eventTitle)}_$fileDateSuffix.csv"

        val reportsDir = File(context.cacheDir, "reports").apply { mkdirs() }
        val csvFile = File(reportsDir, fileName)

        val totalPax = guests.sumOf { it.pax }
        val confirmedPax = guests.filter { it.rsvpStatus.equals("Confirmed", ignoreCase = true) }.sumOf { it.pax }
        val checkedInCount = guests.count { it.isCheckedIn }
        val checkedInPax = guests.filter { it.isCheckedIn }.sumOf { it.pax }

        fun escape(value: String): String {
            val sanitized = value.replace("\"", "\"\"")
            return "\"$sanitized\""
        }

        val sb = StringBuilder()
        // Prepend UTF-8 BOM for Microsoft Excel compatibility
        sb.append("\uFEFF")

        // Metadata Header Section
        sb.append("LAPORAN DATA TAMU & STATUS KEHADIRAN\n")
        sb.append("Nama Acara,").append(escape(eventTitle)).append("\n")
        sb.append("Tanggal Acara,").append(escape(invitation.date)).append("\n")
        sb.append("Lokasi,").append(escape(invitation.venue)).append("\n")
        sb.append("Tuan Rumah,").append(escape(invitation.hosts)).append("\n")
        sb.append("Waktu Ekspor,").append(escape("$timestamp WIB")).append("\n")
        sb.append("Filter Data,").append(escape(filter.displayName)).append("\n")
        sb.append("Ringkasan,").append(escape("Total: ${guests.size} Tamu ($totalPax Pax) | Terkonfirmasi: $confirmedPax Pax | Hadir: $checkedInCount Tamu ($checkedInPax Pax)")).append("\n")
        sb.append("\n")

        // Table Column Headers
        sb.append("No,Nama Tamu,Email,Nomor WhatsApp,Kategori,Nomor Meja,Jumlah Pax,Status RSVP,Status Kehadiran,Waktu Check-In,Kode E-Pass,Tautan E-Pass\n")

        filteredGuests.forEachIndexed { index, guest ->
            sb.append("${index + 1},")
            sb.append(escape(guest.name)).append(",")
            sb.append(escape(guest.email)).append(",")
            sb.append(escape(guest.phone)).append(",")
            sb.append(escape(guest.group)).append(",")
            sb.append(escape(guest.tableNumber)).append(",")
            sb.append("${guest.pax},")
            sb.append(escape(guest.rsvpStatus.ifBlank { "Pending" })).append(",")
            sb.append(escape(if (guest.isCheckedIn) "Hadir" else "Belum Hadir")).append(",")
            sb.append(escape(guest.checkInTime ?: "-")).append(",")
            sb.append(escape(guest.checkInCode)).append(",")
            sb.append(escape(guest.getCheckInUrl(invitation.slug)))
            sb.append("\n")
        }

        FileOutputStream(csvFile).use { out ->
            out.write(sb.toString().toByteArray(Charsets.UTF_8))
        }

        val downloadSaved = saveFileToPublicDownloads(context, csvFile, fileName, "text/csv")

        val contentUri = FileProvider.getUriForFile(
            context,
            "${context.packageName}.fileprovider",
            csvFile
        )

        return ExportResult(
            file = csvFile,
            uri = contentUri,
            mimeType = "text/csv",
            fileName = fileName,
            savedToDownloads = downloadSaved,
            downloadPath = if (downloadSaved) "Folder Downloads perangkat" else null
        )
    }

    /**
     * Attempts to save a copy directly to the user-accessible Downloads folder
     */
    private fun saveFileToPublicDownloads(
        context: Context,
        sourceFile: File,
        displayName: String,
        mimeType: String
    ): Boolean {
        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val values = ContentValues().apply {
                    put(MediaStore.MediaColumns.DISPLAY_NAME, displayName)
                    put(MediaStore.MediaColumns.MIME_TYPE, mimeType)
                    put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/AAEventMaker")
                }
                val uri = context.contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
                if (uri != null) {
                    context.contentResolver.openOutputStream(uri)?.use { out ->
                        sourceFile.inputStream().use { input ->
                            input.copyTo(out)
                        }
                    }
                    true
                } else false
            } else {
                val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                val targetFile = File(downloadsDir, displayName)
                sourceFile.copyTo(targetFile, overwrite = true)
                true
            }
        } catch (e: Exception) {
            // Non-critical fallback; cached file is always accessible via FileProvider
            false
        }
    }

    /**
     * Triggers the Android Share Sheet for the exported document.
     */
    fun shareReport(context: Context, result: ExportResult) {
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = result.mimeType
            putExtra(Intent.EXTRA_STREAM, result.uri)
            putExtra(Intent.EXTRA_SUBJECT, result.fileName)
            putExtra(Intent.EXTRA_TEXT, "Berikut adalah berkas ${result.fileName} yang diekspor dari AA Event Maker.")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        context.startActivity(Intent.createChooser(shareIntent, "Bagikan Laporan Tamu"))
    }

    /**
     * Opens the exported document directly in an external viewer (e.g. PDF viewer, Excel, Sheets).
     */
    fun openReport(context: Context, result: ExportResult) {
        val viewIntent = Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(result.uri, result.mimeType)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        val chooser = Intent.createChooser(viewIntent, "Buka Berkas Laporan")
        chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(chooser)
    }
}
