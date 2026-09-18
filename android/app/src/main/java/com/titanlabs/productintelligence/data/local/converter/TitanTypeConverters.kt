package com.titanlabs.productintelligence.data.local.converter

import androidx.room.TypeConverter
import com.titanlabs.productintelligence.data.model.*
import org.json.JSONArray
import org.json.JSONObject

class TitanTypeConverters {

    // --- List<String> ---
    @TypeConverter
    fun fromStringList(list: List<String>?): String {
        if (list == null) return "[]"
        val array = JSONArray()
        list.forEach { array.put(it) }
        return array.toString()
    }

    @TypeConverter
    fun toStringList(json: String?): List<String> {
        if (json.isNullOrBlank()) return emptyList()
        val array = JSONArray(json)
        val list = mutableListOf<String>()
        for (i in 0 until array.length()) {
            list.add(array.getString(i))
        }
        return list
    }

    // --- List<ProductImage> ---
    @TypeConverter
    fun fromProductImageList(list: List<ProductImage>?): String {
        if (list == null) return "[]"
        val array = JSONArray()
        list.forEach { img ->
            val obj = JSONObject()
            obj.put("url", img.url)
            obj.put("altText", img.altText)
            obj.put("isPrimary", img.isPrimary)
            obj.put("source", img.source.name)
            array.put(obj)
        }
        return array.toString()
    }

    @TypeConverter
    fun toProductImageList(json: String?): List<ProductImage> {
        if (json.isNullOrBlank()) return emptyList()
        val array = JSONArray(json)
        val list = mutableListOf<ProductImage>()
        for (i in 0 until array.length()) {
            val obj = array.getJSONObject(i)
            list.add(
                ProductImage(
                    url = obj.optString("url", ""),
                    altText = obj.optString("altText", ""),
                    isPrimary = obj.optBoolean("isPrimary", false),
                    source = try {
                        ProductImageSource.valueOf(obj.optString("source", "MANUFACTURER"))
                    } catch (e: Exception) {
                        ProductImageSource.MANUFACTURER
                    }
                )
            )
        }
        return list
    }

    // --- List<SpecItem> ---
    @TypeConverter
    fun fromSpecItemList(list: List<SpecItem>?): String {
        if (list == null) return "[]"
        val array = JSONArray()
        list.forEach { item ->
            val obj = JSONObject()
            obj.put("label", item.label)
            obj.put("value", item.value)
            array.put(obj)
        }
        return array.toString()
    }

    @TypeConverter
    fun toSpecItemList(json: String?): List<SpecItem> {
        if (json.isNullOrBlank()) return emptyList()
        val array = JSONArray(json)
        val list = mutableListOf<SpecItem>()
        for (i in 0 until array.length()) {
            val obj = array.getJSONObject(i)
            list.add(SpecItem(label = obj.optString("label", ""), value = obj.optString("value", "")))
        }
        return list
    }

    // --- List<SampleOffer> ---
    @TypeConverter
    fun fromSampleOfferList(list: List<SampleOffer>?): String {
        if (list == null) return "[]"
        val array = JSONArray()
        list.forEach { offer ->
            val obj = JSONObject()
            obj.put("retailerName", offer.retailerName)
            obj.put("priceInInr", offer.priceInInr)
            obj.put("availability", offer.availability.name)
            obj.put("lastVerifiedDaysAgo", offer.lastVerifiedDaysAgo)
            obj.put("offerUrl", offer.offerUrl)
            obj.put("trustLevel", offer.trustLevel.name)
            obj.put("sourceType", offer.sourceType.name)
            if (offer.logoResId != null) obj.put("logoResId", offer.logoResId)
            array.put(obj)
        }
        return array.toString()
    }

    @TypeConverter
    fun toSampleOfferList(json: String?): List<SampleOffer> {
        if (json.isNullOrBlank()) return emptyList()
        val array = JSONArray(json)
        val list = mutableListOf<SampleOffer>()
        for (i in 0 until array.length()) {
            val obj = array.getJSONObject(i)
            list.add(
                SampleOffer(
                    retailerName = obj.optString("retailerName", ""),
                    priceInInr = obj.optInt("priceInInr", 0),
                    availability = try {
                        Availability.valueOf(obj.optString("availability", "IN_STOCK"))
                    } catch (e: Exception) {
                        Availability.IN_STOCK
                    },
                    lastVerifiedDaysAgo = obj.optInt("lastVerifiedDaysAgo", 0),
                    offerUrl = obj.optString("offerUrl", ""),
                    trustLevel = try {
                        TrustLevel.valueOf(obj.optString("trustLevel", "TRUSTED"))
                    } catch (e: Exception) {
                        TrustLevel.TRUSTED
                    },
                    sourceType = try {
                        OfferSourceType.valueOf(obj.optString("sourceType", "RETAILER_LISTING"))
                    } catch (e: Exception) {
                        OfferSourceType.RETAILER_LISTING
                    },
                    logoResId = if (obj.has("logoResId")) obj.getInt("logoResId") else null
                )
            )
        }
        return list
    }

