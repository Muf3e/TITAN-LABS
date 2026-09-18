package com.titanlabs.productintelligence.feature.alerts

import androidx.compose.foundation.Image
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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.NotificationsNone
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.titanlabs.productintelligence.R
import com.titanlabs.productintelligence.core.data.ProductRepository
import com.titanlabs.productintelligence.data.model.SampleProduct
import com.titanlabs.productintelligence.ui.theme.RainbowButtonGradient
import com.titanlabs.productintelligence.ui.theme.TitanBlue
import java.text.NumberFormat
import java.util.Locale

private val inrFormat: NumberFormat = NumberFormat.getCurrencyInstance(Locale("en", "IN")).apply {
    maximumFractionDigits = 0
}

@Composable
fun PriceAlertsScreen(
    onBack: () -> Unit = {},
    onProductClick: (String) -> Unit = {},
    onAddAlertClick: () -> Unit = {},
) {
    var selectedTab by remember { mutableStateOf(0) } // 0: My Alerts, 1: Recommended
    val alertsMap by ProductRepository.alerts.collectAsState()
    val allProducts = remember { ProductRepository.getAllProducts() }

    // Alert items matching Price Alerts Screen.png
    val alertProductIds = listOf(
        "asus-rog-strix-g16",
        "iphone-15",
        "sony-wh-1000xm5",
        "samsung-galaxy-tab-s9",
        "lenovo-legion-5-pro",
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFAFBFC)),
    ) {
        // Top App Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            IconButton(onClick = onBack) {
                Icon(
                    imageVector = Icons.Filled.Menu,
                    contentDescription = "Menu",
                    tint = Color(0xFF0D1326),
                )
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                Image(
                    painter = painterResource(R.drawable.titan_logo),
                    contentDescription = "TITAN LABS",
                    modifier = Modifier.size(34.dp),
                    contentScale = ContentScale.Fit,
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "TITAN LABS",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Black,
                    color = Color(0xFF0D1326),
                    letterSpacing = 0.5.sp,
                )
            }

            IconButton(onClick = {}) {
                Icon(
                    imageVector = Icons.Filled.NotificationsNone,
                    contentDescription = "Notifications",
                    tint = Color(0xFF0D1326),
                )
            }
        }

        // Title and Subtitle
        Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)) {
            Text(
                text = "Price Alerts",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0D1326),
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Get notified when prices drop on your favourite products.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color(0xFF6B7280),
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Segmented Control: [ My Alerts (5) ] [ Recommended ]
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .height(48.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(Color(0xFFE8EEF5)),
        ) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxSize()
                    .padding(4.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(if (selectedTab == 0) TitanBlue else Color.Transparent)
                    .clickable { selectedTab = 0 },
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = "My Alerts (5)",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Bold,
                    color = if (selectedTab == 0) Color.White else Color(0xFF4B5563),
                )
            }

            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxSize()
                    .padding(4.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(if (selectedTab == 1) TitanBlue else Color.Transparent)
                    .clickable { selectedTab = 1 },
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = "Recommended",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Medium,
                    color = if (selectedTab == 1) Color.White else Color(0xFF4B5563),
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Alerts List
        val targetPriceMap = mapOf(
            "asus-rog-strix-g16" to 139990,
            "iphone-15" to 64900,
            "sony-wh-1000xm5" to 24990,
            "samsung-galaxy-tab-s9" to 54999,
            "lenovo-legion-5-pro" to 129990,
        )

        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            contentPadding = PaddingValues(horizontal = 20.dp, vertical = 4.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            items(alertProductIds) { prodId ->
                val product = allProducts.find { it.id == prodId }
                val alert = alertsMap[prodId]
                var isActive by remember(prodId) { mutableStateOf(alert?.active ?: true) }

                if (product != null) {
                    PriceAlertCard(
                        product = product,
                        targetPriceInr = targetPriceMap[prodId] ?: (product.priceInInr - 5000),
                        isActive = isActive,
                        onToggle = { isActive = it },
                        onClick = { onProductClick(prodId) },
                    )
                }
            }
        }

        // Bottom Add Price Alert Button
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 16.dp),
        ) {
            Button(
                onClick = onAddAlertClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp)
                    .background(RainbowButtonGradient, RoundedCornerShape(16.dp)),
                colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                shape = RoundedCornerShape(16.dp),
                contentPadding = PaddingValues(0.dp),
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center,
                ) {
                    Icon(
                        imageVector = Icons.Filled.Add,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(22.dp),
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Add Price Alert",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                    )
                }
            }
        }
    }
}

@Composable
private fun PriceAlertCard(
    product: SampleProduct,
    targetPriceInr: Int,
    isActive: Boolean,
    onToggle: (Boolean) -> Unit,
    onClick: () -> Unit,
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, Color(0xFFF1F5F9), RoundedCornerShape(16.dp))
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            // Product Image
            Image(
                painter = painterResource(product.imageResId ?: R.drawable.titan_logo),
                contentDescription = product.name,
                modifier = Modifier
                    .size(width = 76.dp, height = 64.dp)
                    .clip(RoundedCornerShape(8.dp)),
                contentScale = ContentScale.Fit,
            )

            Spacer(modifier = Modifier.width(14.dp))

            // Text Info
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = product.name,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0D1326),
                    maxLines = 1,
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = inrFormat.format(product.priceInInr),
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Black,
                    color = Color(0xFF0D1326),
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "Notify me when price is",
                    style = MaterialTheme.typography.labelSmall,
                    color = Color(0xFF6B7280),
                )
                Text(
                    text = "${inrFormat.format(targetPriceInr)} or below",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = TitanBlue,
                )
            }

            Spacer(modifier = Modifier.width(8.dp))

            // Toggle Switch
            Switch(
                checked = isActive,
                onCheckedChange = onToggle,
                colors = SwitchDefaults.colors(
                    checkedThumbColor = Color.White,
                    checkedTrackColor = TitanBlue,
                    uncheckedThumbColor = Color.White,
                    uncheckedTrackColor = Color(0xFFD1D5DB),
                ),
            )

            // 3-dots Menu
            IconButton(
                onClick = {},
                modifier = Modifier.size(28.dp),
            ) {
                Icon(
                    imageVector = Icons.Filled.MoreVert,
                    contentDescription = "Options",
                    tint = Color(0xFF1E293B),
                    modifier = Modifier.size(20.dp),
                )
            }
        }
    }
}
