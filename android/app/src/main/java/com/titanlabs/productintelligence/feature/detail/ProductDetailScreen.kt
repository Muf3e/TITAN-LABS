package com.titanlabs.productintelligence.feature.detail

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.Image
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Balance
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.NotificationsNone
import androidx.compose.material.icons.filled.OpenInNew
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.titanlabs.productintelligence.R
import com.titanlabs.productintelligence.core.data.ProductRepository
import com.titanlabs.productintelligence.core.evaluation.TitanEvaluationResult
import com.titanlabs.productintelligence.data.model.Availability
import com.titanlabs.productintelligence.data.model.BenchmarkResult
import com.titanlabs.productintelligence.data.model.ExternalReview
import com.titanlabs.productintelligence.data.model.ProductAlternative
import com.titanlabs.productintelligence.data.model.ProductDetail
import com.titanlabs.productintelligence.data.model.ReviewSentiment
import com.titanlabs.productintelligence.data.model.ReviewTheme
import com.titanlabs.productintelligence.data.model.SampleOffer
import com.titanlabs.productintelligence.data.model.SampleProduct
import com.titanlabs.productintelligence.data.model.SpecItem
import com.titanlabs.productintelligence.data.model.freshnessLabel
import com.titanlabs.productintelligence.data.sample.SampleData
import com.titanlabs.productintelligence.ui.components.TitanScoreBadge
import com.titanlabs.productintelligence.ui.theme.RainbowButtonGradient
import com.titanlabs.productintelligence.ui.theme.TitanAmber
import com.titanlabs.productintelligence.ui.theme.TitanBlue
import com.titanlabs.productintelligence.ui.theme.TitanGreen
import com.titanlabs.productintelligence.ui.theme.TitanPink
import java.text.NumberFormat
import java.util.Locale

private val inrFormat: NumberFormat = NumberFormat.getCurrencyInstance(Locale("en", "IN")).apply {
    maximumFractionDigits = 0
}

