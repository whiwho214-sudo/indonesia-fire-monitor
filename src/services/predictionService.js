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
 * @param {number} gridSize - Grid size in degrees (default: 0.15)
 * @returns {Promise<Object>} Prediction grid response from API
 */
export const getPredictionGrid = async (bbox, date, gridSize = 0.15) => {
  try {
    console.log('Prediction API URL:', PREDICTION_API_URL)
    console.log('Calling:', `${PREDICTION_API_URL}/api/predictions/grid`)
    console.log('Params:', { bbox, date, grid_size: gridSize })

    const response = await axios.get(`${PREDICTION_API_URL}/api/predictions/grid`, {
      params: {
        bbox: bbox.join(','),
        date,
        grid_size: gridSize,
      },
      headers: {
        Accept: 'application/json',
      },
      timeout: 120000, // 120 detik
    })

    const data = response.data
    if (!data) {
      throw new Error('Empty response from API')
    }

    return data
  } catch (error) {
    console.error('Error getting prediction grid:', error)

    if (error.response) {
      const msg =
        error.response.data?.detail ||
        error.response.data?.error ||
        `API Error: ${error.response.status}`
      throw new Error(msg)
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout setelah 120 detik. Periksa API di Render.')
    }

    if (
      error.request ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ERR_CONNECTION_REFUSED'
    ) {
      if (isProduction && !import.meta.env.VITE_PREDICTION_API_URL) {
        throw new Error(
          'API prediction belum dikonfigurasi untuk production. Set VITE_PREDICTION_API_URL di Vercel.'
        )
      }

      throw new Error(`Tidak dapat terhubung ke API prediction di ${PREDICTION_API_URL}`)
    }

    throw new Error('Gagal memuat prediksi. Silakan cek konsol untuk detail lebih lanjut.')
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

