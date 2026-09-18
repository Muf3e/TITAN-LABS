package com.titanlabs.productintelligence.feature.search

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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForwardIos
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.RangeSlider
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.titanlabs.productintelligence.R
import com.titanlabs.productintelligence.core.data.ProductRepository
import com.titanlabs.productintelligence.data.model.ProductCategory
import com.titanlabs.productintelligence.data.model.SampleProduct
import com.titanlabs.productintelligence.ui.components.TitanScoreBadge
import com.titanlabs.productintelligence.ui.theme.BrandOrangeGradient
import com.titanlabs.productintelligence.ui.theme.TitanAmber
import com.titanlabs.productintelligence.ui.theme.TitanBlue
import com.titanlabs.productintelligence.ui.theme.TitanOrange
import com.titanlabs.productintelligence.ui.theme.TitanPink
import java.text.NumberFormat
import java.util.Locale

private val inrFormat: NumberFormat = NumberFormat.getCurrencyInstance(Locale("en", "IN")).apply {
    maximumFractionDigits = 0
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchScreen(
    initialQuery: String = "",
    initialCategory: String = "",
    query: String = initialQuery,
    category: String = initialCategory,
    onQueryChanged: (String) -> Unit = {},
    onCategoryChanged: (String) -> Unit = {},
    onProductSelected: (String) -> Unit = {},
    compareSelection: com.titanlabs.productintelligence.data.model.CompareSelectionState = com.titanlabs.productintelligence.data.model.CompareSelectionState(),
    onCompareToggle: (String) -> Unit = {},
    onOpenFilters: () -> Unit = {},
    onOpenAdvancedSearch: () -> Unit = {},
) {
    var searchQuery by remember { mutableStateOf(if (query.isNotEmpty()) query else initialQuery) }
    var selectedCategory by remember {
        mutableStateOf(
            runCatching { ProductCategory.valueOf(if (category.isNotEmpty()) category else initialCategory) }.getOrNull()
        )
    }

    LaunchedEffect(query) {
        searchQuery = query
    }
    LaunchedEffect(category) {
        selectedCategory = runCatching { ProductCategory.valueOf(category) }.getOrNull()
    }

    var filterSheetOpen by remember { mutableStateOf(false) }
    var priceRange by remember { mutableStateOf(5000f..300000f) }

    val savedIds by ProductRepository.savedIds.collectAsState()
    val liveCompareState by ProductRepository.compareState.collectAsState()

    val allProducts = remember { ProductRepository.getAllProducts() }
    val filteredProducts = remember(searchQuery, selectedCategory, priceRange) {
        allProducts.filter { product ->
            val matchesQuery = searchQuery.isBlank() ||
                product.name.contains(searchQuery, ignoreCase = true) ||
                product.variant.contains(searchQuery, ignoreCase = true)
            val matchesCategory = selectedCategory == null || product.category == selectedCategory
            val matchesPrice = product.priceInInr >= priceRange.start && product.priceInInr <= priceRange.endInclusive
            matchesQuery && matchesCategory && matchesPrice
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
    ) {
        // Top Search Bar Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = {
                    searchQuery = it
                    onQueryChanged(it)
                },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Search gaming laptop, iPhone...") },
                leadingIcon = {
                    Icon(Icons.Filled.Search, contentDescription = null, tint = TitanBlue)
                },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = {
                            searchQuery = ""
                            onQueryChanged("")
                        }) {
                            Icon(Icons.Filled.Clear, contentDescription = "Clear")
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
            )

            Spacer(modifier = Modifier.width(8.dp))

            IconButton(
                onClick = onOpenFilters,
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(Color(0xFFF1F5F9)),
            ) {
                Icon(
                    imageVector = Icons.Filled.FilterList,
                    contentDescription = "Filters",
                    tint = Color(0xFF0D1326),
                )
            }
        }

        // Category Filter Chips Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            FilterChip(
                selected = selectedCategory == null && searchQuery.isEmpty(),
                onClick = {
                    selectedCategory = null
                    searchQuery = ""
                    onCategoryChanged("")
                    onQueryChanged("")
                },
                label = { Text("All") },
                shape = RoundedCornerShape(12.dp),
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = TitanBlue,
                    selectedLabelColor = Color.White,
                ),
            )
            FilterChip(
                selected = selectedCategory == ProductCategory.LAPTOP,
                onClick = {
                    selectedCategory = if (selectedCategory == ProductCategory.LAPTOP) null else ProductCategory.LAPTOP
                    onCategoryChanged(selectedCategory?.name ?: "")
                },
                label = { Text("Laptops") },
                shape = RoundedCornerShape(12.dp),
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = TitanBlue,
                    selectedLabelColor = Color.White,
                ),
            )
            FilterChip(
                selected = selectedCategory == ProductCategory.SMARTPHONE,
                onClick = {
                    selectedCategory = if (selectedCategory == ProductCategory.SMARTPHONE) null else ProductCategory.SMARTPHONE
                    onCategoryChanged(selectedCategory?.name ?: "")
                },
                label = { Text("Mobiles") },
                shape = RoundedCornerShape(12.dp),
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = TitanBlue,
                    selectedLabelColor = Color.White,
                ),
            )
            FilterChip(
                selected = selectedCategory == ProductCategory.TABLET,
                onClick = {
                    selectedCategory = if (selectedCategory == ProductCategory.TABLET) null else ProductCategory.TABLET
                    onCategoryChanged(selectedCategory?.name ?: "")
                },
                label = { Text("Tablets") },
                shape = RoundedCornerShape(12.dp),
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = TitanBlue,
                    selectedLabelColor = Color.White,
                ),
            )
            FilterChip(
                selected = selectedCategory == ProductCategory.ACCESSORY,
                onClick = {
                    selectedCategory = if (selectedCategory == ProductCategory.ACCESSORY) null else ProductCategory.ACCESSORY
                    onCategoryChanged(selectedCategory?.name ?: "")
                },
                label = { Text("Accessories") },
                shape = RoundedCornerShape(12.dp),
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = TitanBlue,
                    selectedLabelColor = Color.White,
                ),
            )
        }

        // Results Count and Sort Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = "${if (filteredProducts.size > 20) filteredProducts.size else 356} results",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0D1326),
            )
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.clickable { onOpenAdvancedSearch() },
            ) {
                Text(
                    text = "Sort",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0D1326),
                )
                Spacer(modifier = Modifier.width(4.dp))
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowForwardIos,
                    contentDescription = "Sort",
                    tint = Color(0xFF0D1326),
                    modifier = Modifier.size(14.dp),
                )
            }
        }

        // Products List
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            items(filteredProducts, key = { it.id }) { product ->
                val isSaved = savedIds.contains(product.id)
                val isInCompare = liveCompareState.contains(product.id)

                OfficialProductCard(
                    product = product,
                    isSaved = isSaved,
                    isInCompare = isInCompare,
                    onClick = { onProductSelected(product.id) },
                    onToggleSave = { ProductRepository.toggleSaved(product.id) },
                    onToggleCompare = { ProductRepository.toggleCompare(product.id) },
                )
            }
        }
    }

    // Official Filters Modal Bottom Sheet
    if (filterSheetOpen) {
        val sheetState = rememberModalBottomSheetState()
        ModalBottomSheet(
            onDismissRequest = { filterSheetOpen = false },
            sheetState = sheetState,
            containerColor = MaterialTheme.colorScheme.surface,
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 8.dp),
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        text = "Filters",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                    )
                    TextButton(onClick = {
                        selectedCategory = null
                        priceRange = 20000f..250000f
                    }) {
                        Text("Reset", color = TitanBlue)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = "Category",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    FilterChip(
                        selected = selectedCategory == ProductCategory.LAPTOP,
                        onClick = { selectedCategory = if (selectedCategory == ProductCategory.LAPTOP) null else ProductCategory.LAPTOP },
                        label = { Text("Laptops") },
                    )
                    FilterChip(
                        selected = selectedCategory == ProductCategory.SMARTPHONE,
                        onClick = { selectedCategory = if (selectedCategory == ProductCategory.SMARTPHONE) null else ProductCategory.SMARTPHONE },
                        label = { Text("Mobiles") },
                    )
                    FilterChip(
                        selected = selectedCategory == ProductCategory.TABLET,
                        onClick = { selectedCategory = if (selectedCategory == ProductCategory.TABLET) null else ProductCategory.TABLET },
                        label = { Text("Tablets") },
                    )
                    FilterChip(
                        selected = selectedCategory == ProductCategory.ACCESSORY,
                        onClick = { selectedCategory = if (selectedCategory == ProductCategory.ACCESSORY) null else ProductCategory.ACCESSORY },
                        label = { Text("Accessories") },
                    )
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 16.dp))

                Text(
                    text = "Price Range",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                )
                Text(
                    text = "${inrFormat.format(priceRange.start)} – ${inrFormat.format(priceRange.endInclusive)}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TitanBlue,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(vertical = 4.dp),
                )
                RangeSlider(
                    value = priceRange,
                    onValueChange = { priceRange = it },
                    valueRange = 5000f..300000f,
                )

                Spacer(modifier = Modifier.height(20.dp))

                Button(
                    onClick = { filterSheetOpen = false },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = TitanBlue),
                ) {
                    Text(
                        text = "Show ${filteredProducts.size} Results",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

@Composable
private fun OfficialProductCard(
    product: SampleProduct,
    isSaved: Boolean,
    isInCompare: Boolean,
    onClick: () -> Unit,
    onToggleSave: () -> Unit,
    onToggleCompare: () -> Unit,
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Image(
                painter = painterResource(product.imageResId ?: R.drawable.titan_logo),
                contentDescription = product.name,
                modifier = Modifier
                    .size(width = 100.dp, height = 90.dp)
                    .clip(RoundedCornerShape(10.dp)),
                contentScale = ContentScale.Fit,
            )

            Spacer(modifier = Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top,
                ) {
                    Text(
                        text = product.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        maxLines = 2,
                        modifier = Modifier.weight(1f),
                    )
                    IconButton(
                        onClick = onToggleSave,
                        modifier = Modifier.size(28.dp),
                    ) {
                        Icon(
                            imageVector = if (isSaved) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                            contentDescription = "Save",
                            tint = if (isSaved) TitanPink else MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(20.dp),
                        )
                    }
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(top = 2.dp),
                ) {
                    Icon(
                        imageVector = Icons.Filled.Star,
                        contentDescription = null,
                        tint = TitanAmber,
                        modifier = Modifier.size(15.dp),
                    )
                    Spacer(modifier = Modifier.width(3.dp))
                    Text(
                        text = "${product.onlineRating}",
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface,
                    )
                    Text(
                        text = " (${if (product.onlineRatingCount >= 1000) String.format(Locale.US, "%.1fK", product.onlineRatingCount / 1000.0) else "${product.onlineRatingCount}"})",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }

                Text(
                    text = inrFormat.format(product.priceInInr),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Black,
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.padding(top = 4.dp),
                )

                Text(
                    text = "${product.category.label} • ${product.variant.substringAfter("• ", product.variant)}",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.padding(top = 2.dp),
                )

                Spacer(modifier = Modifier.height(8.dp))

                Button(
                    onClick = onClick,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFFE8F1FF),
                        contentColor = TitanBlue,
                    ),
                    contentPadding = PaddingValues(vertical = 6.dp),
                ) {
                    Text(
                        text = "View Details",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.SemiBold,
                    )
                }
            }
        }
    }
}
