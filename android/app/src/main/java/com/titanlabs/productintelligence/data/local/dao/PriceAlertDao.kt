package com.titanlabs.productintelligence.data.local.dao

import androidx.room.*
import com.titanlabs.productintelligence.data.local.entity.PriceAlertEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface PriceAlertDao {

    @Query("SELECT * FROM price_alerts WHERE productId = :productId ORDER BY createdAtTimestamp DESC")
    fun getAlertsForProduct(productId: String): Flow<List<PriceAlertEntity>>

    @Query("SELECT * FROM price_alerts ORDER BY createdAtTimestamp DESC")
    fun getAllAlerts(): Flow<List<PriceAlertEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAlert(alert: PriceAlertEntity): Long

    @Query("DELETE FROM price_alerts WHERE alertId = :alertId")
    suspend fun deleteAlert(alertId: Long)
}
