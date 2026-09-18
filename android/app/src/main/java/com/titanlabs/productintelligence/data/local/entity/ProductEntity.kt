package com.titanlabs.productintelligence.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.titanlabs.productintelligence.data.model.Availability
import com.titanlabs.productintelligence.data.model.ProductCategory
import com.titanlabs.productintelligence.data.model.SampleProduct

@Entity(tableName = "products")
data class ProductEntity(
    @PrimaryKey val id: String,
    val name: String,
    val variant: String,
    val category: String,
    val priceInInr: Int,
    val originalPriceInInr: Int?,
    val discountPercent: Int?,
    val retailerCount: Int,
    val titanScore: Int,
    val evidenceConfidence: Int,
    val onlineRating: Double,
    val onlineRatingCount: Int,
    val lastVerifiedDaysAgo: Int,
    val availability: String,
    val topPro: String,
    val topCon: String,
    val imageResId: Int?
) {
    fun toSampleProduct(isSaved: Boolean = false, isInCompare: Boolean = false): SampleProduct = SampleProduct(
        id = id,
        name = name,
        variant = variant,
        category = try { ProductCategory.valueOf(category) } catch (e: Exception) { ProductCategory.LAPTOP },
        priceInInr = priceInInr,
        retailerCount = retailerCount,
        titanScore = titanScore,
        evidenceConfidence = evidenceConfidence,
        onlineRating = onlineRating,
        onlineRatingCount = onlineRatingCount,
        lastVerifiedDaysAgo = lastVerifiedDaysAgo,
        availability = try { Availability.valueOf(availability) } catch (e: Exception) { Availability.IN_STOCK },
        topPro = topPro,
        topCon = topCon,
        imageResId = imageResId,
        originalPriceInInr = originalPriceInInr,
        discountPercent = discountPercent
    )

    companion object {
        fun fromSampleProduct(p: SampleProduct): ProductEntity = ProductEntity(
            id = p.id,
            name = p.name,
            variant = p.variant,
            category = p.category.name,
            priceInInr = p.priceInInr,
            originalPriceInInr = p.originalPriceInInr,
            discountPercent = p.discountPercent,
            retailerCount = p.retailerCount,
            titanScore = p.titanScore,
            evidenceConfidence = p.evidenceConfidence,
            onlineRating = p.onlineRating,
            onlineRatingCount = p.onlineRatingCount,
            lastVerifiedDaysAgo = p.lastVerifiedDaysAgo,
            availability = p.availability.name,
            topPro = p.topPro,
            topCon = p.topCon,
            imageResId = p.imageResId
        )
    }
}
