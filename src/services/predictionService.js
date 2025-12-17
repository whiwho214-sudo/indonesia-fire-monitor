/**
 * Service untuk mendapatkan prediksi hotspot dari ML API
 */
import axios from 'axios'

// Use 127.0.0.1 instead of localhost to avoid IPv6 issues
// In production, this should be set via Vercel environment variables
const PREDICTION_API_URL = import.meta.env.VITE_PREDICTION_API_URL || 'http://127.0.0.1:8000'

// Detect if running in production
const isProduction = typeof window !== 'undefined' && 
                     window.location.hostname !== 'localhost' && 
                     !window.location.hostname.includes('127.0.0.1')

// Check if API URL is configured for production
if (isProduction && !import.meta.env.VITE_PREDICTION_API_URL) {
  console.warn('⚠️ VITE_PREDICTION_API_URL not set in production. Prediction API will not work.')
  console.warn('💡 Set environment variable in Vercel: VITE_PREDICTION_API_URL = your-api-url')
}

/**
 * Check if prediction API is available
 * @returns {Promise<boolean>} True if API is available
 */
export const checkAPIHealth = async () => {
  try {
    const response = await axios.get(`${PREDICTION_API_URL}/`, {
      timeout: 10000, // Increase timeout to 10 seconds
      headers: {
        'Accept': 'application/json'
      }
    })
    console.log('✅ API Health Check:', response.data)
    return true
  } catch (error) {
    console.error('❌ API Health Check Failed:', error.message)
    console.error('❌ Error code:', error.code)
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.status,
      request: error.request ? 'Request was made but no response' : 'No request made'
    })
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      console.error(`💡 Cannot connect to API at ${PREDICTION_API_URL}`)
      console.error('💡 Check:')
      console.error('   1. Is API running? (Check terminal with API)')
      console.error('   2. Can you access http://127.0.0.1:8000 in browser?')
      console.error('   3. Check Windows Firewall')
    }
    return false
  }
}

/**
 * DEBUG: Test Prediction API directly from browser console
 * Usage: window.testPredictionAPI()
 * 
 * @returns {Promise<Object>} API response or null
 */
export const testPredictionAPI = async () => {
  console.log('🧪 Testing Prediction API...')
  console.log('🔗 API URL:', PREDICTION_API_URL)
  
  try {
    // Test root endpoint
    console.log('\n1️⃣ Testing root endpoint (/)...')
    console.log(`   URL: ${PREDICTION_API_URL}/`)
    const rootResponse = await axios.get(`${PREDICTION_API_URL}/`, {
      timeout: 10000, // Increase timeout
      headers: {
        'Accept': 'application/json'
      }
    })
    console.log('✅ Root endpoint response:', rootResponse.data)
    
    // Test health check
    console.log('\n2️⃣ Testing API health...')
    const isHealthy = await checkAPIHealth()
    console.log('✅ API Health:', isHealthy ? 'OK' : 'FAILED')
    
    // Test grid endpoint with sample data
    console.log('\n3️⃣ Testing grid endpoint (/api/predictions/grid)...')
    const bbox = [95, -11, 141, 6] // Indonesia bounding box
    const date = new Date()
    date.setDate(date.getDate() + 1)
    const dateStr = date.toISOString().split('T')[0]
    
    console.log('📋 Test params:', { bbox, date: dateStr, grid_size: 0.5 })
    
    const gridResponse = await axios.get(`${PREDICTION_API_URL}/api/predictions/grid`, {
      params: {
        bbox: bbox.join(','),
        date: dateStr,
        grid_size: 0.5
      },
      timeout: 60000, // Increase to 60 seconds
      headers: {
        'Accept': 'application/json'
      }
    })
    
    console.log('✅ Grid endpoint response:', gridResponse.data)
    console.log(`✅ Received ${gridResponse.data?.predictions?.length || 0} predictions`)
    
    return {
      success: true,
      root: rootResponse.data,
      health: isHealthy,
      grid: gridResponse.data
    }
  } catch (error) {
    console.error('❌ Test Failed:', error.message)
    console.error('❌ Error code:', error.code)
    
    if (error.response) {
      console.error('📛 Server responded with error:')
      console.error('  Status:', error.response.status)
      console.error('  Data:', error.response.data)
    } else if (error.request) {
      console.error('📛 No response from server')
      console.error('💡 Troubleshooting:')
      console.error('  1. Make sure API is running')
      console.error('  2. Check if API URL is correct:', PREDICTION_API_URL)
      console.error('  3. Run: cd ml-prediction && .\\venv\\Scripts\\python.exe api\\prediction_api.py')
    } else {
      console.error('📛 Error setting up request:', error.message)
    }
    
    return {
      success: false,
      error: error.message,
      code: error.code
    }
  }
}

// Make test function available globally for console debugging
if (typeof window !== 'undefined') {
  window.testPredictionAPI = testPredictionAPI
  window.checkPredictionAPIHealth = checkAPIHealth
}

/**
 * Get hotspot prediction untuk area tertentu
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {Object} weather - Weather data (optional)
 * @returns {Promise<Object>} Prediction result
 */
export const getHotspotPrediction = async (latitude, longitude, date, weather = null) => {
  try {
    const response = await axios.post(`${PREDICTION_API_URL}/api/predict`, {
      latitude,
      longitude,
      date,
      weather
    }, {
      timeout: 5000
    })
    
    return response.data
  } catch (error) {
    console.error('Error getting prediction:', error)
    return {
      probability: 0,
      risk_level: 'low',
      confidence: 0
    }
  }
}

