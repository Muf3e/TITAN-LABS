package com.titanlabs.productintelligence.feature.account

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForwardIos
import androidx.compose.material.icons.filled.Balance
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Help
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.titanlabs.productintelligence.core.data.ProductRepository

@Composable
fun AccountScreen(
    onNavigateToSaved: () -> Unit,
    onNavigateToCompare: () -> Unit,
    onNavigateToSearch: () -> Unit,
    onNavigateToAlerts: () -> Unit = {},
    onNavigateToOnboarding: () -> Unit = {},
) {
    val savedIds by ProductRepository.savedIds.collectAsState()
    val compareState by ProductRepository.compareState.collectAsState()
    val alerts by ProductRepository.alerts.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFAFBFC)),
        contentPadding = PaddingValues(bottom = 32.dp),
    ) {
        item {
            Spacer(modifier = Modifier.height(16.dp))
            // Profile Header Row (as shown in Account Screen.png)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                // Gradient Avatar with White 'A'
                Box(
                    modifier = Modifier
                        .size(72.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(
                                listOf(
                                    Color(0xFF00C6FF),
                                    Color(0xFF0072FF),
                                    Color(0xFF7B2CBF),
                                )
                            )
                        ),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = "A",
                        fontSize = 32.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.White,
                    )
                }

                Spacer(modifier = Modifier.width(16.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Aisha Khan",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF0D1326),
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "aisha.khan@email.com",
                        fontSize = 15.sp,
                        color = Color(0xFF6B7280),
                    )
                }

                Icon(
                    imageVector = Icons.Outlined.Settings,
                    contentDescription = "Settings",
                    tint = Color(0xFF0D1326),
                    modifier = Modifier
                        .size(28.dp)
                        .clickable {},
                )
            }
        }

        item {
            Spacer(modifier = Modifier.height(16.dp))
            // First Menu Group: Saved, Comparisons, Alerts, History
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp)
                    .border(1.dp, Color(0xFFF1F5F9), RoundedCornerShape(20.dp)),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(20.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
            ) {
                Column {
                    AccountMenuItem(
                        icon = Icons.Filled.Favorite,
                        iconTint = Color(0xFFFF2D55),
                        label = "My Saved Items",
                        countBadge = "12",
                        onClick = onNavigateToSaved,
                    )
                    HorizontalDivider(
                        modifier = Modifier.padding(horizontal = 20.dp),
                        color = Color(0xFFF1F5F9),
                        thickness = 1.dp,
                    )
                    AccountMenuItem(
                        icon = Icons.Filled.Balance,
                        iconTint = Color(0xFFFF9500),
                        label = "My Comparisons",
                        countBadge = "3",
                        onClick = onNavigateToCompare,
                    )
                    HorizontalDivider(
                        modifier = Modifier.padding(horizontal = 20.dp),
                        color = Color(0xFFF1F5F9),
                        thickness = 1.dp,
                    )
                    AccountMenuItem(
                        icon = Icons.Filled.Notifications,
                        iconTint = Color(0xFFFFB800),
                        label = "Price Alerts",
                        countBadge = "5",
                        onClick = onNavigateToAlerts,
                    )
                    HorizontalDivider(
                        modifier = Modifier.padding(horizontal = 20.dp),
                        color = Color(0xFFF1F5F9),
                        thickness = 1.dp,
                    )
                    AccountMenuItem(
                        icon = Icons.Filled.History,
                        iconTint = Color(0xFF007AFF),
                        label = "Search History",
                        onClick = onNavigateToSearch,
                    )
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(16.dp))
            // Second Menu Group: Notifications, App Settings, Help, About
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp)
                    .border(1.dp, Color(0xFFF1F5F9), RoundedCornerShape(20.dp)),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(20.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
            ) {
                Column {
                    AccountMenuItem(
                        icon = Icons.Filled.Notifications,
                        iconTint = Color(0xFFFFB800),
                        label = "Notifications",
                        onClick = {},
                    )
                    HorizontalDivider(
                        modifier = Modifier.padding(horizontal = 20.dp),
                        color = Color(0xFFF1F5F9),
                        thickness = 1.dp,
                    )
                    AccountMenuItem(
                        icon = Icons.Filled.Settings,
                        iconTint = Color(0xFF0D1326),
                        label = "App Settings",
                        onClick = {},
                    )
                    HorizontalDivider(
                        modifier = Modifier.padding(horizontal = 20.dp),
                        color = Color(0xFFF1F5F9),
                        thickness = 1.dp,
                    )
                    AccountMenuItem(
                        icon = Icons.Filled.Help,
                        iconTint = Color(0xFF0D1326),
                        label = "Help & Support",
                        onClick = {},
                    )
                    HorizontalDivider(
                        modifier = Modifier.padding(horizontal = 20.dp),
                        color = Color(0xFFF1F5F9),
                        thickness = 1.dp,
                    )
                    AccountMenuItem(
                        icon = Icons.Filled.Info,
                        iconTint = Color(0xFF0D1326),
                        label = "About Titan Labs",
                        onClick = onNavigateToOnboarding,
                    )
                }
            }
        }
    }
}

@Composable
private fun AccountMenuItem(
    icon: ImageVector,
    iconTint: Color,
    label: String,
    countBadge: String? = null,
    onClick: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 20.dp, vertical = 16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = iconTint,
                modifier = Modifier.size(24.dp),
            )
            Spacer(modifier = Modifier.width(16.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF0D1326),
            )
        }

        Row(verticalAlignment = Alignment.CenterVertically) {
            if (countBadge != null) {
                Text(
                    text = countBadge,
                    style = MaterialTheme.typography.bodyLarge,
                    color = Color(0xFF6B7280),
                    modifier = Modifier.padding(end = 12.dp),
                )
            }
            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowForwardIos,
                contentDescription = null,
                tint = Color(0xFF4B5563),
                modifier = Modifier.size(15.dp),
            )
        }
    }
}

