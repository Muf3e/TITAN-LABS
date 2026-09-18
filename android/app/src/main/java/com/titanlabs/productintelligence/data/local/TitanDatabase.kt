package com.titanlabs.productintelligence.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.sqlite.db.SupportSQLiteDatabase
import com.titanlabs.productintelligence.data.local.converter.TitanTypeConverters
import com.titanlabs.productintelligence.data.local.dao.*
import com.titanlabs.productintelligence.data.local.entity.*
import com.titanlabs.productintelligence.data.sample.SampleData
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        ProductEntity::class,
        ProductDetailEntity::class,
        SavedItemEntity::class,
        CompareItemEntity::class,
        PriceAlertEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(TitanTypeConverters::class)
abstract class TitanDatabase : RoomDatabase() {

    abstract fun productDao(): ProductDao
    abstract fun productDetailDao(): ProductDetailDao
    abstract fun savedItemDao(): SavedItemDao
    abstract fun compareDao(): CompareDao
    abstract fun priceAlertDao(): PriceAlertDao

    companion object {
        @Volatile
        private var INSTANCE: TitanDatabase? = null

        fun getInstance(context: Context): TitanDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    TitanDatabase::class.java,
                    "titan_product_intelligence.db"
                )
                    .addCallback(object : Callback() {
                        override fun onCreate(db: SupportSQLiteDatabase) {
                            super.onCreate(db)
                            // Prepopulate from SampleData
                            INSTANCE?.let { database ->
                                CoroutineScope(Dispatchers.IO).launch {
                                    prepopulateDatabase(database)
                                }
                            }
                        }
                    })
                    .build()
                INSTANCE = instance
                instance
            }
        }

        suspend fun prepopulateDatabase(database: TitanDatabase) {
            try {
                val productEntities = SampleData.products.map { ProductEntity.fromSampleProduct(it) }
                database.productDao().insertAll(productEntities)

                val detailEntities = SampleData.products.mapNotNull { prod ->
                    SampleData.productDetails[prod.id]?.let { detail ->
                        ProductDetailEntity.fromProductDetail(detail)
                    }
                }
                database.productDetailDao().insertAll(detailEntities)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
