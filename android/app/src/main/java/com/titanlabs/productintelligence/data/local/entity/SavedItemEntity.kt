package com.titanlabs.productintelligence.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "saved_items")
data class SavedItemEntity(
    @PrimaryKey val productId: String,
    val savedAtTimestamp: Long = System.currentTimeMillis()
)