/**
 * Get prediction grid untuk area tertentu
 * @param {Array} bbox - Bounding box [west, south, east, north]
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {number} gridSize - Grid size in degrees (default: 0.1)
 * @returns {Promise<Array>} Array of predictions with coordinates
 */
export const getPredictionGrid = async (bbox, date, gridSize = 0.15) => {
  try {
    console.log(`🌐 Prediction API URL: ${PREDICTION_API_URL}`)
    console.log(`🌐 Calling prediction API: ${PREDICTION_API_URL}/api/predictions/grid`)
    console.log(`📋 Params: bbox=${bbox.join(',')}, date=${date}, grid_size=${gridSize}`)
    
    axios.post(`${PREDICTION_API_URL}/api/predict`, {
  bbox: bbox.join(','),
  date,
  grid_size: gridSize
});

      timeout: 120000, // Increase timeout to 120 seconds (2 minutes) for grid prediction
      headers: {
        'Accept': 'application/json'
      },
      validateStatus: function (status) {
        return status < 500; // Accept any status code below 500
      }
    })
    
    // Check if response was successful
    if (response.status >= 200 && response.status < 300) {
      console.log(`✅ API Response Status: ${response.status}`)
      console.log(`📦 API Response Data:`, response.data)
      
      // Return response data immediately
      const data = response.data
      if (!data) {
        console.error('⚠️ Empty response data from API')
        throw new Error('Empty response from API')
      }
      
      // Log prediction count
      if (data.predictions) {
        console.log(`📊 Predictions count: ${data.predictions.length}`)
        console.log(`📊 Total: ${data.total || 0}, Raw: ${data.total_raw || 'N/A'}`)
      } else if (Array.isArray(data)) {
        console.log(`📊 Predictions count (array): ${data.length}`)
      }
      
      return data
    } else {
      // Server returned error status
      const errorMsg = response.data?.detail || `API Error: ${response.status}`
      console.error(`📛 API Error Status: ${response.status}`)
      console.error(`📛 Error Message:`, errorMsg)
      throw new Error(errorMsg)
    }
  } catch (error) {
    console.error('❌ Error getting prediction grid:', error)
    console.error('❌ Error code:', error.code)
    console.error('❌ Error message:', error.message)
    console.error('❌ Full error:', error)
    
    if (error.response) {
      // Server responded with error status
      console.error(`📛 Status: ${error.response.status}`)
      console.error(`📛 Data:`, error.response.data)
      const errorMsg = error.response.data?.detail || error.response.data?.error || `API Error: ${error.response.status}`
      throw new Error(errorMsg)
    } else if (error.code === 'ECONNABORTED') {
      // Timeout - this is the main issue
      console.error('⏱️  TIMEOUT ERROR!')
      console.error(`   API tidak merespons dalam 60 detik`)
      console.error(`   Check terminal API - mungkin API hang saat processing`)
      console.error(`   Atau response terlalu besar sehingga transfer lambat`)
      throw new Error(`Request timeout setelah 60 detik. Periksa terminal API apakah ada error.`)
    } else if (error.request || error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
      // Request was made but no response received
      console.error('📛 Connection Error Details:')
      console.error('  - Error Code:', error.code)
      console.error('  - API URL:', PREDICTION_API_URL)
      console.error('  - Message:', error.message)
      console.error('  - Is Production:', isProduction)
      
      if (isProduction && !import.meta.env.VITE_PREDICTION_API_URL) {
        console.error('💡 Production Setup Required:')
        console.error('  1. Deploy API to Railway/Render')
        console.error('  2. Set VITE_PREDICTION_API_URL in Vercel environment variables')
        console.error('  3. Redeploy website')
        throw new Error('API prediction belum dikonfigurasi untuk production. Set VITE_PREDICTION_API_URL di Vercel.')
      } else {
        console.error('💡 Troubleshooting (Development):')
        console.error('  1. Pastikan API berjalan di terminal lain')
        console.error('  2. Jalankan: cd ml-prediction && python api/prediction_api.py')
        console.error('  3. Pastikan API mendengarkan di:', PREDICTION_API_URL)
        throw new Error(`Tidak dapat terhubung ke API prediction. Pastikan API berjalan di ${PREDICTION_API_URL}`)
      }
    } else if (error.message) {
      // Re-throw if it's already our custom error message
      throw error
    } else {
      // Unknown error
      console.error('📛 Unknown error:', error)
      throw new Error('Gagal memuat prediksi. Silakan cek konsol untuk detail lebih lanjut.')
    }
  }
}

/**
 * Get prediction heatmap data untuk visualization
 * @param {Array} bbox - Bounding box
 * @param {string} date - Date string
 * @returns {Promise<Array>} Heatmap data points
 */
export const getPredictionHeatmap = async (bbox, date) => {
  try {
    const grid = await getPredictionGrid(bbox, date, 0.1)
    
    // Convert to heatmap format
    return grid.map(pred => ({
      lat: pred.latitude,
      lng: pred.longitude,
      intensity: pred.probability,
      risk: pred.risk_level
    }))
  } catch (error) {
    console.error('Error getting prediction heatmap:', error)
    return []
  }
}

/**
 * Get predictions for 1 day ahead
 * @param {Array} bbox - Bounding box
 * @param {number} gridSize - Grid size (default: 0.2)
 * @returns {Promise<Array>} Predictions array
 */
export const getPredictions1DayAhead = async (bbox, gridSize = 0.2) => {
  try {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 1)
    const dateStr = targetDate.toISOString().split('T')[0]
    
    return await getPredictionGrid(bbox, dateStr, gridSize)
  } catch (error) {
    console.error('Error getting 1-day ahead predictions:', error)
    return []
  }
}

