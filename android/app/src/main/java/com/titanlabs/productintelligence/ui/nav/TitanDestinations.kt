package com.titanlabs.productintelligence.ui.nav

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Balance
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.ui.graphics.vector.ImageVector
import com.titanlabs.productintelligence.R

sealed class BottomNavItem(val route: String, val labelResId: Int, val icon: ImageVector) {
    data object Home : BottomNavItem("home", R.string.nav_home, Icons.Filled.Home)
    data object Search : BottomNavItem("search", R.string.nav_search, Icons.Filled.Search)
    data object Saved : BottomNavItem("saved", R.string.nav_saved, Icons.Filled.Favorite)
    data object Compare : BottomNavItem("compare", R.string.nav_compare, Icons.Filled.Balance)
    data object Account : BottomNavItem("account", R.string.nav_account, Icons.Filled.Person)
}

val bottomNavItems = listOf(
    BottomNavItem.Home,
    BottomNavItem.Search,
    BottomNavItem.Saved,
    BottomNavItem.Compare,
    BottomNavItem.Account,
)

const val SEARCH_ROUTE_PATTERN = "search?query={query}&category={category}"

fun searchRoute(query: String = "", category: String = ""): String {
    val encodedQuery = java.net.URLEncoder.encode(query, "UTF-8")
    val encodedCategory = java.net.URLEncoder.encode(category, "UTF-8")
    return "search?query=$encodedQuery&category=$encodedCategory"
}

const val PRODUCT_DETAIL_ROUTE_PATTERN = "product/{productId}"

fun productDetailRoute(productId: String): String {
    val encodedProductId = java.net.URLEncoder.encode(productId, "UTF-8")
    return "product/$encodedProductId"
}

const val PRICE_ALERTS_ROUTE = "price_alerts"
const val FILTERS_ROUTE = "filters"
const val ADVANCED_SEARCH_ROUTE = "advanced_search"
const val SPLASH_ROUTE = "splash"
const val ONBOARDING_ROUTE = "onboarding"

