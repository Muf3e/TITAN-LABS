package com.titanlabs.productintelligence.core.data

import android.content.Context
import com.titanlabs.productintelligence.core.evaluation.HardConstraints
import com.titanlabs.productintelligence.core.evaluation.MetricEvaluation
import com.titanlabs.productintelligence.core.evaluation.TitanDimension
import com.titanlabs.productintelligence.core.evaluation.TitanEvaluationEngine
import com.titanlabs.productintelligence.core.evaluation.TitanEvaluationResult
import com.titanlabs.productintelligence.core.evaluation.TitanPenalty
import com.titanlabs.productintelligence.core.evaluation.TitanUseCase
import com.titanlabs.productintelligence.data.local.TitanDatabase
import com.titanlabs.productintelligence.data.local.entity.CompareItemEntity
import com.titanlabs.productintelligence.data.local.entity.PriceAlertEntity
import com.titanlabs.productintelligence.data.local.entity.SavedItemEntity
import com.titanlabs.productintelligence.data.model.CompareSelectionState
import com.titanlabs.productintelligence.data.model.ProductCategory
import com.titanlabs.productintelligence.data.model.ProductDetail
import com.titanlabs.productintelligence.data.model.SampleProduct
import com.titanlabs.productintelligence.data.model.cleared
import com.titanlabs.productintelligence.data.model.withRemoved
import com.titanlabs.productintelligence.data.model.withToggled
import com.titanlabs.productintelligence.data.sample.SampleData
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch

data class PriceAlert(
    val productId: String,
    val targetPriceInr: Int,
    val active: Boolean = true,
)

object ProductRepository {

    private var database: TitanDatabase? = null
    private val scope = CoroutineScope(Dispatchers.IO)

    private val savedProductIds = MutableStateFlow<Set<String>>(
        setOf("macbook-air-m3", "iphone-15", "sony-wh-1000xm5", "samsung-galaxy-tab-s9")
    )
    private val compareSelection = MutableStateFlow(
        CompareSelectionState(selectedProductIds = listOf("asus-rog-strix-g16", "lenovo-legion-5-pro"))
    )
    private val activeAlerts = MutableStateFlow<Map<String, PriceAlert>>(
        mapOf(
            "asus-rog-strix-g16" to PriceAlert("asus-rog-strix-g16", 139990),
            "iphone-15" to PriceAlert("iphone-15", 64900),
            "sony-wh-1000xm5" to PriceAlert("sony-wh-1000xm5", 24990),
            "samsung-galaxy-tab-s9" to PriceAlert("samsung-galaxy-tab-s9", 54999),
            "lenovo-legion-5-pro" to PriceAlert("lenovo-legion-5-pro", 129990),
        )
    )

    val savedIds: StateFlow<Set<String>> = savedProductIds.asStateFlow()
    val compareState: StateFlow<CompareSelectionState> = compareSelection.asStateFlow()
    val alerts: StateFlow<Map<String, PriceAlert>> = activeAlerts.asStateFlow()