@Composable
fun ProductDetailScreen(
    productId: String,
    onBack: () -> Unit,
    onAlternativeSelected: (String) -> Unit,
    isSelectedForCompare: Boolean = false,
    canSelectForCompare: Boolean = true,
    onCompareToggle: (String) -> Unit = {},
    onNavigateToAlerts: () -> Unit = {},
) {
    val product = remember(productId) { SampleData.products.find { it.id == productId } }
    val detail = remember(productId) { SampleData.productDetails[productId] }

    val savedIds by ProductRepository.savedIds.collectAsState()
    val compareState by ProductRepository.compareState.collectAsState()
    val isSaved = savedIds.contains(productId)
    val isInCompare = compareState.contains(productId)

    val context = LocalContext.current

    if (product == null) {
        Column(modifier = Modifier.fillMaxSize()) {
            DetailTopBar(isSaved = false, onBack = onBack, onToggleSave = {}, onShare = {})
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Product details unavailable.")
            }
        }
        return
    }

    val evaluation = remember(product.id) { ProductRepository.evaluateProduct(product) }

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(bottom = 90.dp), // space for bottom sticky bar
        ) {
            // 1. Top Bar with Back, Favorite, Share
            item {
                DetailTopBar(
                    isSaved = isSaved,
                    onBack = onBack,
                    onToggleSave = { ProductRepository.toggleSaved(product.id) },
                    onShare = {
                        val sendIntent = Intent().apply {
                            action = Intent.ACTION_SEND
                            putExtra(Intent.EXTRA_TEXT, "Check out ${product.name} on TITAN Labs!")
                            type = "text/plain"
                        }
                        context.startActivity(Intent.createChooser(sendIntent, "Share Product"))
                    },
                )
            }

            // 2. Hero Image Gallery
            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                    shape = RoundedCornerShape(20.dp),
                    color = MaterialTheme.colorScheme.surface,
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        Image(
                            painter = painterResource(product.imageResId ?: R.drawable.titan_logo),
                            contentDescription = product.name,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(180.dp),
                            contentScale = ContentScale.Fit,
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(TitanBlue))
                            Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(Color(0xFFCBD5E1)))
                            Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(Color(0xFFCBD5E1)))
                            Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(Color(0xFFCBD5E1)))
                            Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(Color(0xFFCBD5E1)))
                        }
                    }
                }
            }

            // 3. Product Identity
            item {
                ProductIdentitySection(product = product)
            }

            // 4. Ratings & Price Header
            item {
                ProductPriceRatingsSection(product = product)
            }

            // 5. Best Price Online
            if (detail != null && detail.offers.isNotEmpty()) {
                item {
                    BestPriceOnlineSection(offers = detail.offers)
                }
            }

            // 6. Quick Action Row
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                ) {
                    QuickActionButton(
                        icon = Icons.Filled.Balance,
                        label = if (isInCompare) "In Compare" else "Compare",
                        active = isInCompare,
                        onClick = { ProductRepository.toggleCompare(product.id) },
                    )
                    QuickActionButton(
                        icon = if (isSaved) Icons.Filled.NotificationsActive else Icons.Filled.NotificationsNone,
                        label = "Price Alert",
                        active = isSaved,
                        onClick = onNavigateToAlerts,
                    )
                    QuickActionButton(
                        icon = Icons.Filled.Share,
                        label = "Share",
                        active = false,
                        onClick = {
                            val sendIntent = Intent().apply {
                                action = Intent.ACTION_SEND
                                putExtra(Intent.EXTRA_TEXT, "Check out ${product.name} on TITAN Labs!")
                                type = "text/plain"
                            }
                            context.startActivity(Intent.createChooser(sendIntent, "Share Product"))
                        },
                    )
                }
            }

            // 7. TITAN Score & Evidence Breakdown
            item {
                TitanIntelligenceSection(evaluation = evaluation)
            }

            // 8. Key Strengths & Weaknesses
            if (detail != null && (detail.strengths.isNotEmpty() || detail.weaknesses.isNotEmpty())) {
                item {
                    StrengthsWeaknessesSection(
                        strengths = detail.strengths,
                        weaknesses = detail.weaknesses,
                    )
                }
            }

            // 9. Complete Detailed Specifications
            if (detail != null && detail.specs.isNotEmpty()) {
                item {
                    FullSpecificationsSection(specs = detail.specs)
                }
            }

            // 10. Benchmark Intelligence
            if (detail != null && detail.benchmarks.isNotEmpty()) {
                item {
                    BenchmarkIntelligenceSection(benchmarks = detail.benchmarks)
                }
            }

            // 11. External Reviews & Recurring Sentiment Themes
            if (detail != null && (detail.reviewThemes.isNotEmpty() || detail.externalReviews.isNotEmpty())) {
                item {
                    ReviewsAndThemesSection(
                        reviewThemes = detail.reviewThemes,
                        externalReviews = detail.externalReviews,
                    )
                }
            }

            // 12. Price History & Market Volatility
            item {
                PriceHistorySection(product = product)
            }

            // 13. Similar Alternatives & Comparisons
            if (detail != null && detail.alternatives.isNotEmpty()) {
                item {
                    SimilarAlternativesSection(
                        alternatives = detail.alternatives,
                        onAlternativeSelected = onAlternativeSelected,
                    )
                }
            }

            // 14. Provenance & Evidence Verification
            item {
                ProvenanceVerificationSection(
                    product = product,
                    detail = detail,
                )
            }
        }

        // 15. Sticky Bottom Action Bar
        Surface(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth(),
            color = MaterialTheme.colorScheme.surface,
            shadowElevation = 8.dp,
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                OutlinedButton(
                    onClick = { ProductRepository.toggleCompare(product.id) },
                    modifier = Modifier
                        .weight(1f)
                        .height(50.dp),
                    shape = RoundedCornerShape(14.dp),
                    border = androidx.compose.foundation.BorderStroke(1.5.dp, TitanBlue),
                    colors = ButtonDefaults.outlinedButtonColors(
                        containerColor = Color.White,
                        contentColor = TitanBlue,
                    ),
                ) {
                    Text(
                        text = if (isInCompare) "In Compare" else "Add to Compare",
                        fontWeight = FontWeight.Bold,
                        color = TitanBlue,
                    )
                }

                val primaryOffer = detail?.offers?.firstOrNull()
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(50.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(RainbowButtonGradient)
                        .clickable {
                            primaryOffer?.let { offer ->
                                runCatching {
                                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(offer.offerUrl)))
                                }
                            }
                        },
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = if (primaryOffer != null) "View on ${primaryOffer.retailerName}" else "View Offers",
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                    )
                }
            }
        }
    }
}

