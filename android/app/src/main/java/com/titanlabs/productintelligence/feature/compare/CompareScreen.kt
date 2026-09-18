package com.titanlabs.productintelligence.feature.compare

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.titanlabs.productintelligence.R
import com.titanlabs.productintelligence.core.data.ProductRepository
import com.titanlabs.productintelligence.data.sample.SampleData
import com.titanlabs.productintelligence.ui.state.EmptyState
import com.titanlabs.productintelligence.ui.theme.TitanBlue
import java.text.NumberFormat
import java.util.Locale

private val inrFormat: NumberFormat = NumberFormat.getCurrencyInstance(Locale("en", "IN")).apply {
    maximumFractionDigits = 0
}

@Composable
fun CompareScreen(
    onGoToSearch: () -> Unit,
    onProductClick: (String) -> Unit = {},
) {
    val compareState by ProductRepository.compareState.collectAsState()
    val allProducts = remember { ProductRepository.getAllProducts() }
    val selectedProducts = remember(compareState.selectedProductIds, allProducts) {
        compareState.selectedProductIds.mapNotNull { id -> allProducts.find { it.id == id } }
    }

    if (selectedProducts.isEmpty()) {
        EmptyState(
            title = stringResource(R.string.compare_empty_title),
            body = stringResource(R.string.compare_empty_body),
            actionLabel = stringResource(R.string.compare_empty_cta),
            onAction = onGoToSearch,
            modifier = Modifier.fillMaxSize(),
        )
        return
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
    ) {
        // Header Bar: "Compare (X)" + "Clear All"
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = "Compare (${selectedProducts.size})",
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0D1326),
            )
            TextButton(onClick = { ProductRepository.clearCompare() }) {
                Text(
                    text = "Clear All",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = TitanBlue,
                )
            }
        }

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 32.dp),
        ) {
            item {
                // Top Devices Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    selectedProducts.forEach { product ->
                        Card(
                            modifier = Modifier
                                .weight(1f)
                                .border(1.dp, Color(0xFFF1F5F9), RoundedCornerShape(16.dp)),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 12.dp, vertical = 12.dp),
                                horizontalAlignment = Alignment.CenterHorizontally,
                            ) {
                                Box(modifier = Modifier.fillMaxWidth()) {
                                    IconButton(
                                        onClick = { ProductRepository.removeFromCompare(product.id) },
                                        modifier = Modifier
                                            .align(Alignment.TopEnd)
                                            .size(24.dp),
                                    ) {
                                        Icon(
                                            Icons.Filled.Close,
                                            contentDescription = "Remove",
                                            tint = Color(0xFF0D1326),
                                            modifier = Modifier.size(16.dp),
                                        )
                                    }
                                }

                                Image(
                                    painter = painterResource(product.imageResId ?: R.drawable.titan_logo),
                                    contentDescription = null,
                                    modifier = Modifier
                                        .size(100.dp)
                                        .clip(RoundedCornerShape(10.dp)),
                                    contentScale = ContentScale.Fit,
                                )

                                Spacer(modifier = Modifier.height(10.dp))

                                Text(
                                    text = product.name,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    textAlign = TextAlign.Center,
                                    color = Color(0xFF0D1326),
                                    maxLines = 2,
                                    overflow = TextOverflow.Ellipsis,
                                )

                                Spacer(modifier = Modifier.height(6.dp))

                                Text(
                                    text = inrFormat.format(product.priceInInr),
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Color(0xFF0D1326),
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Specs Comparison Table (Matching Compare Screen.png exactly)
                val specsList = listOf(
                    "Processor" to { id: String ->
                        SampleData.productDetails[id]?.specs?.find { it.label.contains("Processor", ignoreCase = true) }?.value ?: "Intel i7-13650HX"
                    },
                    "Graphics" to { id: String ->
                        SampleData.productDetails[id]?.specs?.find { it.label.contains("Graphics", ignoreCase = true) }?.value ?: "RTX 4060 (8GB)"
                    },
                    "Display" to { id: String ->
                        SampleData.productDetails[id]?.specs?.find { it.label.contains("Display", ignoreCase = true) }?.value ?: "16\" FHD+ 165Hz"
                    },
                    "RAM" to { id: String ->
                        SampleData.productDetails[id]?.specs?.find { it.label.contains("RAM", ignoreCase = true) }?.value ?: "16GB DDR5"
                    },
                    "Storage" to { id: String ->
                        SampleData.productDetails[id]?.specs?.find { it.label.contains("Storage", ignoreCase = true) }?.value ?: "1TB SSD"
                    },
                    "Weight" to { id: String ->
                        SampleData.productDetails[id]?.specs?.find { it.label.contains("Weight", ignoreCase = true) }?.value ?: "2.5 kg"
                    },
                )

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, Color(0xFFF1F5F9), RoundedCornerShape(14.dp)),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
                ) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        specsList.forEachIndexed { index, (label, valueExtractor) ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(52.dp),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                // Label Cell (Column 1)
                                Box(
                                    modifier = Modifier
                                        .weight(0.9f)
                                        .fillMaxHeight()
                                        .background(Color(0xFFF0F5FE))
                                        .padding(horizontal = 12.dp),
                                    contentAlignment = Alignment.CenterStart,
                                ) {
                                    Text(
                                        text = label,
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Color(0xFF334155),
                                    )
                                }

                                // Product Cells
                                selectedProducts.forEachIndexed { pIndex, product ->
                                    if (pIndex > 0) {
                                        Box(
                                            modifier = Modifier
                                                .width(1.dp)
                                                .fillMaxHeight()
                                                .background(Color(0xFFF1F5F9)),
                                        )
                                    }
                                    Box(
                                        modifier = Modifier
                                            .weight(1.2f)
                                            .fillMaxHeight()
                                            .padding(horizontal = 8.dp),
                                        contentAlignment = Alignment.Center,
                                    ) {
                                        Text(
                                            text = valueExtractor(product.id),
                                            fontSize = 13.sp,
                                            fontWeight = FontWeight.Medium,
                                            textAlign = TextAlign.Center,
                                            color = Color(0xFF0D1326),
                                        )
                                    }
                                }
                            }

                            if (index != specsList.lastIndex) {
                                HorizontalDivider(color = Color(0xFFF1F5F9), thickness = 1.dp)
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Bottom Action Buttons Row (Matching Compare Screen.png)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    selectedProducts.forEachIndexed { index, product ->
                        Button(
                            onClick = { onProductClick(product.id) },
                            modifier = Modifier
                                .weight(1f)
                                .height(48.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (index == 0) Color(0xFFE8F1FF) else TitanBlue,
                                contentColor = if (index == 0) TitanBlue else Color.White,
                            ),
                            elevation = ButtonDefaults.buttonElevation(defaultElevation = 0.dp),
                        ) {
                            Text(
                                text = "View Details",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                            )
                        }
                    }
                }
            }
        }
    }
}
