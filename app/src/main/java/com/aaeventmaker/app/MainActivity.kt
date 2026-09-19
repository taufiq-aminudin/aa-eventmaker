package com.aaeventmaker.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aaeventmaker.app.data.EventRepository
import com.aaeventmaker.app.ui.screens.*
import com.aaeventmaker.app.ui.theme.AAEventMakerTheme
import com.aaeventmaker.app.ui.theme.PinkAccent
import com.aaeventmaker.app.ui.theme.PurpleLight
import com.aaeventmaker.app.ui.theme.PurplePrimary

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        setContent {
            AAEventMakerTheme {
                MainAppScaffold()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppScaffold() {
    var selectedTab by remember { mutableIntStateOf(0) }
    var showLivePreviewModal by remember { mutableStateOf(false) }
    var initialOpenScannerForGuestTab by remember { mutableStateOf(false) }

    val currentProject by EventRepository.currentProject.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = PurplePrimary
                        ) {
                            Text(
                                text = "AA",
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color.White
                            )
                        }
                        Column {
                            Text(
                                text = "EVENT MAKER",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = currentProject.name,
                                style = MaterialTheme.typography.labelSmall,
                                color = Color(0xFF6B7280),
                                maxLines = 1
                            )
                        }
                    }
                },
                actions = {
                    IconButton(onClick = { selectedTab = 1 }) {
                        Icon(
                            imageVector = Icons.Default.Visibility,
                            contentDescription = "Preview Undangan",
                            tint = PurplePrimary
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(if (selectedTab == 0) Icons.Filled.Home else Icons.Outlined.Home, contentDescription = "Home") },
                    label = { Text("Home") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PurplePrimary,
                        selectedTextColor = PurplePrimary,
                        indicatorColor = PurpleLight
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(if (selectedTab == 1) Icons.Filled.Mail else Icons.Outlined.Mail, contentDescription = "Undangan") },
                    label = { Text("Undangan") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PurplePrimary,
                        selectedTextColor = PurplePrimary,
                        indicatorColor = PurpleLight
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = {
                        initialOpenScannerForGuestTab = false
                        selectedTab = 2
                    },
                    icon = { Icon(if (selectedTab == 2) Icons.Filled.People else Icons.Outlined.People, contentDescription = "Tamu") },
                    label = { Text("Tamu") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PurplePrimary,
                        selectedTextColor = PurplePrimary,
                        indicatorColor = PurpleLight
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    icon = { Icon(if (selectedTab == 3) Icons.Filled.Assignment else Icons.Outlined.Assignment, contentDescription = "Planner") },
                    label = { Text("Planner") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PurplePrimary,
                        selectedTextColor = PurplePrimary,
                        indicatorColor = PurpleLight
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 4,
                    onClick = { selectedTab = 4 },
                    icon = { Icon(if (selectedTab == 4) Icons.Filled.AccountBalanceWallet else Icons.Outlined.AccountBalanceWallet, contentDescription = "Budget") },
                    label = { Text("Budget") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PurplePrimary,
                        selectedTextColor = PurplePrimary,
                        indicatorColor = PurpleLight
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 5,
                    onClick = { selectedTab = 5 },
                    icon = { Icon(if (selectedTab == 5) Icons.Filled.AutoAwesome else Icons.Outlined.AutoAwesome, contentDescription = "Studio") },
                    label = { Text("Studio") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PurplePrimary,
                        selectedTextColor = PurplePrimary,
                        indicatorColor = PurpleLight
                    )
                )
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when (selectedTab) {
                0 -> HomeScreen(
                    onNavigateToTab = { tabIndex ->
                        selectedTab = tabIndex
                    },
                    onOpenPublicInvitation = {
                        selectedTab = 1
                    },
                    onOpenQrScanner = {
                        initialOpenScannerForGuestTab = true
                        selectedTab = 2
                    }
                )
                1 -> InvitationScreen()
                2 -> GuestScreen(initialOpenScanner = initialOpenScannerForGuestTab)
                3 -> PlannerScreen()
                4 -> BudgetScreen()
                5 -> StudioScreen()
                6 -> LocationMemoriesScreen()
                else -> HomeScreen(
                    onNavigateToTab = { selectedTab = it },
                    onOpenPublicInvitation = { selectedTab = 1 },
                    onOpenQrScanner = { selectedTab = 2 }
                )
            }
        }
    }
}
