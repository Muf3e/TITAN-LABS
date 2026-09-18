package com.titanlabs.productintelligence.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val TitanLightColorScheme = lightColorScheme(
    primary = TitanBlue,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFE0EDFF),
    onPrimaryContainer = Color(0xFF003D99),
    secondary = TitanOrange,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFFFE8E2),
    onSecondaryContainer = Color(0xFF992600),
    tertiary = TitanPurple,
    onTertiary = Color.White,
    background = BackgroundLight,
    onBackground = InkLight,
    surface = SurfaceLight,
    onSurface = InkLight,
    surfaceVariant = SurfaceVariantLight,
    onSurfaceVariant = InkMutedLight,
    outline = OutlineLight,
    outlineVariant = Color(0xFFCBD5E1),
    error = ErrorLight,
)

private val TitanDarkColorScheme = darkColorScheme(
    primary = TitanCyan,
    onPrimary = Color.Black,
    primaryContainer = Color(0xFF004080),
    onPrimaryContainer = Color(0xFFB3D7FF),
    secondary = TitanOrange,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFF661900),
    onSecondaryContainer = Color(0xFFFFCCB3),
    tertiary = Color(0xFF9D4EDD),
    onTertiary = Color.White,
    background = BackgroundDark,
    onBackground = InkDark,
    surface = SurfaceDark,
    onSurface = InkDark,
    surfaceVariant = SurfaceVariantDark,
    onSurfaceVariant = InkMutedDark,
    outline = OutlineDark,
    outlineVariant = Color(0xFF475569),
    error = ErrorDark,
)

@Composable
fun TitanProductIntelligenceTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colorScheme = if (darkTheme) TitanDarkColorScheme else TitanLightColorScheme
    MaterialTheme(
        colorScheme = colorScheme,
        typography = TitanTypography,
        content = content,
    )
}