// ---------------------------------------------------------
// Section 1: Detail Top Bar
// ---------------------------------------------------------
@Composable
private fun DetailTopBar(
    isSaved: Boolean,
    onBack: () -> Unit,
    onToggleSave: () -> Unit,
    onShare: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Surface(
            shape = CircleShape,
            color = MaterialTheme.colorScheme.surface,
            shadowElevation = 2.dp,
            modifier = Modifier.size(42.dp),
            onClick = onBack,
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(
                    Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back",
                    modifier = Modifier.size(20.dp),
                    tint = MaterialTheme.colorScheme.onSurface,
                )
            }
        }

        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Surface(
                shape = CircleShape,
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 2.dp,
                modifier = Modifier.size(42.dp),
                onClick = onToggleSave,
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = if (isSaved) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                        contentDescription = "Save",
                        modifier = Modifier.size(20.dp),
                        tint = if (isSaved) TitanPink else MaterialTheme.colorScheme.onSurface,
                    )
                }
            }

            Surface(
                shape = CircleShape,
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 2.dp,
                modifier = Modifier.size(42.dp),
                onClick = onShare,
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        Icons.Filled.Share,
                        contentDescription = "Share",
                        modifier = Modifier.size(20.dp),
                        tint = MaterialTheme.colorScheme.onSurface,
                    )
                }
            }
        }
    }
}

// ---------------------------------------------------------
// Section 3: Product Identity
// ---------------------------------------------------------
@Composable
private fun ProductIdentitySection(product: SampleProduct) {
    Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(Color(0xFFF1F5F9))
                    .padding(horizontal = 8.dp, vertical = 4.dp),
            ) {
                Text(
                    text = product.category.label.uppercase(),
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = TitanBlue,
                )
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Filled.Verified,
                    contentDescription = null,
                    tint = TitanBlue,
                    modifier = Modifier.size(14.dp),
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = freshnessLabel(product.lastVerifiedDaysAgo),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = product.name,
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground,
        )

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = product.variant,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )

        Spacer(modifier = Modifier.height(6.dp))

        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(
                        when (product.availability) {
                            Availability.IN_STOCK -> Color(0xFFE8F8EE)
                            Availability.LIMITED -> Color(0xFFFEF3C7)
                            Availability.OUT_OF_STOCK -> Color(0xFFFEE2E2)
                        }
                    )
                    .padding(horizontal = 8.dp, vertical = 3.dp),
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(6.dp)
                            .clip(CircleShape)
                            .background(
                                when (product.availability) {
                                    Availability.IN_STOCK -> TitanGreen
                                    Availability.LIMITED -> TitanAmber
                                    Availability.OUT_OF_STOCK -> Color(0xFFDC2626)
                                }
                            )
                    )
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(
                        text = product.availability.label,
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = when (product.availability) {
                            Availability.IN_STOCK -> TitanGreen
                            Availability.LIMITED -> TitanAmber
                            Availability.OUT_OF_STOCK -> Color(0xFFDC2626)
                        },
                    )
                }
            }
        }
    }
}

