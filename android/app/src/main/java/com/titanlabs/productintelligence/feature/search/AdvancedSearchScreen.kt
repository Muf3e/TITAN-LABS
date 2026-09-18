package com.titanlabs.productintelligence.feature.search

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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Sort
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.LocalOffer
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.RangeSlider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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
import com.titanlabs.productintelligence.ui.theme.RainbowButtonGradient
import com.titanlabs.productintelligence.ui.theme.TitanAmber
import com.titanlabs.productintelligence.ui.theme.TitanBlue
import java.text.NumberFormat
import java.util.Locale

private val inrFormat: NumberFormat = NumberFormat.getCurrencyInstance(Locale("en", "IN")).apply {
    maximumFractionDigits = 0
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdvancedSearchScreen(
    onBack: () -> Unit = {},
    onSearch: (query: String, category: String) -> Unit = { _, _ -> },
) {
    var keyword by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All Categories") }
    var selectedBrand by remember { mutableStateOf("All Brands") }
    var priceRange by remember { mutableStateOf(35000f..200000f) }
    var selectedRating by remember { mutableStateOf("All Ratings") }
    var sortBy by remember { mutableStateOf("Relevance") }
    var inStockOnly by remember { mutableStateOf(false) }

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
            verticalAlignment = Alignment.CenterVertically,
        ) {
            IconButton(onClick = onBack) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back",
                    tint = Color(0xFF0D1326),
                )
            }

            Spacer(modifier = Modifier.weight(1f))

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

            Spacer(modifier = Modifier.weight(1f))
            Spacer(modifier = Modifier.size(48.dp)) // balance layout
        }

        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            contentPadding = PaddingValues(horizontal = 20.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            item {
                Text(
                    text = "Advanced Search",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0D1326),
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Find exactly what you’re looking for with smart filters.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color(0xFF6B7280),
                )
            }

            // Keyword Card
            item {
                FilterCardContainer(title = "Keyword") {
                    OutlinedTextField(
                        value = keyword,
                        onValueChange = { keyword = it },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("Search for products, brands, or features...", color = Color(0xFF94A3B8), fontSize = 14.sp) },
                        leadingIcon = {
                            Icon(Icons.Filled.Search, contentDescription = null, tint = Color(0xFF94A3B8))
                        },
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = Color(0xFFF8FAFC),
                            unfocusedContainerColor = Color(0xFFF8FAFC),
                            focusedBorderColor = TitanBlue,
                            unfocusedBorderColor = Color(0xFFE2E8F0),
                        ),
                        singleLine = true,
                    )
                }
            }

            // Category Card
            item {
                FilterCardContainer(title = "Category") {
                    PickerRow(
                        leadingIcon = { Icon(Icons.Filled.GridView, null, tint = Color(0xFF0D1326), modifier = Modifier.size(20.dp)) },
                        text = selectedCategory,
                        onClick = {},
                    )
                }
            }

            // Brand Card
            item {
                FilterCardContainer(title = "Brand") {
                    PickerRow(
                        leadingIcon = { Icon(Icons.Filled.LocalOffer, null, tint = Color(0xFF0D1326), modifier = Modifier.size(20.dp)) },
                        text = selectedBrand,
                        onClick = {},
                    )
                }
            }

            // Price Range Card
            item {
                FilterCardContainer(title = "Price Range") {
                    RangeSlider(
                        value = priceRange,
                        onValueChange = { priceRange = it },
                        valueRange = 0f..250000f,
                        colors = SliderDefaults.colors(
                            thumbColor = TitanBlue,
                            activeTrackColor = TitanBlue,
                            inactiveTrackColor = Color(0xFFE2E8F0),
                        ),
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Text(
                            text = "₹0",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF6B7280),
                        )
                        Text(
                            text = "₹2,50,000",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF6B7280),
                        )
                    }
                }
            }

            // Minimum Rating Card
            item {
                FilterCardContainer(title = "Minimum Rating") {
                    PickerRow(
                        leadingIcon = { Icon(Icons.Filled.Star, null, tint = TitanAmber, modifier = Modifier.size(20.dp)) },
                        text = selectedRating,
                        onClick = {},
                    )
                }
            }

            // Sort By Card
            item {
                FilterCardContainer(title = "Sort By") {
                    PickerRow(
                        leadingIcon = { Icon(Icons.AutoMirrored.Filled.Sort, null, tint = Color(0xFF0D1326), modifier = Modifier.size(20.dp)) },
                        text = sortBy,
                        onClick = {},
                    )
                }
            }

            // Availability Card
            item {
                FilterCardContainer(title = "Availability") {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp)
                            .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(12.dp))
                            .background(Color(0xFFF8FAFC), RoundedCornerShape(12.dp))
                            .padding(horizontal = 14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Filled.Inventory2, null, tint = Color(0xFF0D1326), modifier = Modifier.size(20.dp))
                            Spacer(modifier = Modifier.width(12.dp))
                            Text(
                                text = "In Stock Only",
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.Medium,
                                color = Color(0xFF0D1326),
                            )
                        }

                        Switch(
                            checked = inStockOnly,
                            onCheckedChange = { inStockOnly = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color.White,
                                checkedTrackColor = TitanBlue,
                                uncheckedThumbColor = Color.White,
                                uncheckedTrackColor = Color(0xFFCBD5E1),
                            ),
                        )
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(16.dp))
            }
        }

        // Bottom Action Buttons: [ Reset ] [ Search Now ]
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Button(
                onClick = {
                    keyword = ""
                    selectedCategory = "All Categories"
                    selectedBrand = "All Brands"
                    priceRange = 0f..250000f
                    selectedRating = "All Ratings"
                    sortBy = "Relevance"
                    inStockOnly = false
                },
                modifier = Modifier
                    .weight(0.9f)
                    .height(54.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFFEBF2FF),
                    contentColor = TitanBlue,
                ),
            ) {
                Text(
                    text = "Reset",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                )
            }

            Button(
                onClick = {
                    onSearch(keyword, if (selectedCategory == "All Categories") "" else selectedCategory)
                },
                modifier = Modifier
                    .weight(1.3f)
                    .height(54.dp)
                    .background(RainbowButtonGradient, RoundedCornerShape(16.dp)),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                contentPadding = PaddingValues(0.dp),
            ) {
                Text(
                    text = "Search Now",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                )
            }
        }
    }
}

@Composable
private fun FilterCardContainer(
    title: String,
    content: @Composable () -> Unit,
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, Color(0xFFF1F5F9), RoundedCornerShape(16.dp)),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0D1326),
            )
            Spacer(modifier = Modifier.height(10.dp))
            content()
        }
    }
}

@Composable
private fun PickerRow(
    leadingIcon: @Composable () -> Unit,
    text: String,
    onClick: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(52.dp)
            .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(12.dp))
            .background(Color(0xFFF8FAFC), RoundedCornerShape(12.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            leadingIcon()
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = text,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF0D1326),
            )
        }

        Icon(
            imageVector = Icons.Filled.KeyboardArrowDown,
            contentDescription = null,
            tint = Color(0xFF64748B),
        )
    }
}
