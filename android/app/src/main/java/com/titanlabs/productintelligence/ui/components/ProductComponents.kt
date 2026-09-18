package com.titanlabs.productintelligence.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.material.icons.outlined.FactCheck
import androidx.compose.material.icons.outlined.Schedule
import com.titanlabs.productintelligence.data.model.Availability
import com.titanlabs.productintelligence.data.model.DataFreshness
import com.titanlabs.productintelligence.data.model.SampleProduct
import com.titanlabs.productintelligence.data.model.freshnessFor
import com.titanlabs.productintelligence.data.model.freshnessLabel
import com.titanlabs.productintelligence.data.model.titanScoreBand
import com.titanlabs.productintelligence.R
import com.titanlabs.productintelligence.ui.theme.AmberDark
import com.titanlabs.productintelligence.ui.theme.AmberLight

val CardCornerRadius = 8.dp

@Composable
fun TitanScoreBadge(score: Int, confidence: Int = 85, modifier: Modifier = Modifier) {
    val band = titanScoreBand(score)
    Row(
        modifier = modifier
            .background(
                color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
                shape = RoundedCornerShape(CardCornerRadius),
            )
            .padding(horizontal = 10.dp, vertical = 6.dp)
            .semantics { contentDescription = "TITAN Score $score of 100, $band, confidence $confidence of 100" },
        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
    ) {
        Text(
            text = "TITAN $score",
            color = MaterialTheme.colorScheme.primary,
            style = MaterialTheme.typography.labelLarge,
            fontWeight = FontWeight.SemiBold,
            maxLines = 1,
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text(
            text = band,
            color = MaterialTheme.colorScheme.primary,
            style = MaterialTheme.typography.labelMedium,
            maxLines = 1,
        )
    }
}

@Composable
fun OnlineRatingDisplay(rating: Double, count: Int, modifier: Modifier = Modifier) {
    Row(
        modifier = modifier.semantics {
            contentDescription = "Online rating $rating out of 5 from $count reviews"
        },
        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
    ) {
        Icon(
            imageVector = Icons.Filled.Star,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.width(16.dp),
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = "$rating",
            style = MaterialTheme.typography.labelLarge,
            color = MaterialTheme.colorScheme.onSurface,
        )
        Text(
            text = " (${count} online)",
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
fun AvailabilityChip(availability: Availability, modifier: Modifier = Modifier) {
    val isPositive = availability == Availability.IN_STOCK
    val amber = if (MaterialTheme.colorScheme.background.luminanceIsDark()) AmberDark else AmberLight
    val color = if (isPositive) MaterialTheme.colorScheme.primary else amber
    Row(
        modifier = modifier
            .background(color.copy(alpha = 0.14f), RoundedCornerShape(CardCornerRadius))
            .padding(horizontal = 8.dp, vertical = 4.dp),
    ) {
        Text(
            text = availability.label,
            style = MaterialTheme.typography.labelSmall,
            color = color,
        )
    }
}

private fun Color.luminanceIsDark(): Boolean {
    val luminance = 0.299 * red + 0.587 * green + 0.114 * blue
    return luminance < 0.5
}

@Composable
fun EvidenceConfidenceIndicator(confidence: Int, modifier: Modifier = Modifier) {
    Row(
        modifier = modifier.semantics {
            contentDescription = "Evidence confidence $confidence of 100"
        },
        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
    ) {
        Icon(
            imageVector = Icons.Outlined.FactCheck,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.width(16.dp),
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = "$confidence% evidence",
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
fun FreshnessIndicator(daysAgo: Int, modifier: Modifier = Modifier) {
    val band = freshnessFor(daysAgo)
    val amber = if (MaterialTheme.colorScheme.background.luminanceIsDark()) AmberDark else AmberLight
    val color = when (band) {
        DataFreshness.FRESH -> MaterialTheme.colorScheme.onSurfaceVariant
        DataFreshness.RECENT -> MaterialTheme.colorScheme.onSurfaceVariant
        DataFreshness.STALE -> amber
    }
    Row(
        modifier = modifier.semantics {
            contentDescription = freshnessLabel(daysAgo) + if (band == DataFreshness.STALE) ", data may be outdated" else ""
        },
        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
    ) {
        Icon(
            imageVector = Icons.Outlined.Schedule,
            contentDescription = null,
            tint = color,
            modifier = Modifier.width(16.dp),
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = freshnessLabel(daysAgo),
            style = MaterialTheme.typography.labelMedium,
            color = color,
        )
    }
}

@Composable
fun SampleDataBadge(modifier: Modifier = Modifier) {
    Text(
        text = "SAMPLE DATA",
        style = MaterialTheme.typography.labelSmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        fontWeight = FontWeight.SemiBold,
        modifier = modifier,
    )
}

@Composable
fun ProductResultCard(
    product: SampleProduct,
    onClick: () -> Unit,
    isSelectedForCompare: Boolean = false,
    canSelectForCompare: Boolean = true,
    onCompareToggle: () -> Unit = {},
    modifier: Modifier = Modifier,
) {
    Card(
        shape = RoundedCornerShape(CardCornerRadius),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClickLabel = "Open ${product.name}", onClick = onClick),
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            androidx.compose.foundation.Image(
                painter = painterResource(R.drawable.titan_logo),
                contentDescription = "Sample image for ${product.name}",
                contentScale = ContentScale.Fit,
                modifier = Modifier.fillMaxWidth().height(92.dp).padding(bottom = 10.dp),
            )
            Text(
                text = product.name,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurface,
            )
            Text(
                text = product.variant,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 2.dp),
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
                horizontalArrangement = Arrangement.End,
            ) {
                Checkbox(
                    checked = isSelectedForCompare,
                    onCheckedChange = { onCompareToggle() },
                    enabled = canSelectForCompare || isSelectedForCompare,
                )
                Text(
                    text = "Compare",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
            ) {
                TitanScoreBadge(score = product.titanScore, confidence = product.evidenceConfidence)
                OnlineRatingDisplay(rating = product.onlineRating, count = product.onlineRatingCount)
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
            ) {
                Text(
                    text = "₹${"%,d".format(product.priceInInr)}",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface,
                )
                Text(
                    text = "${product.retailerCount} retailers",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
            ) {
                AvailabilityChip(availability = product.availability)
                FreshnessIndicator(daysAgo = product.lastVerifiedDaysAgo)
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
            ) {
                EvidenceConfidenceIndicator(confidence = product.evidenceConfidence)
            }

            Column(modifier = Modifier.padding(top = 10.dp)) {
                LabeledLine(label = "+", text = product.topPro)
                LabeledLine(label = "-", text = product.topCon)
            }
        }
    }
}

@Composable
private fun LabeledLine(label: String, text: String) {
    Row {
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.width(16.dp),
        )
        Text(
            text = text,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
fun SectionHeader(title: String, modifier: Modifier = Modifier, trailing: @Composable RowScope.() -> Unit = {}) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onSurface,
        )
        trailing()
    }
}