    fun initialize(context: Context) {
        if (database == null) {
            val db = TitanDatabase.getInstance(context)
            database = db
            scope.launch {
                try {
                    if (db.productDao().count() == 0) {
                        TitanDatabase.prepopulateDatabase(db)
                    }
                    db.savedItemDao().getAllSavedProductIds().collect { ids ->
                        if (ids.isNotEmpty()) {
                            savedProductIds.value = ids.toSet()
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
            scope.launch {
                try {
                    db.compareDao().getCompareProductIds().collect { ids ->
                        if (ids.isNotEmpty()) {
                            compareSelection.value = CompareSelectionState(selectedProductIds = ids)
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
            scope.launch {
                try {
                    db.priceAlertDao().getAllAlerts().collect { alertEntities ->
                        if (alertEntities.isNotEmpty()) {
                            activeAlerts.value = alertEntities.associate {
                                it.productId to PriceAlert(it.productId, it.targetPriceInInr, it.isEnabled)
                            }
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }

    fun getAllProducts(): List<SampleProduct> = SampleData.products

    fun getProductById(id: String): SampleProduct? = SampleData.products.find { it.id == id }

    fun getProductDetail(id: String): ProductDetail? = SampleData.productDetails[id]

    fun getAllProductsFlow(): Flow<List<SampleProduct>>? {
        return database?.productDao()?.getAllProducts()?.map { list ->
            list.map { it.toSampleProduct() }
        }
    }

    fun getProductDetailFlow(id: String): Flow<ProductDetail?>? {
        return database?.productDetailDao()?.getProductDetail(id)?.map { it?.toProductDetail() }
    }

    fun toggleSaved(productId: String) {
        val current = savedProductIds.value.toMutableSet()
        val willSave = !current.contains(productId)
        if (willSave) {
            current.add(productId)
        } else {
            current.remove(productId)
        }
        savedProductIds.value = current

        database?.let { db ->
            scope.launch {
                try {
                    if (willSave) {
                        db.savedItemDao().saveItem(SavedItemEntity(productId))
                    } else {
                        db.savedItemDao().removeItem(productId)
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }

    fun isSaved(productId: String): Boolean = savedProductIds.value.contains(productId)

    fun toggleCompare(productId: String) {
        val next = compareSelection.value.withToggled(productId)
        compareSelection.value = next

        database?.let { db ->
            scope.launch {
                try {
                    if (next.contains(productId)) {
                        db.compareDao().addToCompare(CompareItemEntity(productId))
                    } else {
                        db.compareDao().removeFromCompare(productId)
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }

    fun removeFromCompare(productId: String) {
        compareSelection.value = compareSelection.value.withRemoved(productId)
        database?.let { db ->
            scope.launch {
                try {
                    db.compareDao().removeFromCompare(productId)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }

    fun clearCompare() {
        compareSelection.value = compareSelection.value.cleared()
        database?.let { db ->
            scope.launch {
                try {
                    db.compareDao().clearCompare()
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }

    fun isInCompare(productId: String): Boolean = compareSelection.value.contains(productId)

    fun setPriceAlert(productId: String, targetPrice: Int) {
        val current = activeAlerts.value.toMutableMap()
        current[productId] = PriceAlert(productId, targetPrice, active = true)
        activeAlerts.value = current

        database?.let { db ->
            scope.launch {
                try {
                    db.priceAlertDao().insertAlert(
                        PriceAlertEntity(
                            productId = productId,
                            targetPriceInInr = targetPrice,
                            initialPriceInInr = getProductById(productId)?.priceInInr ?: targetPrice
                        )
                    )
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }

    fun removePriceAlert(productId: String) {
        val current = activeAlerts.value.toMutableMap()
        current.remove(productId)
        activeAlerts.value = current
    }

    /**
     * Executes the canonical TITAN Evaluation Engine for a product.
     */
    fun evaluateProduct(product: SampleProduct): TitanEvaluationResult {
        val detail = getProductDetail(product.id)
        val benchmarks = detail?.benchmarks.orEmpty()

        val perfScore = benchmarks.find { it.name.contains("CPU", ignoreCase = true) }?.betterThanPercent?.toDouble() ?: 75.0
        val displayScore = if (detail?.strengths?.any { it.contains("display", ignoreCase = true) } == true) 88.0 else 70.0
        val batteryScore = benchmarks.find { it.name.contains("battery", ignoreCase = true) }?.betterThanPercent?.toDouble() ?: 68.0
        val thermalScore = benchmarks.find { it.name.contains("thermal", ignoreCase = true) || it.name.contains("GPU sustained", ignoreCase = true) }?.betterThanPercent?.toDouble() ?: 60.0

        val metrics = mapOf(
            TitanDimension.PERFORMANCE to listOf(MetricEvaluation("Benchmark Score", perfScore, confidence = 0.95)),
            TitanDimension.UX_DISPLAY to listOf(MetricEvaluation("Display Rating", displayScore, confidence = 0.90)),
            TitanDimension.BATTERY_EFFICIENCY to listOf(MetricEvaluation("Endurance", batteryScore, confidence = 0.85)),
            TitanDimension.BUILD_THERMALS_RELIABILITY to listOf(MetricEvaluation("Thermal Profile", thermalScore, confidence = 0.80)),
            TitanDimension.FEATURES_CAPABILITY to listOf(MetricEvaluation("Features & Ports", 75.0, confidence = 0.80)),
            TitanDimension.CAMERA_OR_CREATOR to listOf(MetricEvaluation("Camera/Creator", if (product.category == ProductCategory.SMARTPHONE || product.category == ProductCategory.TABLET) 80.0 else 70.0, confidence = 0.85)),
            TitanDimension.SOFTWARE_SUPPORT to listOf(MetricEvaluation("Support Cadence", 80.0, confidence = 0.90)),
            TitanDimension.VALUE_FOR_MONEY to listOf(MetricEvaluation("Market Value", 75.0, confidence = 0.85)),
        )

        val penalties = mutableListOf<TitanPenalty>()
        if (detail?.weaknesses?.any { it.contains("fan", ignoreCase = true) || it.contains("throttling", ignoreCase = true) } == true) {
            penalties.add(TitanPenalty("Acoustic / Thermal Load", 3, "Audible noise or throttling under sustained load"))
        }

        val baselinePrice = when (product.category) {
            ProductCategory.LAPTOP -> 65000
            ProductCategory.SMARTPHONE -> 30000
            ProductCategory.TABLET -> 40000
            ProductCategory.ACCESSORY -> 8000
        }
        return TitanEvaluationEngine.evaluate(
            dimensionMetrics = metrics,
            streetPriceInInr = product.priceInInr,
            categoryBaselinePrice = baselinePrice,
            penalties = penalties,
        )
    }

    /**
     * Extracts RAM in GB from the variant description (e.g. "16GB RAM · 512GB SSD").
     */
    private fun extractRamGb(variant: String): Int {
        val regex = Regex("(\\d+)\\s*GB\\s*(?:RAM|Unified|LPDDR|DDR)", RegexOption.IGNORE_CASE)
        val match = regex.find(variant)
        return match?.groupValues?.get(1)?.toIntOrNull() ?: 8
    }

    /**
     * Extracts Storage in GB from the variant description.
     */
    private fun extractStorageGb(variant: String): Int {
        val regex = Regex("(\\d+)\\s*(GB|TB)\\s*(?:SSD|NVMe|UFS|Storage)?", RegexOption.IGNORE_CASE)
        val match = regex.find(variant) ?: return 256
        val number = match.groupValues[1].toIntOrNull() ?: 256
        val unit = match.groupValues[2].uppercase()
        return if (unit == "TB") number * 1024 else number
    }

    fun search(
        query: String,
        category: ProductCategory? = null,
        constraints: HardConstraints = HardConstraints(),
        useCase: TitanUseCase? = null,
    ): List<SampleProduct> {
        return SampleData.products.filter { product ->
            val matchesQuery = query.isBlank() ||
                product.name.contains(query, ignoreCase = true) ||
                product.variant.contains(query, ignoreCase = true) ||
                product.topPro.contains(query, ignoreCase = true)

            val matchesCategory = category == null || product.category == category

            val ram = extractRamGb(product.variant)
            val storage = extractStorageGb(product.variant)
            val hasDedicatedGpu = product.variant.contains("RTX", ignoreCase = true) || product.category == ProductCategory.SMARTPHONE

            val satisfiesHard = TitanEvaluationEngine.satisfiesHardConstraints(
                ramGb = ram,
                storageGb = storage,
                priceInr = product.priceInInr,
                category = product.category.label,
                hasDedicatedGpu = hasDedicatedGpu,
                constraints = constraints,
            )

            matchesQuery && matchesCategory && satisfiesHard
        }.sortedByDescending { product ->
            if (useCase != null) {
                val eval = evaluateProduct(product)
                TitanEvaluationEngine.calculateUseCaseScore(eval, useCase)
            } else {
                product.titanScore
            }
        }
    }
}