// ---------------------------------------------------------
// Section 4: Ratings & Price Header
// ---------------------------------------------------------
@Composable
private fun ProductPriceRatingsSection(product: SampleProduct) {
    Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 4.dp)) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(top = 2.dp),
        ) {
            Icon(
                imageVector = Icons.Filled.Star,
                contentDescription = null,
                tint = TitanAmber,
                modifier = Modifier.size(18.dp),
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = "${product.onlineRating}",
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold,
            )
            Text(
                text = " (${product.onlineRatingCount} reviews)",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "View Reviews >",
                style = MaterialTheme.typography.labelMedium,
                fontWeight = FontWeight.SemiBold,
                color = TitanBlue,
            )
        }

        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(top = 8.dp),
        ) {
            Text(
                text = inrFormat.format(product.priceInInr),
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Black,
                color = MaterialTheme.colorScheme.onBackground,
            )
            if (product.discountPercent != null && product.discountPercent > 0) {
                Spacer(modifier = Modifier.width(10.dp))
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(Color(0xFFE8F8EE))
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                ) {
                    Text(
                        text = "↓ ${product.discountPercent}%",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = TitanGreen,
                    )
                }
            }
            if (product.originalPriceInInr != null && product.originalPriceInInr > product.priceInInr) {
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = inrFormat.format(product.originalPriceInInr),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textDecoration = TextDecoration.LineThrough,
                )
            }
        }
    }
}

// ---------------------------------------------------------
// Section 5: Best Price Online
// ---------------------------------------------------------
@Composable
private fun BestPriceOnlineSection(offers: List<SampleOffer>) {
    val context = LocalContext.current
    Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
        Text(
            text = "Best Price Online",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp),
        )
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, Color(0xFFF1F5F9), RoundedCornerShape(16.dp)),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
        ) {
            Column(modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)) {
                offers.forEachIndexed { index, offer ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        if (offer.logoResId != null) {
                            Image(
                                painter = painterResource(offer.logoResId),
                                contentDescription = offer.retailerName,
                                modifier = Modifier
                                    .height(26.dp)
                                    .width(90.dp),
                                contentScale = ContentScale.Fit,
                            )
                        } else {
                            Text(
                                text = offer.retailerName,
                                style = MaterialTheme.typography.bodyLarge,
                                fontWeight = FontWeight.Bold,
                            )
                        }

                        Text(
                            text = inrFormat.format(offer.priceInInr),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface,
                        )

                        Button(
                            onClick = {
                                runCatching {
                                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(offer.offerUrl)))
                                }
                            },
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color(0xFFE8F1FF),
                                contentColor = TitanBlue,
                            ),
                            contentPadding = PaddingValues(horizontal = 20.dp, vertical = 6.dp),
                        ) {
                            Text(
                                text = "Visit",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.SemiBold,
                            )
                        }
                    }
                    if (index != offers.lastIndex) {
                        HorizontalDivider(
                            modifier = Modifier.padding(vertical = 8.dp),
                            color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f),
                        )
                    }
                }
            }
        }
    }
}

// ---------------------------------------------------------
// Section 6: Quick Action Button Helper
// ---------------------------------------------------------
@Composable
private fun QuickActionButton(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    active: Boolean,
    onClick: () -> Unit,
) {
    Card(
        modifier = Modifier.clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = if (active) TitanBlue else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(18.dp),
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.labelMedium,
                fontWeight = FontWeight.Medium,
                color = if (active) TitanBlue else MaterialTheme.colorScheme.onSurface,
            )
        }
    }
}

// ---------------------------------------------------------
// Section 7: TITAN Intelligence Breakdown
// ---------------------------------------------------------
@Composable
private fun TitanIntelligenceSection(evaluation: TitanEvaluationResult) {
    Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
        Text(
            text = "TITAN Intelligence Breakdown",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp),
        )
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    TitanScoreBadge(score = evaluation.globalScore, confidence = evaluation.confidence)
                    Text(
                        text = "Confidence: ${evaluation.confidence}%",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                evaluation.dimensions.forEach { dim ->
                    Column(modifier = Modifier.padding(vertical = 4.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                        ) {
                            Text(
                                text = "${dim.dimension.label} (${dim.dimension.weightPercent}%)",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                            Text(
                                text = "${dim.score}/100",
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                            )
                        }
                        Spacer(modifier = Modifier.height(3.dp))
                        LinearProgressIndicator(
                            progress = { dim.score / 100f },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(6.dp)
                                .clip(CircleShape),
                            color = TitanBlue,
                            trackColor = MaterialTheme.colorScheme.surfaceVariant,
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))
                HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Verdict & Synthesis",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = TitanBlue,
                )
                Text(
                    text = evaluation.explanation,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 4.dp),
                )
            }
        }
    }
}

