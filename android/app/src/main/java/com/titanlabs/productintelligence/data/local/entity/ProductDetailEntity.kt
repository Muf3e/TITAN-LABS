package com.titanlabs.productintelligence.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.titanlabs.productintelligence.data.model.*

@Entity(tableName = "product_details")
data class ProductDetailEntity(
    @PrimaryKey val productId: String,
    val images: List<ProductImage>,
    val strengths: List<String>,
    val weaknesses: List<String>,
    val offers: List<SampleOffer>,
    val specs: List<SpecItem>,
    val benchmarks: List<BenchmarkResult>,
    val reviewThemes: List<ReviewTheme>,
    val externalReviews: List<ExternalReview>,
    val alternatives: List<ProductAlternative>
) {
    fun toProductDetail(): ProductDetail = ProductDetail(
        productId = productId,
        images = images,
        strengths = strengths,
        weaknesses = weaknesses,
        offers = offers,
        specs = specs,
        benchmarks = benchmarks,
        reviewThemes = reviewThemes,
        externalReviews = externalReviews,
        alternatives = alternatives
    )

    companion object {
        fun fromProductDetail(d: ProductDetail): ProductDetailEntity = ProductDetailEntity(
            productId = d.productId,
            images = d.images,
            strengths = d.strengths,
            weaknesses = d.weaknesses,
            offers = d.offers,
            specs = d.specs,
            benchmarks = d.benchmarks,
            reviewThemes = d.reviewThemes,
            externalReviews = d.externalReviews,
            alternatives = d.alternatives
        )
    }
}
