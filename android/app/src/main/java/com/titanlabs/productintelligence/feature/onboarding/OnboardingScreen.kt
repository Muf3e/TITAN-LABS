package com.titanlabs.productintelligence.feature.onboarding

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.titanlabs.productintelligence.R
import com.titanlabs.productintelligence.ui.theme.RainbowButtonGradient
import com.titanlabs.productintelligence.ui.theme.TitanBlue

data class OnboardingPageData(
    val titleFirst: String,
    val titleHighlight: AnnotatedString,
    val description: String,
    val buttonText: String,
    val imageResId: Int,
)

@Composable
fun OnboardingScreen(
    onFinish: () -> Unit = {},
) {
    var currentPage by remember { mutableIntStateOf(0) }

    val pages = listOf(
        OnboardingPageData(
            titleFirst = "Find the Perfect",
            titleHighlight = buildAnnotatedString {
                withStyle(SpanStyle(color = Color(0xFF0D1326))) { append("Tech for You") }
            },
            description = "Compare specifications, prices, pros & cons all in one place.",
            buttonText = "Get Started",
            imageResId = R.drawable.onboarding_1,
        ),
        OnboardingPageData(
            titleFirst = "Compare Before",
            titleHighlight = buildAnnotatedString {
                withStyle(SpanStyle(color = Color(0xFF0066FF))) { append("You ") }
                withStyle(SpanStyle(color = Color(0xFFFF5A36))) { append("Decide") }
            },
            description = "Check prices, specs, reviews and more across top brands, all in one place.",
            buttonText = "Next",
            imageResId = R.drawable.onboarding_2,
        ),
        OnboardingPageData(
            titleFirst = "Smarter Choices",
            titleHighlight = buildAnnotatedString {
                withStyle(SpanStyle(color = Color(0xFF0066FF))) { append("Brighter ") }
                withStyle(SpanStyle(color = Color(0xFFFF5A36))) { append("Tomorrow") }
            },
            description = "Discover. Compare. Decide. All in one place.",
            buttonText = "Get Started",
            imageResId = R.drawable.onboarding_3,
        ),
        OnboardingPageData(
            titleFirst = "Never Miss",
            titleHighlight = buildAnnotatedString {
                withStyle(SpanStyle(color = Color(0xFF0D1326))) { append("a ") }
                withStyle(SpanStyle(color = Color(0xFFD946EF))) { append("Better ") }
                withStyle(SpanStyle(color = Color(0xFFF97316))) { append("Deal") }
            },
            description = "Set price alerts and get notified when prices drop.",
            buttonText = "Next",
            imageResId = R.drawable.onboarding_4,
        ),
    )

    val page = pages[currentPage]

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(horizontal = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        // Top Row: Skip button
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 16.dp, bottom = 8.dp),
            horizontalArrangement = Arrangement.End,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            TextButton(onClick = onFinish) {
                Text(
                    text = "Skip",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF0D1326),
                )
            }
        }

        Spacer(modifier = Modifier.weight(0.2f))

        // Hero illustration
        Image(
            painter = painterResource(page.imageResId),
            contentDescription = null,
            modifier = Modifier
                .fillMaxWidth()
                .height(300.dp),
            contentScale = ContentScale.Fit,
        )

        Spacer(modifier = Modifier.weight(0.3f))

        // Title and Description
        Text(
            text = page.titleFirst,
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF0D1326),
            textAlign = TextAlign.Center,
        )
        Text(
            text = page.titleHighlight,
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center,
        )

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = page.description,
            style = MaterialTheme.typography.bodyLarge,
            color = Color(0xFF6B7280),
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 16.dp),
        )

        Spacer(modifier = Modifier.height(28.dp))

        // 4 pagination dots
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            repeat(pages.size) { index ->
                val isSelected = index == currentPage
                Box(
                    modifier = Modifier
                        .size(if (isSelected) 10.dp else 8.dp)
                        .clip(CircleShape)
                        .background(if (isSelected) TitanBlue else Color(0xFFCBD5E1)),
                )
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // Bottom Gradient Button
        Button(
            onClick = {
                if (currentPage < pages.size - 1) {
                    currentPage++
                } else {
                    onFinish()
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
                .background(RainbowButtonGradient, RoundedCornerShape(16.dp)),
            colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
            shape = RoundedCornerShape(16.dp),
            contentPadding = PaddingValues(0.dp),
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center,
            ) {
                Text(
                    text = page.buttonText,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                )
                Spacer(modifier = Modifier.width(8.dp))
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(20.dp),
                )
            }
        }

        Spacer(modifier = Modifier.height(36.dp))
    }
}