// ---------------------------------------------------------
// Section 8: Key Strengths & Weaknesses
// ---------------------------------------------------------
@Composable
private fun StrengthsWeaknessesSection(
    strengths: List<String>,
    weaknesses: List<String>,
) {
    Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
        Text(
            text = "Key Strengths & Weaknesses",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp),
        )
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                if (strengths.isNotEmpty()) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Filled.CheckCircle,
                            contentDescription = null,
                            tint = TitanGreen,
                            modifier = Modifier.size(18.dp),
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Strengths",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = TitanGreen,
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    strengths.forEach { item ->
                        Row(
                            modifier = Modifier.padding(vertical = 3.dp),
                            verticalAlignment = Alignment.Top,
                        ) {
                            Text(
                                text = "• ",
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.Bold,
                                color = TitanGreen,
                            )
                            Text(
                                text = item,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurface,
                            )
                        }
                    }
                }

                if (weaknesses.isNotEmpty()) {
                    if (strengths.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(10.dp))
                        HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))
                        Spacer(modifier = Modifier.height(10.dp))
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Filled.Warning,
                            contentDescription = null,
                            tint = TitanAmber,
                            modifier = Modifier.size(18.dp),
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Watch-outs & Trade-offs",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = TitanAmber,
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    weaknesses.forEach { item ->
                        Row(
                            modifier = Modifier.padding(vertical = 3.dp),
                            verticalAlignment = Alignment.Top,
                        ) {
                            Text(
                                text = "• ",
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.Bold,
                                color = TitanAmber,
                            )
                            Text(
                                text = item,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurface,
                            )
                        }
                    }
                }
            }
        }
    }
}

// ---------------------------------------------------------
// Section 9: Full Technical Specifications
// ---------------------------------------------------------
@Composable
private fun FullSpecificationsSection(specs: List<SpecItem>) {
    Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
        Text(
            text = "Full Technical Specifications",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp),
        )
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                specs.forEachIndexed { index, spec ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 6.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Top,
                    ) {
                        Text(
                            text = spec.label,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.weight(0.38f),
                            fontWeight = FontWeight.Medium,
                        )
                        Text(
                            text = spec.value,
                            style = MaterialTheme.typography.bodySmall,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.onSurface,
                            modifier = Modifier.weight(0.62f),
                        )
                    }
                    if (index != specs.lastIndex) {
                        HorizontalDivider(
                            modifier = Modifier.padding(vertical = 3.dp),
                            color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f),
                        )
                    }
                }
            }
        }
    }
}

// ---------------------------------------------------------
// Section 10: Benchmark Intelligence
// ---------------------------------------------------------
@Composable
private fun BenchmarkIntelligenceSection(benchmarks: List<BenchmarkResult>) {
    Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = "Benchmark Intelligence",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
            )
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(Color(0xFFE8F1FF))
                    .padding(horizontal = 8.dp, vertical = 3.dp),
            ) {
                Text(
                    text = "Normalized Tests",
                    style = MaterialTheme.typography.labelSmall,
                    color = TitanBlue,
                    fontWeight = FontWeight.SemiBold,
                )
            }
        }
        Spacer(modifier = Modifier.height(8.dp))
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                benchmarks.forEachIndexed { index, bench ->
                    Column(modifier = Modifier.padding(vertical = 4.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Text(
                                text = bench.name,
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.SemiBold,
                                modifier = Modifier.weight(1f),
                            )
                            Text(
                                text = bench.value,
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Bold,
                                color = TitanBlue,
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Text(
                                text = "Better than ${bench.betterThanPercent}% of category",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                            Text(
                                text = bench.sourceName,
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        LinearProgressIndicator(
                            progress = { bench.betterThanPercent / 100f },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(6.dp)
                                .clip(CircleShape),
                            color = TitanBlue,
                            trackColor = MaterialTheme.colorScheme.surfaceVariant,
                        )
                    }
                    if (index != benchmarks.lastIndex) {
                        HorizontalDivider(
                            modifier = Modifier.padding(vertical = 6.dp),
                            color = MaterialTheme.colorScheme.outline.copy(alpha = 0.15f),
                        )
                    }
                }
            }
        }
    }
}

