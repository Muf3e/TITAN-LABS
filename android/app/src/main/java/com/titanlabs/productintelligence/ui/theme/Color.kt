package com.titanlabs.productintelligence.ui.theme

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// Official Brand Colors from TITAN LABS Design System
val TitanBlue = Color(0xFF0066FF)
val TitanCyan = Color(0xFF00C6FF)
val TitanPurple = Color(0xFF7B2CBF)
val TitanPink = Color(0xFFE91E63)
val TitanOrange = Color(0xFFFF5E3A)
val TitanAmber = Color(0xFFFFA000)
val TitanGreen = Color(0xFF00C853)

// Light Theme Palette
val BackgroundLight = Color(0xFFF8F9FD)
val SurfaceLight = Color(0xFFFFFFFF)
val SurfaceVariantLight = Color(0xFFF1F5F9)
val OutlineLight = Color(0xFFE2E8F0)
val InkLight = Color(0xFF0F172A)
val InkMutedLight = Color(0xFF64748B)

// Dark Theme Palette
val BackgroundDark = Color(0xFF0B0F19)
val SurfaceDark = Color(0xFF131B2E)
val SurfaceVariantDark = Color(0xFF1E293B)
val OutlineDark = Color(0xFF334155)
val InkDark = Color(0xFFF8FAFC)
val InkMutedDark = Color(0xFF94A3B8)

// Semantic Accents
val TealLight = TitanBlue
val TealOnLight = Color.White
val AmberLight = TitanOrange
val AmberOnLight = Color.White
val ErrorLight = Color(0xFFEF4444)

val TealDark = TitanCyan
val TealOnDark = Color.Black
val AmberDark = TitanAmber
val AmberOnDark = Color.Black
val ErrorDark = Color(0xFFF87171)

// Reusable Brand Gradients
val BrandOrangeGradient = Brush.horizontalGradient(
    listOf(Color(0xFFFF5722), Color(0xFFFFA000))
)

val BrandBlueGradient = Brush.horizontalGradient(
    listOf(Color(0xFF00C6FF), Color(0xFF0066FF))
)

val BrandPurpleGradient = Brush.horizontalGradient(
    listOf(Color(0xFF7B2CBF), Color(0xFF9D4EDD))
)

val BrandHeroGradient = Brush.linearGradient(
    listOf(Color(0xFF00C6FF), Color(0xFF7B2CBF), Color(0xFFFF5E3A))
)

val RainbowButtonGradient = Brush.horizontalGradient(
    listOf(
        Color(0xFFFFA03A),
        Color(0xFFFF2A85),
        Color(0xFF7B2CBF),
        Color(0xFF0077FF)
    )
)
