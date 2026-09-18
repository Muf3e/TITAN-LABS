package com.titanlabs.productintelligence.data.local.dao

import androidx.room.*
import com.titanlabs.productintelligence.data.local.entity.CompareItemEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface CompareDao {

    @Query("SELECT productId FROM compare_items ORDER BY addedAtTimestamp ASC")
    fun getCompareProductIds(): Flow<List<String>>

    @Query("SELECT EXISTS(SELECT 1 FROM compare_items WHERE productId = :productId)")
    fun isInCompare(productId: String): Flow<Boolean>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun addToCompare(item: CompareItemEntity)

    @Query("DELETE FROM compare_items WHERE productId = :productId")
    suspend fun removeFromCompare(productId: String)

    @Query("DELETE FROM compare_items")
    suspend fun clearCompare()
}
