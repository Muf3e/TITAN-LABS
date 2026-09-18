package com.titanlabs.productintelligence

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.titanlabs.productintelligence.core.data.ProductRepository
import com.titanlabs.productintelligence.ui.nav.TitanApp
import com.titanlabs.productintelligence.ui.theme.TitanProductIntelligenceTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        ProductRepository.initialize(applicationContext)
        enableEdgeToEdge()
        setContent {
            TitanProductIntelligenceTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    TitanApp()
                }
            }
        }
    }
}
