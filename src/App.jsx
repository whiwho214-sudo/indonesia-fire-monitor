import { useState, useEffect } from 'react'
import MapView from './components/MapView'
import SidebarFilters from './components/SidebarFilters'
import SidebarAQI from './components/SidebarAQI'
import Header from './components/Header'
import TimeSlider from './components/TimeSlider'
import Legend from './components/Legend'
import LoadingScreen from './components/LoadingScreen'
import { fetchHotspots, fetchAQIData, fetchWeatherData } from './services/api'
import { filterHotspots } from './utils/dataProcessing'
import { getPredictionGrid, testPredictionAPI } from './services/predictionService'

function App() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)
  const [hotspots, setHotspots] = useState([])
  const [aqiData, setAQIData] = useState([])
  const [weatherData, setWeatherData] = useState(null)
  const [filteredHotspots, setFilteredHotspots] = useState([])
  const [lastUpdate, setLastUpdate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [offlineMode, setOfflineMode] = useState(false)
  const [useMockData, setUseMockData] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState({
    confidence: 'all', // all, high, nominal, low
    days: 7, // Changed from 1 to 7 days for better data
    province: 'all',
    minBrightness: 0
  })
  
  // Layer visibility
  const [layers, setLayers] = useState({
    hotspots: true,
    aqi: true,
    weather: false,
    predictions: false
  })
  
  // Prediction states
  const [predictions, setPredictions] = useState([])
  const [loadingPredictions, setLoadingPredictions] = useState(false)
  const [predictionError, setPredictionError] = useState(null)

  // Fetch data on mount and at intervals
  useEffect(() => {
    loadData()
    
    // Auto-refresh every 10 minutes (configurable via env)
    const refreshInterval = import.meta.env.VITE_REFRESH_INTERVAL || 600000
    const interval = setInterval(loadData, refreshInterval)
    
    return () => clearInterval(interval)
  }, [])

  // Reload data when days filter changes (only if not initial load)
  useEffect(() => {
    // Skip initial load (already handled by first useEffect)
    if (lastUpdate === null) return
    
    console.log('📅 Days filter changed to:', filters.days, '- Reloading data...')
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.days])

  // Apply filters when hotspots or filters change
  useEffect(() => {
    console.log('🔄 Applying filters...', filters)
    const filtered = filterHotspots(hotspots, filters)
    setFilteredHotspots(filtered)
  }, [hotspots, filters])

  const loadData = async (forceMock = false) => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch all data in parallel
      const [hotspotsData, aqiDataResult, weatherDataResult] = await Promise.allSettled([
        fetchHotspots(filters.days, forceMock || useMockData),
        fetchAQIData(),
        fetchWeatherData()
      ])
      
      // Handle hotspots data
      if (hotspotsData.status === 'fulfilled') {
        setHotspots(hotspotsData.value)
        setOfflineMode(false)
      } else {
        console.error('Failed to fetch hotspots:', hotspotsData.reason)
        setOfflineMode(true)
      }
      
      // Handle AQI data
      if (aqiDataResult.status === 'fulfilled') {
        setAQIData(aqiDataResult.value)
      }
      
      // Handle weather data
      if (weatherDataResult.status === 'fulfilled') {
        setWeatherData(weatherDataResult.value)
      }
      
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err.message)
      setOfflineMode(true)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleLayerToggle = (layer) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  }

  const handleRefresh = () => {
    loadData()
  }

  const handleToggleMockData = () => {
    setUseMockData(!useMockData)
    setTimeout(() => loadData(!useMockData), 100)
  }

  // Load predictions when predictions layer is enabled
  useEffect(() => {
    if (layers.predictions) {
      loadPredictions()
    } else {
      setPredictions([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers.predictions])

  const loadPredictions = async () => {
    try {
      setLoadingPredictions(true)
      setPredictionError(null)
      
      console.log('🔮 Loading predictions for 1 day ahead...')
      
      // Calculate 1 day ahead date
      const targetDate = new Date()
      targetDate.setDate(targetDate.getDate() + 1)
      
      // Indonesia bounding box
      const bbox = [95, -11, 141, 6] // [west, south, east, north]
      
      const dateStr = targetDate.toISOString().split('T')[0]
      
      // Prepare historical data dari hotspots yang sudah ada
      // Ambil data 30 hari terakhir untuk konteks prediksi
      const historicalData = hotspots
        .filter(h => {
          if (!h.acq_date) return false
          const hotspotDate = new Date(h.acq_date)
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return hotspotDate >= thirtyDaysAgo
        })
        .map(h => ({
          latitude: h.latitude,
          longitude: h.longitude,
          brightness: h.brightness || 0,
          acq_date: h.acq_date,
          confidence: h.confidence || 'nominal',
          frp: h.frp || 0
        }))
      
      console.log(`📊 Using ${historicalData.length} historical hotspots for prediction context`)
      
      // Get predictions dengan data historis
      console.log(`🌐 Calling prediction API: date=${dateStr}, bbox=${bbox.join(',')}`)
      const response = await getPredictionGrid(bbox, dateStr, 0.15)
      
      console.log('📦 API Response:', response)
      
      // Handle both array and object response
      let gridPredictions = []
      if (Array.isArray(response)) {
        gridPredictions = response
        console.log(`✅ Received ${response.length} predictions (array format)`)
      } else if (response && response.predictions) {
        gridPredictions = response.predictions
        console.log(`✅ Received ${response.predictions.length} predictions (object format)`)
        console.log(`   Total raw: ${response.total_raw || 'N/A'}, Filtered: ${response.total || 0}`)
      } else if (response && typeof response === 'object') {
        console.warn('⚠️ Unexpected response format:', response)
      }
      
      // Check if we have predictions (even if empty array)
      // Accept response if it has predictions array or status is success
      if (response && (response.status === 'success' || response.predictions !== undefined || Array.isArray(response))) {
        if (gridPredictions && gridPredictions.length > 0) {
          setPredictions(gridPredictions.map(p => ({
          ...p,
          latitude: p.latitude || p.lat,
          longitude: p.longitude || p.lng,
          date: dateStr,
          probability: p.probability || 0,
          risk_level: p.risk_level || p.risk || 'low',
          model: p.model || 'rf'
        })))
        
          console.log(`✅ Loaded ${gridPredictions.length} predictions for ${dateStr}`)
          setPredictionError(null)
        } else {
          // API berhasil tapi tidak ada prediksi yang memenuhi threshold
          const errorMsg = `API berhasil dihubungi tapi tidak ada prediksi yang memenuhi threshold. Total raw: ${response.total_raw || 0}, Filtered: ${response.total || 0}. Coba dengan area yang berbeda atau threshold lebih rendah.`
          console.warn('⚠️ API returned empty predictions array')
          console.warn('   Response:', response)
          setPredictionError(errorMsg)
          setPredictions([])
        }
      } else {
        // Response format tidak valid atau tidak ada status
        const errorMsg = 'Tidak ada prediksi yang dikembalikan dari API. Pastikan API berjalan dan model sudah dilatih.'
        console.warn('⚠️ No predictions returned from API')
        console.warn('   Full response:', response)
        setPredictionError(errorMsg)
        setPredictions([])
      }
    } catch (err) {
      console.error('❌ Error loading predictions:', err)
      const errorMsg = err.response?.data?.detail || err.message || 'Gagal memuat prediksi. Pastikan API prediction berjalan di http://localhost:8000'
      setPredictionError(errorMsg)
      setPredictions([])
    } finally {
      setLoadingPredictions(false)
    }
  }

  return (
    <>
      {/* Loading Screen */}
      {showLoadingScreen && (
        <LoadingScreen onComplete={() => setShowLoadingScreen(false)} />
      )}

      {/* Main App */}
      <div className="flex flex-col h-screen bg-gray-100">
        <Header 
        lastUpdate={lastUpdate}
        onRefresh={handleRefresh}
        loading={loading}
        offlineMode={offlineMode}
        useMockData={useMockData}
        onToggleMockData={handleToggleMockData}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Filters & Hotspot Info */}
        <SidebarFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          hotspotCount={filteredHotspots.length}
          totalCount={hotspots.length}
          layers={layers}
          onLayerToggle={handleLayerToggle}
        />
        
        {/* Main Map */}
        <div className="flex-1 relative">
          <MapView
            hotspots={filteredHotspots}
            aqiData={aqiData}
            weatherData={weatherData}
            predictions={predictions}
            layers={layers}
          />
          
          {/* Legend */}
          <Legend layers={layers} />
          
          {/* Time Slider */}
          <TimeSlider
            maxDays={7}
            currentDays={filters.days}
            onChange={(days) => handleFilterChange({ days })}
          />
          
          {/* Error Message */}
          {error && !offlineMode && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-[1000]">
              Error: {error}
            </div>
          )}
          
          {/* Prediction Loading Indicator */}
          {loadingPredictions && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-[1000] flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="font-semibold">Memuat prediksi 1 hari ke depan...</span>
            </div>
          )}
          
          {/* Prediction Error Message */}
          {predictionError && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-lg z-[1000] max-w-lg">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div className="flex-1">
                  <div className="font-semibold mb-2">Peringatan Prediksi</div>
                  <div className="text-sm mb-3">{predictionError}</div>
                  <div className="text-xs mb-3 opacity-90 space-y-1">
                    <div><strong>Langkah troubleshooting:</strong></div>
                    <div>1. Buka terminal baru/PowerShell di folder <code className="bg-yellow-600 px-2 py-0.5 rounded">ml-prediction</code></div>
                    <div>2. Aktifkan virtual environment: <code className="bg-yellow-600 px-2 py-0.5 rounded">.\venv\Scripts\Activate.ps1</code></div>
                    <div>3. Jalankan API: <code className="bg-yellow-600 px-2 py-0.5 rounded">python api\prediction_api.py</code></div>
                    <div>4. Pastikan muncul: <code className="bg-yellow-600 px-2 py-0.5 rounded">INFO: Uvicorn running on http://0.0.0.0:8000</code></div>
                    <div>5. Biarkan terminal tetap terbuka!</div>
                    <div>6. Buka browser console (F12) dan ketik: <code className="bg-yellow-600 px-2 py-0.5 rounded">window.testPredictionAPI()</code></div>
                  </div>
                  <button
                    onClick={() => {
                      setPredictionError(null)
                      loadPredictions()
                    }}
                    className="mt-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm font-semibold transition-colors"
                  >
                    🔄 Coba Lagi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Sidebar - AQI Info */}
        <SidebarAQI
          aqiData={aqiData}
          weatherData={weatherData}
        />
      </div>
    </div>
    </>
  )
}

export default App

