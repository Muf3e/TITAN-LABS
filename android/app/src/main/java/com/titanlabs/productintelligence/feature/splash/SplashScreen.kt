package com.titanlabs.productintelligence.feature.splash

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
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
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.titanlabs.productintelligence.R
import com.titanlabs.productintelligence.ui.theme.RainbowButtonGradient
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(
    onSplashFinished: () -> Unit = {},
) {
    var progressTarget by remember { mutableFloatStateOf(0.1f) }
    val animatedProgress by animateFloatAsState(
        targetValue = progressTarget,
        animationSpec = tween(durationMillis = 2800, easing = FastOutSlowInEasing),
        label = "SplashProgress",
    )

    LaunchedEffect(Unit) {
        progressTarget = 1f
        delay(3200)
        onSplashFinished()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White),
    ) {
        // Top-left organic gradient blob
        Box(
            modifier = Modifier
                .size(200.dp)
                .align(Alignment.TopStart)
                .background(
                    Brush.radialGradient(
                        colors = listOf(
                            Color(0x9900C6FF),
                            Color(0x77FF2D7A),
                            Color(0x55FFA03A),
                            Color.Transparent,
                        ),
                        center = androidx.compose.ui.geometry.Offset(0f, 0f),
                        radius = 420f,
                    )
                ),
        )

        // Bottom-right organic gradient blob
        Box(
            modifier = Modifier
                .size(240.dp)
                .align(Alignment.BottomEnd)
                .background(
                    Brush.radialGradient(
                        colors = listOf(
                            Color(0xAA7B2CBF),
                            Color(0x88FF2D7A),
                            Color(0x6600C6FF),
                            Color.Transparent,
                        ),
                        center = androidx.compose.ui.geometry.Offset(700f, 700f),
                        radius = 500f,
                    )
                ),
        )

        // Main content in center
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Spacer(modifier = Modifier.weight(1f))

            // Logo and Branding
            Image(
                painter = painterResource(R.drawable.titan_logo),
                contentDescription = "TITAN LABS",
                modifier = Modifier
                    .fillMaxWidth(0.75f)
                    .height(280.dp),
                contentScale = ContentScale.Fit,
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Tagline
            Text(
                text = "Smarter Choices",
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0D1326),
            )

            Text(
                text = buildAnnotatedString {
                    withStyle(SpanStyle(color = Color(0xFF0066FF))) { append("Brighter ") }
                    withStyle(SpanStyle(color = Color(0xFFFF5A36))) { append("Tomorrow") }
                },
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold,
            )

            Spacer(modifier = Modifier.weight(1f))

            // Loading bar matching Splash screen.png
            Box(
                modifier = Modifier
                    .width(220.dp)
                    .height(6.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFE2E8F0)),
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(animatedProgress)
                        .height(6.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.horizontalGradient(
                                listOf(
                                    Color(0xFF00C6FF),
                                    Color(0xFF0072FF),
                                    Color(0xFF7B2CBF),
                                )
                            )
                        ),
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = "Loading amazing tech experiences...",
                fontSize = 13.sp,
                color = Color(0xFF6B7280),
            )

            Spacer(modifier = Modifier.height(48.dp))
        }
    }
}
