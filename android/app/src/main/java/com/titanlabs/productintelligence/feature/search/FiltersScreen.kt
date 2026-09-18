package com.titanlabs.productintelligence.feature.search

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LocalMinimumInteractiveComponentSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.RangeSlider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.titanlabs.productintelligence.ui.theme.RainbowButtonGradient
import com.titanlabs.productintelligence.ui.theme.TitanBlue
import java.text.NumberFormat
import java.util.Locale

private val inrFormat: NumberFormat = NumberFormat.getCurrencyInstance(Locale("en", "IN")).apply {
    maximumFractionDigits = 0
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FiltersScreen(
    onBack: () -> Unit = {},
    onApply: (category: String, selectedBrands: List<String>, priceRange: ClosedFloatingPointRange<Float>) -> Unit = { _, _, _ -> },
) {
    var selectedCategory by remember { mutableStateOf("Laptops") }
    var brandSearchQuery by remember { mutableStateOf("") }
    val brands = listOf(
        "ASUS" to 124,
        "Lenovo" to 98,
        "Acer" to 76,
        "MSI" to 86,
        "HP" to 54,
        "Dell" to 52,
        "Apple" to 48,
    )
    val selectedBrands = remember { mutableStateMapOf<String, Boolean>() }
    var priceRange by remember { mutableStateOf(20000f..250000f) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White),
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
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back",
                    tint = Color(0xFF0D1326),
                )
            }

            Text(
                text = "Filters",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0D1326),
            )

            TextButton(
                onClick = {
                    selectedCategory = "Laptops"
                    brandSearchQuery = ""
                    selectedBrands.clear()
                    priceRange = 20000f..250000f
                }
            ) {
                Text(
                    text = "Reset",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = TitanBlue,
                )
            }
        }

        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            contentPadding = PaddingValues(horizontal = 24.dp, vertical = 8.dp),
        ) {
            // Category Section
            item {
                Text(
                    text = "Category",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0D1326),
                )
                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    listOf("Laptops", "Mobiles", "Tablets", "Accessories").forEach { cat ->
                        val isSelected = selectedCategory == cat
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(14.dp))
                                .background(if (isSelected) TitanBlue else Color(0xFFF1F5F9))
                                .clickable { selectedCategory = cat }
                                .padding(horizontal = 20.dp, vertical = 12.dp),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                text = cat,
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) Color.White else Color(0xFF475569),
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))
            }

            // Brand Section
            item {
                Text(
                    text = "Brand",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0D1326),
                )
                Spacer(modifier = Modifier.height(12.dp))

                // Search brand input
                OutlinedTextField(
                    value = brandSearchQuery,
                    onValueChange = { brandSearchQuery = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("Search brand...", color = Color(0xFF94A3B8)) },
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Filled.Search,
                            contentDescription = null,
                            tint = Color(0xFF94A3B8),
                        )
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

                Spacer(modifier = Modifier.height(12.dp))

                // Checkbox Brand List
                val filteredBrands = brands.filter {
                    brandSearchQuery.isEmpty() || it.first.contains(brandSearchQuery, ignoreCase = true)
                }

                CompositionLocalProvider(LocalMinimumInteractiveComponentSize provides Dp.Unspecified) {
                    Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                        filteredBrands.forEach { (brandName, count) ->
                            val isChecked = selectedBrands[brandName] == true
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { selectedBrands[brandName] = !isChecked }
                                    .padding(vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Checkbox(
                                    checked = isChecked,
                                    onCheckedChange = { selectedBrands[brandName] = it },
                                    colors = CheckboxDefaults.colors(
                                        checkedColor = TitanBlue,
                                        uncheckedColor = Color(0xFF94A3B8),
                                    ),
                                    modifier = Modifier.size(20.dp),
                                )
                                Spacer(modifier = Modifier.width(12.dp))
                                Text(
                                    text = brandName,
                                    style = MaterialTheme.typography.bodyLarge,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF0D1326),
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "($count)",
                                    style = MaterialTheme.typography.bodyLarge,
                                    color = Color(0xFF64748B),
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))
            }

            // Price Range Section
            item {
                Text(
                    text = "Price Range",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0D1326),
                )
                Spacer(modifier = Modifier.height(8.dp))

                RangeSlider(
                    value = priceRange,
                    onValueChange = { priceRange = it },
                    valueRange = 0f..300000f,
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
                        text = inrFormat.format(priceRange.start),
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF0D1326),
                    )
                    Text(
                        text = inrFormat.format(priceRange.endInclusive),
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF0D1326),
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))
            }
        }

        // Show Results Button
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 16.dp),
        ) {
            Button(
                onClick = {
                    val activeBrandsList = selectedBrands.filter { it.value }.map { it.key }
                    onApply(selectedCategory, activeBrandsList, priceRange)
                    onBack()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .background(RainbowButtonGradient, RoundedCornerShape(16.dp)),
                colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                shape = RoundedCornerShape(16.dp),
                contentPadding = PaddingValues(0.dp),
            ) {
                Text(
                    text = "Show 356 Results",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                )
            }
        }
    }
}
