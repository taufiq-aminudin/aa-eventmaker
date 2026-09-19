package com.aaeventmaker.app.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.aaeventmaker.app.data.BudgetItem
import com.aaeventmaker.app.data.EventRepository
import com.aaeventmaker.app.ui.components.formatRupiah
import com.aaeventmaker.app.ui.theme.*

@Composable
fun BudgetScreen() {
    val budgets by EventRepository.budgets.collectAsState()
    val context = LocalContext.current

    var showAddDialog by remember { mutableStateOf(false) }

    val totalPlanned = budgets.sumOf { it.plannedAmount }
    val totalActual = budgets.sumOf { it.actualAmount }
    val remaining = totalPlanned - totalActual
    val progress = if (totalPlanned > 0) (totalActual.toFloat() / totalPlanned.toFloat()).coerceIn(0f, 1f) else 0f

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = PurplePrimary,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.Add, contentDescription = "Tambah Pos Anggaran")
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

            Text("Budget & Keuangan Event", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text("Pantau realisasi biaya terhadap rencana anggaran pernikahan.", style = MaterialTheme.typography.bodySmall, color = MutedText)

            Spacer(modifier = Modifier.height(12.dp))

            // Main Financial Summary Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(18.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("SISA ANGGARAN", style = MaterialTheme.typography.labelSmall, color = MutedText)
                            Text(
                                text = formatRupiah(remaining),
                                style = MaterialTheme.typography.headlineMedium,
                                fontWeight = FontWeight.ExtraBold,
                                color = if (remaining >= 0) EmeraldSuccess else Color(0xFFDC2626)
                            )
                        }

                        Surface(
                            shape = RoundedCornerShape(50),
                            color = if (remaining >= 0) Color(0xFFDCFCE7) else Color(0xFFFEE2E2)
                        ) {
                            Text(
                                text = if (remaining >= 0) "Surplus / Hemat" else "Over Budget",
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = if (remaining >= 0) Color(0xFF166534) else Color(0xFF991B1B)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    LinearProgressIndicator(
                        progress = { progress },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(10.dp)
                            .clip(RoundedCornerShape(50)),
                        color = if (remaining >= 0) PurplePrimary else Color(0xFFDC2626),
                        trackColor = Color(0xFFE2E8F0)
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("Total Terencana", style = MaterialTheme.typography.labelSmall, color = MutedText)
                            Text(formatRupiah(totalPlanned), fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text("Total Terpakai", style = MaterialTheme.typography.labelSmall, color = MutedText)
                            Text(formatRupiah(totalActual), fontWeight = FontWeight.Bold, fontSize = 14.sp, color = PurplePrimary)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text("Rincian Alokasi Biaya", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

            Spacer(modifier = Modifier.height(8.dp))

            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                contentPadding = PaddingValues(bottom = 80.dp)
            ) {
                items(budgets) { item ->
                    BudgetItemCard(
                        item = item,
                        onDelete = {
                            EventRepository.deleteBudgetItem(item.id)
                            Toast.makeText(context, "Pos anggaran dihapus", Toast.LENGTH_SHORT).show()
                        }
                    )
                }
            }
        }
    }

    if (showAddDialog) {
        var category by remember { mutableStateOf("") }
        var plannedText by remember { mutableStateOf("15000000") }
        var actualText by remember { mutableStateOf("14000000") }
        var notes by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = { Text("Tambah Pos Biaya", fontWeight = FontWeight.Bold) },
            text = {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedTextField(
                        value = category,
                        onValueChange = { category = it },
                        label = { Text("Kategori / Nama Pos") },
                        placeholder = { Text("Contoh: Souvenir & Pouch") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = plannedText,
                        onValueChange = { plannedText = it.filter { char -> char.isDigit() } },
                        label = { Text("Rencana Biaya (Rp)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = actualText,
                        onValueChange = { actualText = it.filter { char -> char.isDigit() } },
                        label = { Text("Realisasi Biaya (Rp)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = notes,
                        onValueChange = { notes = it },
                        label = { Text("Catatan / Vendor") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (category.isNotBlank()) {
                            EventRepository.addBudgetItem(
                                category = category.trim(),
                                planned = plannedText.toLongOrNull() ?: 0L,
                                actual = actualText.toLongOrNull() ?: 0L,
                                notes = notes.trim()
                            )
                            Toast.makeText(context, "Pos biaya ditambahkan!", Toast.LENGTH_SHORT).show()
                            showAddDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                ) {
                    Text("Simpan Biaya")
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
fun BudgetItemCard(
    item: BudgetItem,
    onDelete: () -> Unit
) {
    val diff = item.plannedAmount - item.actualAmount

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
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
                Text(item.category, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                IconButton(onClick = onDelete, modifier = Modifier.size(24.dp)) {
                    Icon(Icons.Default.DeleteOutline, contentDescription = "Hapus", tint = MutedText, modifier = Modifier.size(18.dp))
                }
            }

            if (item.notes.isNotBlank()) {
                Spacer(modifier = Modifier.height(2.dp))
                Text(item.notes, style = MaterialTheme.typography.bodySmall, color = MutedText)
            }

            Spacer(modifier = Modifier.height(10.dp))
            Divider()
            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Rencana: ${formatRupiah(item.plannedAmount)}", style = MaterialTheme.typography.bodySmall, color = MutedText)
                    Text("Realisasi: ${formatRupiah(item.actualAmount)}", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = InkDark)
                }

                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = if (diff >= 0) Color(0xFFDCFCE7) else Color(0xFFFEE2E2)
                ) {
                    Text(
                        text = if (diff >= 0) "Hemat ${formatRupiah(diff)}" else "Lebih ${formatRupiah(-diff)}",
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = if (diff >= 0) Color(0xFF166534) else Color(0xFF991B1B)
                    )
                }
            }
        }
    }
}
