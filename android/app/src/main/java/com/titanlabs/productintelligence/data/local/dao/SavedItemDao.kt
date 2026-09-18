package com.titanlabs.productintelligence.data.local.dao

import androidx.room.*
import com.titanlabs.productintelligence.data.local.entity.SavedItemEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface SavedItemDao {

    @Query("SELECT productId FROM saved_items ORDER BY savedAtTimestamp DESC")
    fun getAllSavedProductIds(): Flow<List<String>>

    @Query("SELECT EXISTS(SELECT 1 FROM saved_items WHERE productId = :productId)")
    fun isSaved(productId: String): Flow<Boolean>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveItem(item: SavedItemEntity)

    @Query("DELETE FROM saved_items WHERE productId = :productId")
    suspend fun removeItem(productId: String)
}
