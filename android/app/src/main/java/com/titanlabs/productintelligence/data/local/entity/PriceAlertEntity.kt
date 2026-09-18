package com.titanlabs.productintelligence.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "price_alerts")
data class PriceAlertEntity(
    @PrimaryKey(autoGenerate = true) val alertId: Long = 0,
    val productId: String,
    val targetPriceInInr: Int,
    val initialPriceInInr: Int,
    val isEnabled: Boolean = true,
    val createdAtTimestamp: Long = System.currentTimeMillis()
)
