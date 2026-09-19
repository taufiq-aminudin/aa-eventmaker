package com.aaeventmaker.app.util

import android.graphics.Bitmap
import android.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import com.google.zxing.BarcodeFormat
import com.google.zxing.EncodeHintType
import com.google.zxing.qrcode.QRCodeWriter
import java.util.EnumMap

data class QrTheme(
    val id: String,
    val name: String,
    val fgColor: Int,
    val bgColor: Int,
    val description: String
)

object QrCodeUtil {

    val THEMES = listOf(
        QrTheme(
            id = "purple_signature",
            name = "Purple Royale",
            fgColor = Color.rgb(109, 40, 217), // 0xFF6D28D9 PurplePrimary
            bgColor = Color.WHITE,
            description = "Warna khas signature AA Event Maker dengan aksen ungu royal"
        ),
        QrTheme(
            id = "gold_luxe",
            name = "Golden Amber",
            fgColor = Color.rgb(180, 83, 9), // 0xFFB45309 Amber Gold
            bgColor = Color.rgb(255, 251, 235), // Ivory Light
            description = "Tema emas mewah berpadu latar ivory hangat untuk nuansa sakral"
        ),
        QrTheme(
            id = "dark_slate",
            name = "Midnight Dark",
            fgColor = Color.WHITE,
            bgColor = Color.rgb(15, 23, 42), // Slate 900
            description = "Nuansa gelap elegan berlatar slate untuk pemindaian kontras tinggi"
        ),
        QrTheme(
            id = "classic_mono",
            name = "Monochrome",
            fgColor = Color.BLACK,
            bgColor = Color.WHITE,
            description = "Format hitam putih standar yang paling cepat dibaca seluruh tipe lensa scanner"
        )
    )

    fun generateQrBitmap(
        content: String,
        size: Int = 512,
        foregroundColor: Int = Color.BLACK,
        backgroundColor: Int = Color.WHITE
    ): Bitmap {
        return try {
            val hints = EnumMap<EncodeHintType, Any>(EncodeHintType::class.java).apply {
                put(EncodeHintType.MARGIN, 1)
                put(EncodeHintType.CHARACTER_SET, "UTF-8")
            }
            val bitMatrix = QRCodeWriter().encode(content, BarcodeFormat.QR_CODE, size, size, hints)
            val width = bitMatrix.width
            val height = bitMatrix.height
            val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
            for (x in 0 until width) {
                for (y in 0 until height) {
                    bitmap.setPixel(x, y, if (bitMatrix.get(x, y)) foregroundColor else backgroundColor)
                }
            }
            bitmap
        } catch (e: Exception) {
            val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
            bitmap.eraseColor(Color.LTGRAY)
            bitmap
        }
    }

    fun generateQrImageBitmap(
        content: String,
        size: Int = 512,
        foregroundColor: Int = Color.BLACK,
        backgroundColor: Int = Color.WHITE
    ): ImageBitmap {
        return generateQrBitmap(content, size, foregroundColor, backgroundColor).asImageBitmap()
    }

    /**
     * Extracts guest ID or Check-In Code from a scanned string (URL, JSON, or raw code).
     */
    fun extractGuestCodeOrId(input: String): String {
        val trimmed = input.trim()

        // Check if URL with query parameters: e.g. .../checkin?code=AA-8K2M4P&id=uuid
        if (trimmed.startsWith("http://", ignoreCase = true) || trimmed.startsWith("https://", ignoreCase = true)) {
            val codeParam = extractQueryParam(trimmed, "code")
            if (!codeParam.isNullOrBlank()) return codeParam

            val idParam = extractQueryParam(trimmed, "id") ?: extractQueryParam(trimmed, "guestId")
            if (!idParam.isNullOrBlank()) return idParam
        }

        // Check if JSON payload e.g. {"id":"...", "checkInCode":"..."}
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
            val codeRegex = Regex("\"checkInCode\"\\s*:\\s*\"([^\"]+)\"")
            val codeMatch = codeRegex.find(trimmed)
            if (codeMatch != null) return codeMatch.groupValues[1]

            val idRegex = Regex("\"id\"\\s*:\\s*\"([^\"]+)\"")
            val idMatch = idRegex.find(trimmed)
            if (idMatch != null) return idMatch.groupValues[1]
        }

        return trimmed
    }

    private fun extractQueryParam(url: String, paramName: String): String? {
        val regex = Regex("[?&]$paramName=([^&#]*)")
        val match = regex.find(url)
        return match?.groupValues?.get(1)?.let { java.net.URLDecoder.decode(it, "UTF-8") }
    }
}
