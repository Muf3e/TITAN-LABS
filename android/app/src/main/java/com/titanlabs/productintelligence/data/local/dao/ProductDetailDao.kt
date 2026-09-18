package com.titanlabs.productintelligence.data.local.dao

import androidx.room.*
import com.titanlabs.productintelligence.data.local.entity.ProductDetailEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ProductDetailDao {

    @Query("SELECT * FROM product_details WHERE productId = :productId")
    fun getProductDetail(productId: String): Flow<ProductDetailEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(detail: ProductDetailEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(details: List<ProductDetailEntity>)

    @Query("SELECT COUNT(*) FROM product_details")
    suspend fun count(): Int
}
