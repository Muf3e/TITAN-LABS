package com.titanlabs.productintelligence.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "compare_items")
data class CompareItemEntity(
    @PrimaryKey val productId: String,
    val addedAtTimestamp: Long = System.currentTimeMillis()
)