    // --- List<BenchmarkResult> ---
    @TypeConverter
    fun fromBenchmarkResultList(list: List<BenchmarkResult>?): String {
        if (list == null) return "[]"
        val array = JSONArray()
        list.forEach { b ->
            val obj = JSONObject()
            obj.put("name", b.name)
            obj.put("value", b.value)
            obj.put("betterThanPercent", b.betterThanPercent)
            obj.put("platform", b.platform.name)
            obj.put("sourceName", b.sourceName)
            obj.put("sourceUrl", b.sourceUrl)
            obj.put("observedDaysAgo", b.observedDaysAgo)
            array.put(obj)
        }
        return array.toString()
    }

    @TypeConverter
    fun toBenchmarkResultList(json: String?): List<BenchmarkResult> {
        if (json.isNullOrBlank()) return emptyList()
        val array = JSONArray(json)
        val list = mutableListOf<BenchmarkResult>()
        for (i in 0 until array.length()) {
            val obj = array.getJSONObject(i)
            list.add(
                BenchmarkResult(
                    name = obj.optString("name", ""),
                    value = obj.optString("value", ""),
                    betterThanPercent = obj.optInt("betterThanPercent", 80),
                    platform = try {
                        BenchmarkPlatform.valueOf(obj.optString("platform", "THIRD_PARTY_REVIEWER"))
                    } catch (e: Exception) {
                        BenchmarkPlatform.THIRD_PARTY_REVIEWER
                    },
                    sourceName = obj.optString("sourceName", "TITAN Verified"),
                    sourceUrl = obj.optString("sourceUrl", ""),
                    observedDaysAgo = obj.optInt("observedDaysAgo", 0)
                )
            )
        }
        return list
    }

    // --- List<ReviewTheme> ---
    @TypeConverter
    fun fromReviewThemeList(list: List<ReviewTheme>?): String {
        if (list == null) return "[]"
        val array = JSONArray()
        list.forEach { t ->
            val obj = JSONObject()
            obj.put("label", t.label)
            obj.put("sentiment", t.sentiment.name)
            obj.put("mentionCount", t.mentionCount)
            array.put(obj)
        }
        return array.toString()
    }

    @TypeConverter
    fun toReviewThemeList(json: String?): List<ReviewTheme> {
        if (json.isNullOrBlank()) return emptyList()
        val array = JSONArray(json)
        val list = mutableListOf<ReviewTheme>()
        for (i in 0 until array.length()) {
            val obj = array.getJSONObject(i)
            list.add(
                ReviewTheme(
                    label = obj.optString("label", ""),
                    sentiment = try {
                        ReviewSentiment.valueOf(obj.optString("sentiment", "POSITIVE"))
                    } catch (e: Exception) {
                        ReviewSentiment.POSITIVE
                    },
                    mentionCount = obj.optInt("mentionCount", 0)
                )
            )
        }
        return list
    }

    // --- List<ExternalReview> ---
    @TypeConverter
    fun fromExternalReviewList(list: List<ExternalReview>?): String {
        if (list == null) return "[]"
        val array = JSONArray()
        list.forEach { r ->
            val obj = JSONObject()
            obj.put("sourceName", r.sourceName)
            obj.put("sourceType", r.sourceType.name)
            obj.put("sourceUrl", r.sourceUrl)
            if (r.rating != null) obj.put("rating", r.rating)
            obj.put("publishedDaysAgo", r.publishedDaysAgo)
            obj.put("sentiment", r.sentiment.name)
            obj.put("summary", r.summary)
            array.put(obj)
        }
        return array.toString()
    }

    @TypeConverter
    fun toExternalReviewList(json: String?): List<ExternalReview> {
        if (json.isNullOrBlank()) return emptyList()
        val array = JSONArray(json)
        val list = mutableListOf<ExternalReview>()
        for (i in 0 until array.length()) {
            val obj = array.getJSONObject(i)
            list.add(
                ExternalReview(
                    sourceName = obj.optString("sourceName", ""),
                    sourceType = try {
                        ExternalReviewSourceType.valueOf(obj.optString("sourceType", "TECH_PUBLICATION"))
                    } catch (e: Exception) {
                        ExternalReviewSourceType.TECH_PUBLICATION
                    },
                    sourceUrl = obj.optString("sourceUrl", ""),
                    rating = if (obj.has("rating")) obj.getDouble("rating") else null,
                    publishedDaysAgo = obj.optInt("publishedDaysAgo", 0),
                    sentiment = try {
                        ReviewSentiment.valueOf(obj.optString("sentiment", "POSITIVE"))
                    } catch (e: Exception) {
                        ReviewSentiment.POSITIVE
                    },
                    summary = obj.optString("summary", "")
                )
            )
        }
        return list
    }

    // --- List<ProductAlternative> ---
    @TypeConverter
    fun fromProductAlternativeList(list: List<ProductAlternative>?): String {
        if (list == null) return "[]"
        val array = JSONArray()
        list.forEach { a ->
            val obj = JSONObject()
            obj.put("productId", a.productId)
            obj.put("reason", a.reason)
            array.put(obj)
        }
        return array.toString()
    }

    @TypeConverter
    fun toProductAlternativeList(json: String?): List<ProductAlternative> {
        if (json.isNullOrBlank()) return emptyList()
        val array = JSONArray(json)
        val list = mutableListOf<ProductAlternative>()
        for (i in 0 until array.length()) {
            val obj = array.getJSONObject(i)
            list.add(
                ProductAlternative(
                    productId = obj.optString("productId", ""),
                    reason = obj.optString("reason", "")
                )
            )
        }
        return list
    }
}
