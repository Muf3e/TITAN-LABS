package com.titanlabs.productintelligence.feature.home

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Headphones
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Laptop
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material.icons.filled.NotificationsNone
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Smartphone
import androidx.compose.material.icons.filled.Tablet
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.titanlabs.productintelligence.R
import com.titanlabs.productintelligence.data.model.ProductCategory
import com.titanlabs.productintelligence.data.sample.SampleData
import com.titanlabs.productintelligence.ui.components.TitanScoreBadge
import com.titanlabs.productintelligence.ui.theme.TitanAmber
import com.titanlabs.productintelligence.ui.theme.TitanBlue
import com.titanlabs.productintelligence.ui.theme.TitanCyan
import com.titanlabs.productintelligence.ui.theme.TitanPink
import com.titanlabs.productintelligence.ui.theme.TitanPurple

@Composable
fun HomeScreen(
    onSearchRequested: (query: String, category: String) -> Unit,
    onNavigateToSaved: () -> Unit,
    onNavigateToAlerts: () -> Unit,
) {
    var query by remember { mutableStateOf("") }
    var recentSearches by remember { mutableStateOf(SampleData.recentSearches) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(bottom = 32.dp),
    ) {
        item {
            // Top App Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = {}) {
                        Icon(Icons.Filled.Menu, contentDescription = "Menu")
                    }
                    Spacer(modifier = Modifier.width(4.dp))
                    Image(
                        painter = painterResource(R.drawable.titan_logo),
                        contentDescription = "TITAN LABS",
                        modifier = Modifier.size(36.dp),
                        contentScale = ContentScale.Fit,
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "TITAN LABS",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.onBackground,
                    )
                }

                IconButton(onClick = onNavigateToAlerts) {
                    Icon(
                        imageVector = Icons.Filled.NotificationsNone,
                        contentDescription = "Notifications",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }

        item {
            // Greeting Header
            Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)) {
                Text(
                    text = "Hello!",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground,
                )
                Text(
                    text = "What are you looking for today?",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }

        item {
            // Search Input Box with Camera Scan Icon
            Box(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
                OutlinedTextField(
                    value = query,
                    onValueChange = { query = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = {
                        Text(
                            "Search for laptops, phones, tablets...",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f),
                        )
                    },
                    leadingIcon = {
                        Icon(
                            Icons.Filled.Search,
                            contentDescription = "Search",
                            tint = TitanBlue,
                        )
                    },
                    trailingIcon = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            if (query.isNotEmpty()) {
                                IconButton(onClick = { query = "" }) {
                                    Icon(Icons.Filled.Clear, contentDescription = "Clear")
                                }
                            }
                            IconButton(onClick = { onSearchRequested(query, "") }) {
                                Icon(
                                    Icons.Filled.QrCodeScanner,
                                    contentDescription = "Scan",
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(16.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = MaterialTheme.colorScheme.surface,
                        unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                        focusedBorderColor = TitanBlue,
                        unfocusedBorderColor = MaterialTheme.colorScheme.outline,
                    ),
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                    keyboardActions = KeyboardActions(
                        onSearch = { onSearchRequested(query, "") },
                    ),
                )
            }
        }

        item {
            // Category Icon Cards Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                CategoryPillItem(
                    label = "Laptops",
                    icon = Icons.Filled.Laptop,
                    containerColor = Color(0xFFE1F0FF),
                    iconColor = Color(0xFF0077FF),
                    onClick = { onSearchRequested("", ProductCategory.LAPTOP.name) },
                )
                CategoryPillItem(
                    label = "Mobiles",
                    icon = Icons.Filled.Smartphone,
                    containerColor = Color(0xFFFFEBF3),
                    iconColor = Color(0xFFFF2A85),
                    onClick = { onSearchRequested("", ProductCategory.SMARTPHONE.name) },
                )
                CategoryPillItem(
                    label = "Tablets",
                    icon = Icons.Filled.Tablet,
                    containerColor = Color(0xFFE3F9F1),
                    iconColor = Color(0xFF00BFA5),
                    onClick = { onSearchRequested("", ProductCategory.TABLET.name) },
                )
                CategoryPillItem(
                    label = "Accessories",
                    icon = Icons.Filled.Headphones,
                    containerColor = Color(0xFFFFEAEA),
                    iconColor = Color(0xFFFF3B30),
                    onClick = { onSearchRequested("", ProductCategory.ACCESSORY.name) },
                )
                CategoryPillItem(
                    label = "More",
                    icon = Icons.Filled.MoreHoriz,
                    containerColor = Color(0xFFF1ECFF),
                    iconColor = Color(0xFF7B2CBF),
                    onClick = { onSearchRequested("", "") },
                )
            }
        }

        item {
            // Featured Banner: "Smarter Tech, Happier You"
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onSearchRequested("", "") },
                    shape = RoundedCornerShape(20.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                ) {
                    Image(
                        painter = painterResource(R.drawable.home_promo_banner),
                        contentDescription = "Smarter Tech Happier You",
                        modifier = Modifier.fillMaxWidth(),
                        contentScale = ContentScale.FillWidth,
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Dots indicator (5 dots: dot 1 active blue, dots 2-5 light gray)
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Box(modifier = Modifier.size(7.dp).clip(CircleShape).background(TitanBlue))
                    Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(Color(0xFFCBD5E1)))
                    Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(Color(0xFFCBD5E1)))
                    Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(Color(0xFFCBD5E1)))
                    Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(Color(0xFFCBD5E1)))
                }
            }
        }

        item {
            // Popular Searches Section
            Column(modifier = Modifier.padding(top = 16.dp)) {
                Text(
                    text = "Popular Searches",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 20.dp),
                )
                Spacer(modifier = Modifier.height(12.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState())
                        .padding(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    listOf(
                        Triple("Gaming\nLaptops", R.drawable.cat_gaming_laptops, "laptop"),
                        Triple("iPhones", R.drawable.cat_iphones, "apple"),
                        Triple("Samsung\nPhones", R.drawable.cat_samsung, "samsung"),
                        Triple("Tablets", R.drawable.cat_tablets, "tablet"),
                    ).forEach { (label, imageRes, keyword) ->
                        Card(
                            modifier = Modifier
                                .width(98.dp)
                                .clickable { onSearchRequested(keyword, "") },
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(8.dp),
                                horizontalAlignment = Alignment.CenterHorizontally,
                            ) {
                                Image(
                                    painter = painterResource(imageRes),
                                    contentDescription = label,
                                    modifier = Modifier
                                        .size(68.dp)
                                        .clip(RoundedCornerShape(10.dp)),
                                    contentScale = ContentScale.Fit,
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = label,
                                    style = MaterialTheme.typography.labelMedium,
                                    fontWeight = FontWeight.SemiBold,
                                    color = MaterialTheme.colorScheme.onSurface,
                                    textAlign = TextAlign.Center,
                                    lineHeight = 14.sp,
                                )
                            }
                        }
                    }
                }
            }
        }

        item {
            // Recent Searches Header
            if (recentSearches.isNotEmpty()) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(start = 20.dp, end = 16.dp, top = 20.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        text = "Recent searches",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                    )
                    TextButton(onClick = { recentSearches = emptyList() }) {
                        Text(
                            text = "Clear recent searches",
                            style = MaterialTheme.typography.bodySmall,
                            color = TitanBlue,
                        )
                    }
                }
            }
        }

        items(recentSearches) { searchItem ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onSearchRequested(searchItem, "") }
                    .padding(horizontal = 20.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Icon(
                    imageVector = Icons.Filled.History,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(18.dp),
                )
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = searchItem,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                )
            }
        }
    }
}

@Composable
private fun CategoryPillItem(
    label: String,
    icon: ImageVector,
    containerColor: Color,
    iconColor: Color,
    onClick: () -> Unit,
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable(onClick = onClick),
    ) {
        Box(
            modifier = Modifier
                .size(56.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(containerColor),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = iconColor,
                modifier = Modifier.size(28.dp),
            )
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurface,
        )
    }
}