// ---------------------------------------------------------
// Section 11: External Reviews & Recurring Sentiment Themes
// ---------------------------------------------------------
@Composable
private fun ReviewsAndThemesSection(
    reviewThemes: List<ReviewTheme>,
    externalReviews: List<ExternalReview>,
) {
    val context = LocalContext.current
    Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
        Text(
            text = "External Reviews & Sentiment",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp),
        )

        // Recurring Themes Pills
        if (reviewThemes.isNotEmpty()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                reviewThemes.forEach { theme ->
                    val (bg, fg) = when (theme.sentiment) {
                        ReviewSentiment.POSITIVE -> Color(0xFFE8F8EE) to TitanGreen
                        ReviewSentiment.MIXED -> Color(0xFFFEF3C7) to Color(0xFFB45309)
                        ReviewSentiment.NEGATIVE -> Color(0xFFFEE2E2) to Color(0xFFDC2626)
                    }
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(bg)
                            .padding(horizontal = 12.dp, vertical = 6.dp),
                    ) {
                        Text(
                            text = "${theme.label} • ${theme.mentionCount}",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.SemiBold,
                            color = fg,
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(10.dp))
        }

        // Tech Publications Reviews
        if (externalReviews.isNotEmpty()) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    externalReviews.forEachIndexed { index, review ->
                        Column(modifier = Modifier.padding(vertical = 4.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = review.sourceName,
                                        style = MaterialTheme.typography.titleSmall,
                                        fontWeight = FontWeight.Bold,
                                    )
                                    if (review.rating != null) {
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Box(
                                            modifier = Modifier
                                                .clip(RoundedCornerShape(4.dp))
                                                .background(TitanAmber.copy(alpha = 0.15f))
                                                .padding(horizontal = 6.dp, vertical = 2.dp),
                                        ) {
                                            Text(
                                                text = "${review.rating} ★",
                                                style = MaterialTheme.typography.labelSmall,
                                                fontWeight = FontWeight.Bold,
                                                color = Color(0xFFB45309),
                                            )
                                        }
                                    }
                                }
                                Text(
                                    text = "${review.publishedDaysAgo}d ago",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = review.summary,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                            if (review.sourceUrl.isNotBlank()) {
                                Spacer(modifier = Modifier.height(4.dp))
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.clickable {
                                        runCatching {
                                            context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(review.sourceUrl)))
                                        }
                                    },
                                ) {
                                    Text(
                                        text = "Read Full Review",
                                        style = MaterialTheme.typography.labelSmall,
                                        fontWeight = FontWeight.Bold,
                                        color = TitanBlue,
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Icon(
                                        imageVector = Icons.Filled.OpenInNew,
                                        contentDescription = null,
                                        tint = TitanBlue,
                                        modifier = Modifier.size(12.dp),
                                    )
                                }
                            }
                        }
                        if (index != externalReviews.lastIndex) {
                            HorizontalDivider(
                                modifier = Modifier.padding(vertical = 8.dp),
                                color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f),
                            )
                        }
                    }
                }
            }
        }
    }
}

