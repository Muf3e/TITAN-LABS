package com.titanlabs.productintelligence.ui.nav

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.titanlabs.productintelligence.core.data.ProductRepository
import com.titanlabs.productintelligence.feature.account.AccountScreen
import com.titanlabs.productintelligence.feature.alerts.PriceAlertsScreen
import com.titanlabs.productintelligence.feature.compare.CompareScreen
import com.titanlabs.productintelligence.feature.detail.ProductDetailScreen
import com.titanlabs.productintelligence.feature.home.HomeScreen
import com.titanlabs.productintelligence.feature.onboarding.OnboardingScreen
import com.titanlabs.productintelligence.feature.saved.SavedScreen
import com.titanlabs.productintelligence.feature.search.AdvancedSearchScreen
import com.titanlabs.productintelligence.feature.search.FiltersScreen
import com.titanlabs.productintelligence.feature.search.SearchScreen
import com.titanlabs.productintelligence.feature.splash.SplashScreen
import com.titanlabs.productintelligence.ui.theme.TitanBlue

@Composable
fun TitanApp() {
    val navController = rememberNavController()
    var searchQuery by remember { mutableStateOf("") }
    var searchCategory by remember { mutableStateOf("") }

    Scaffold(
        bottomBar = {
            val backStackEntry by navController.currentBackStackEntryAsState()
            val currentRoute = backStackEntry?.destination?.route?.substringBefore("?")
            val hideBottomBar = currentRoute in listOf(SPLASH_ROUTE, ONBOARDING_ROUTE, FILTERS_ROUTE)

            if (!hideBottomBar) {
                NavigationBar(
                    containerColor = MaterialTheme.colorScheme.surface,
                    tonalElevation = 8.dp,
                ) {
                bottomNavItems.forEach { item ->
                    val isSelected = currentRoute == item.route
                    NavigationBarItem(
                        selected = isSelected,
                        onClick = {
                            navController.navigate(item.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = {
                            Icon(
                                imageVector = item.icon,
                                contentDescription = stringResource(item.labelResId),
                            )
                        },
                        label = { Text(stringResource(item.labelResId)) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = TitanBlue,
                            selectedTextColor = TitanBlue,
                            indicatorColor = TitanBlue.copy(alpha = 0.12f),
                            unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                            unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant,
                        ),
                    )
                }
            }
        }
    },
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = SPLASH_ROUTE,
            modifier = Modifier.padding(innerPadding),
        ) {
            composable(BottomNavItem.Home.route) {
                HomeScreen(
                    onSearchRequested = { query, category ->
                        searchQuery = query
                        searchCategory = category
                        navController.navigate(BottomNavItem.Search.route) {
                            launchSingleTop = true
                        }
                    },
                    onNavigateToSaved = {
                        navController.navigate(BottomNavItem.Saved.route)
                    },
                    onNavigateToAlerts = {
                        navController.navigate(PRICE_ALERTS_ROUTE)
                    },
                )
            }
            composable(BottomNavItem.Search.route) {
                SearchScreen(
                    query = searchQuery,
                    category = searchCategory,
                    onQueryChanged = { searchQuery = it },
                    onCategoryChanged = { searchCategory = it },
                    onProductSelected = { productId ->
                        navController.navigate(productDetailRoute(productId))
                    },
                    compareSelection = ProductRepository.compareState.collectAsState().value,
                    onCompareToggle = { productId -> ProductRepository.toggleCompare(productId) },
                    onOpenFilters = {
                        navController.navigate(FILTERS_ROUTE)
                    },
                    onOpenAdvancedSearch = {
                        navController.navigate(ADVANCED_SEARCH_ROUTE)
                    },
                )
            }
            composable(
                route = PRODUCT_DETAIL_ROUTE_PATTERN,
                arguments = listOf(
                    navArgument("productId") { type = NavType.StringType },
                ),
            ) { backStackEntry ->
                ProductDetailScreen(
                    productId = backStackEntry.arguments?.getString("productId").orEmpty(),
                    onBack = { navController.popBackStack() },
                    onAlternativeSelected = { productId ->
                        navController.navigate(productDetailRoute(productId))
                    },
                    onNavigateToAlerts = {
                        navController.navigate(PRICE_ALERTS_ROUTE)
                    },
                )
            }
            composable(BottomNavItem.Compare.route) {
                CompareScreen(
                    onGoToSearch = {
                        navController.navigate(BottomNavItem.Search.route)
                    },
                    onProductClick = { productId ->
                        navController.navigate(productDetailRoute(productId))
                    },
                )
            }
            composable(BottomNavItem.Saved.route) {
                SavedScreen(
                    onGoToSearch = {
                        navController.navigate(BottomNavItem.Search.route)
                    },
                    onProductClick = { productId ->
                        navController.navigate(productDetailRoute(productId))
                    },
                )
            }
            composable(BottomNavItem.Account.route) {
                AccountScreen(
                    onNavigateToSaved = {
                        navController.navigate(BottomNavItem.Saved.route)
                    },
                    onNavigateToCompare = {
                        navController.navigate(BottomNavItem.Compare.route)
                    },
                    onNavigateToSearch = {
                        navController.navigate(BottomNavItem.Search.route)
                    },
                    onNavigateToAlerts = {
                        navController.navigate(PRICE_ALERTS_ROUTE)
                    },
                    onNavigateToOnboarding = {
                        navController.navigate(ONBOARDING_ROUTE)
                    },
                )
            }
            composable(PRICE_ALERTS_ROUTE) {
                PriceAlertsScreen(
                    onBack = { navController.popBackStack() },
                    onProductClick = { productId ->
                        navController.navigate(productDetailRoute(productId))
                    },
                    onAddAlertClick = {
                        navController.navigate(BottomNavItem.Search.route)
                    },
                )
            }
            composable(FILTERS_ROUTE) {
                FiltersScreen(
                    onBack = { navController.popBackStack() },
                    onApply = { category, _, _ ->
                        searchCategory = category
                        navController.popBackStack()
                    },
                )
            }
            composable(ADVANCED_SEARCH_ROUTE) {
                AdvancedSearchScreen(
                    onBack = { navController.popBackStack() },
                    onSearch = { query, category ->
                        searchQuery = query
                        searchCategory = category
                        navController.navigate(BottomNavItem.Search.route)
                    },
                )
            }
            composable(SPLASH_ROUTE) {
                SplashScreen(
                    onSplashFinished = {
                        navController.navigate(ONBOARDING_ROUTE) {
                            popUpTo(SPLASH_ROUTE) { inclusive = true }
                        }
                    },
                )
            }
            composable(ONBOARDING_ROUTE) {
                OnboardingScreen(
                    onFinish = {
                        navController.navigate(BottomNavItem.Home.route) {
                            popUpTo(ONBOARDING_ROUTE) { inclusive = true }
                        }
                    },
                )
            }
        }
    }
}