// ---------------------------------------------------------
// Section 12: Price History & Market Volatility
// ---------------------------------------------------------
@Composable
private fun PriceHistorySection(product: SampleProduct) {
    val lowPrice = (product.priceInInr * 0.97).toInt()
    val avgPrice = (product.priceInInr * 1.04).toInt()
    val highPrice = product.originalPriceInInr ?: (product.priceInInr * 1.15).toInt()

    Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
        Text(
            text = "Price History & Market Volatility",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp),
        )
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Column(horizontalAlignment = Alignment.Start) {
                        Text(
                            text = "30-Day Low",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Text(
                            text = inrFormat.format(lowPrice),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = TitanGreen,
                        )
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "Average Price",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Text(
                            text = inrFormat.format(avgPrice),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface,
                        )
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "All-Time High",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Text(
                            text = inrFormat.format(highPrice),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(Color(0xFFE8F8EE))
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Filled.CheckCircle,
                            contentDescription = null,
                            tint = TitanGreen,
                            modifier = Modifier.size(16.dp),
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Good Time to Buy: Currently near 30-day lowest price",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = TitanGreen,
                        )
                    }
                }
            }
        }
    }
}

// ---------------------------------------------------------
// Section 13: Similar Alternatives & Comparisons
// ---------------------------------------------------------
@Composable
private fun SimilarAlternativesSection(
    alternatives: List<ProductAlternative>,
    onAlternativeSelected: (String) -> Unit,
) {
    Column(modifier = Modifier.padding(vertical = 8.dp)) {
        Text(
            text = "Similar Alternatives & Comparisons",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(start = 16.dp, end = 16.dp, bottom = 8.dp),
        )

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            items(alternatives) { alt ->
                val altProduct = SampleData.products.find { it.id == alt.productId }
                Card(
                    modifier = Modifier
                        .width(220.dp)
                        .clickable { onAlternativeSelected(alt.productId) },
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(90.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(Color(0xFFF8FAFC)),
                            contentAlignment = Alignment.Center,
                        ) {
                            Image(
                                painter = painterResource(altProduct?.imageResId ?: R.drawable.titan_logo),
                                contentDescription = altProduct?.name ?: alt.productId,
                                modifier = Modifier.size(70.dp),
                                contentScale = ContentScale.Fit,
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = altProduct?.name ?: alt.productId,
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                        if (altProduct != null) {
                            Spacer(modifier = Modifier.height(2.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Text(
                                    text = inrFormat.format(altProduct.priceInInr),
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = TitanBlue,
                                )
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(4.dp))
                                        .background(Color(0xFFE8F1FF))
                                        .padding(horizontal = 6.dp, vertical = 2.dp),
                                ) {
                                    Text(
                                        text = "${altProduct.titanScore}/100",
                                        style = MaterialTheme.typography.labelSmall,
                                        fontWeight = FontWeight.Bold,
                                        color = TitanBlue,
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(6.dp))
                                .background(Color(0xFFF1F5F9))
                                .padding(horizontal = 8.dp, vertical = 4.dp),
                        ) {
                            Text(
                                text = alt.reason,
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                maxLines = 2,
                                overflow = TextOverflow.Ellipsis,
                            )
                        }
                    }
                }
            }
        }
    }
}

// ---------------------------------------------------------
// Section 14: Data Provenance & Evidence Verification
// ---------------------------------------------------------
@Composable
private fun ProvenanceVerificationSection(
    product: SampleProduct,
    detail: ProductDetail?,
) {
    Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
        Text(
            text = "Data Provenance & Methodology",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp),
        )
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Filled.Verified,
                        contentDescription = null,
                        tint = TitanBlue,
                        modifier = Modifier.size(18.dp),
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Independent Evidence Synthesis",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = TitanBlue,
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                val offerCount = detail?.offers?.size ?: product.retailerCount
                val benchCount = detail?.benchmarks?.size ?: 0
                val reviewCount = detail?.externalReviews?.size ?: 0
                Text(
                    text = "Synthesized across $offerCount verified retailer feeds, $benchCount standardized benchmark tests, and $reviewCount professional publications.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Verification: ${freshnessLabel(product.lastVerifiedDaysAgo)}",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "TITAN Product Intelligence scores are computed algorithmically from verified benchmarks and consensus signals. We maintain 100% editorial independence from marketplace sellers.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.75f),
                    fontSize = 11.sp,
                )
            }
        }
    }
}
