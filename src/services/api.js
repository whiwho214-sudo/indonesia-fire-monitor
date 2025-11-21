import axios from 'axios'

// NASA FIRMS API configuration
const NASA_API_KEY = import.meta.env.VITE_NASA_MAP_KEY || '28a847cd248c2272dc9b58b20e74fa9f'
const NASA_BASE_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv'

// Indonesia bounding box: [west, south, east, north]
const INDONESIA_BBOX = [95, -11, 141, 6]

/**
 * DEBUG: Test NASA API directly from browser console
 * Usage: window.testNASAAPI()
 * 
 * @param {string} source - Satellite source (default: 'VIIRS_SNPP_NRT')
 * @param {number} days - Number of days (default: 7)
 */
export const testNASAAPI = async (source = 'VIIRS_SNPP_NRT', days = 7) => {
  const url = `${NASA_BASE_URL}/${NASA_API_KEY}/${source}/${INDONESIA_BBOX.join(',')}/${days}`
  console.log('🧪 Testing NASA API...')
  console.log('🔗 URL:', url)
  console.log('🔑 API Key:', NASA_API_KEY ? `${NASA_API_KEY.substring(0, 10)}...` : 'NOT SET')
  
  try {
    const response = await axios.get(url, { timeout: 30000 })
    console.log('✅ Response Status:', response.status)
    console.log('📄 Response Type:', typeof response.data)
    console.log('📏 Response Length:', response.data?.length || 0)
    console.log('📋 Full Response:', response.data)
    console.log('📊 Line count:', response.data?.split('\n').length || 0)
    
    // Parse first few lines
    const lines = String(response.data || '').split('\n')
    console.log('📝 First 5 lines:')
    lines.slice(0, 5).forEach((line, i) => {
      console.log(`  ${i}:`, line)
    })
    
    return response.data
  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.response) {
      console.error('📛 Status:', error.response.status)
      console.error('📛 Data:', error.response.data)
    }
    return null
  }
}

// Make test function available globally for console debugging
if (typeof window !== 'undefined') {
  window.testNASAAPI = testNASAAPI
}

/**
 * Fetch hotspot data from NASA FIRMS
 * @param {number} days - Number of days to fetch (1-10)
 * @param {boolean} forceMock - Force use of mock data for demo/testing
 * @returns {Promise<Array>} Array of hotspot objects
 */
export const fetchHotspots = async (days = 7, forceMock = false) => {
  try {
    console.log('🔑 Checking NASA API Key:', NASA_API_KEY ? `${NASA_API_KEY.substring(0, 10)}...` : 'NOT SET')
    
    if (forceMock) {
      console.log('🎨 Using MOCK DATA (Demo Mode)')
      return getMockHotspots()
    }
    
    if (!NASA_API_KEY) {
      console.warn('⚠️ NASA API Key not configured. Using mock data.')
      return getMockHotspots()
    }

    // Request 4 satellite sources and combine all features
    const sources = [
      'VIIRS_SNPP_NRT',
      'VIIRS_NOAA20_NRT', 
      'MODIS_Terra_NRT',
      'MODIS_Aqua_NRT'
    ]
    let allHotspots = []
    
    console.log('📍 Bounding box:', INDONESIA_BBOX.join(','), '(west,south,east,north)')
    console.log('📅 Day range:', days)
    
    for (const source of sources) {
      try {
        const url = `${NASA_BASE_URL}/${NASA_API_KEY}/${source}/${INDONESIA_BBOX.join(',')}/${days}`
        console.log(`\n🛰️ Trying satellite source: ${source}`)
        console.log('🌐 URL:', url.replace(NASA_API_KEY, 'API_KEY_HIDDEN'))
        
        const response = await axios.get(url, {
          timeout: 30000, // 30 seconds timeout
        })
        
        console.log(`\n📡 ${source} Response Status:`, response.status)
        console.log(`📄 ${source} Response Type:`, typeof response.data)
        console.log(`📄 ${source} Response Length:`, response.data?.length || 0)
        console.log(`📄 ${source} Response Preview (first 500 chars):`, 
          String(response.data).substring(0, 500))
        
        // Check if response is empty or just header
        const responseText = String(response.data || '')
        if (responseText.trim().split('\n').length <= 1) {
          console.warn(`⚠️ ${source}: Response appears empty or only contains header`)
          console.log(`📋 ${source} Full Response:`, responseText)
          continue // Try next source
        }
        
        // Parse this source's data
        const hotspots = parseHotspotsFromCSV(responseText, source)
        console.log(`\n✅ ${source}: Successfully found ${hotspots.length} hotspots`)
        
        // Combine all features from all satellites
        allHotspots = allHotspots.concat(hotspots)
        console.log(`📊 Combined total so far: ${allHotspots.length} hotspots`)
      } catch (error) {
        console.error(`❌ ${source} failed:`, error.message)
        if (error.response) {
          console.error(`📛 ${source} HTTP Status:`, error.response.status)
          console.error(`📛 ${source} Response Data:`, error.response.data)
        } else if (error.request) {
          console.error(`📛 ${source} No response received. Request:`, error.request)
        }
        console.error(`📛 ${source} Full Error:`, error)
      }
    }
    
    console.log(`\n🔥 TOTAL COMBINED: ${allHotspots.length} hotspots from all 4 satellite sources`)
    
    // Log breakdown by source
    if (allHotspots.length > 0) {
      console.log(`📊 Breakdown by source:`)
      const sourceBreakdown = {}
      allHotspots.forEach(h => {
        const src = h.source || 'unknown'
        sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1
      })
      Object.entries(sourceBreakdown).forEach(([src, count]) => {
        console.log(`   ${src}: ${count} hotspots`)
      })
    }
    
    if (allHotspots.length === 0) {
      console.warn('⚠️ No hotspots found from any satellite source.')
      console.log('💡 Possible reasons:')
      console.log('   1. API key might be newly created and not fully activated yet')
      console.log('   2. Wait 5-30 minutes after registration')
      console.log('   3. Check if API key was copied correctly (no spaces)')
      console.log('   4. Or genuinely no active fires detected (rare but possible)')
      console.log('')
      console.log('🎨 TIP: Click "Demo Mode" button in header to see sample hotspots')
      console.log('📧 If issue persists, request a new MAP_KEY from NASA FIRMS')
    }
    
    return allHotspots
    
  } catch (error) {
    console.error('❌ Error fetching hotspots:', error.message)
    if (error.response) {
      console.error('📛 NASA API Error Response:', error.response.data)
      console.error('📛 Status Code:', error.response.status)
    }
    console.log('🔄 Falling back to mock data...')
    return getMockHotspots()
  }
}

/**
 * Parse CSV data from NASA FIRMS into hotspot objects
 * Handles various column name variations (lat/latitude, lon/longitude)
 */
const parseHotspotsFromCSV = (csvData, source) => {
  try {
    if (!csvData || csvData.length < 20) {
      console.warn(`⚠️ ${source}: CSV data too short (${csvData?.length || 0} chars)`)
      return []
    }
    
    const lines = csvData.split('\n').filter(line => line.trim())
    console.log(`📊 ${source}: Total non-empty lines in CSV:`, lines.length)
    
    if (lines.length <= 1) {
      console.warn(`⚠️ ${source}: Only header row, no data`)
      // Log full response for debugging
      console.log('📄 Full CSV response:', csvData.substring(0, 500))
      return []
    }
    
    // Parse headers - handle quoted fields
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
    console.log(`📋 ${source}: CSV Headers (${headers.length}):`, headers.join(', '))
    console.log(`📝 ${source}: First 300 chars:`, csvData.substring(0, 300))
    
    // Find latitude and longitude column indices (support multiple variations)
    const latCol = headers.findIndex(h => 
      ['latitude', 'lat', 'y'].includes(h.toLowerCase())
    )
    const lonCol = headers.findIndex(h => 
      ['longitude', 'lon', 'lng', 'x'].includes(h.toLowerCase())
    )
    
    if (latCol === -1 || lonCol === -1) {
      console.error(`❌ ${source}: Could not find lat/lon columns`)
      console.error('Available columns:', headers)
      return []
    }
    
    console.log(`✅ ${source}: Found lat column "${headers[latCol]}" at index ${latCol}`)
    console.log(`✅ ${source}: Found lon column "${headers[lonCol]}" at index ${lonCol}`)
    
    const hotspots = []
    let skippedCount = 0
    let emptyLineCount = 0
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) {
        emptyLineCount++
        continue
      }
      
      // Parse CSV line - handle quoted fields with commas
      const values = []
      let currentValue = ''
      let inQuotes = false
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue.trim())
          currentValue = ''
        } else {
          currentValue += char
        }
      }
      values.push(currentValue.trim()) // Add last value
      
      // Extract latitude and longitude
      const latStr = values[latCol]?.trim().replace(/^"|"$/g, '')
      const lonStr = values[lonCol]?.trim().replace(/^"|"$/g, '')
      
      const lat = latStr ? parseFloat(latStr) : NaN
      const lon = lonStr ? parseFloat(lonStr) : NaN
      
      // Debug first few rows
      if (i <= 3) {
        console.log(`🔍 ${source} Row ${i}:`, line.substring(0, 150))
        console.log(`   Lat: "${latStr}" = ${lat}, Lon: "${lonStr}" = ${lon}`)
      }
      
      // Validate coordinates
      if (!isNaN(lat) && !isNaN(lon) && 
          lat >= -90 && lat <= 90 && 
          lon >= -180 && lon <= 180) {
        
        // Get other fields with fallbacks (support all satellite types)
        const brightnessCol = headers.findIndex(h => 
          ['bright_ti4', 'brightness', 'bright_ti5', 'bright_t31'].includes(h.toLowerCase())
        )
        const confidenceCol = headers.findIndex(h => 
          ['confidence', 'conf'].includes(h.toLowerCase())
        )
        const acqDateCol = headers.findIndex(h => 
          ['acq_date', 'acq_date_short', 'date'].includes(h.toLowerCase())
        )
        const acqTimeCol = headers.findIndex(h => 
          ['acq_time', 'time'].includes(h.toLowerCase())
        )
        const frpCol = headers.findIndex(h => 
          ['frp', 'frp_mw'].includes(h.toLowerCase())
        )
        const satelliteCol = headers.findIndex(h => 
          ['satellite', 'sat'].includes(h.toLowerCase())
        )
        const daynightCol = headers.findIndex(h => 
          ['daynight', 'dn'].includes(h.toLowerCase())
        )
        
        // Parse confidence - handle string and number formats
        let confidence = 'nominal' // default
        if (confidenceCol >= 0 && values[confidenceCol]) {
          const confValue = values[confidenceCol].trim()
          // If numeric, convert to confidence level
          const confNum = parseFloat(confValue)
          if (!isNaN(confNum)) {
            // MODIS uses numeric: 0-100 or 1-3 scale
            if (confNum >= 80 || confNum === 3) confidence = 'h'
            else if (confNum >= 50 || confNum === 2) confidence = 'n'
            else if (confNum >= 0 || confNum === 1) confidence = 'l'
          } else {
            // VIIRS uses string: h, n, l
            confidence = confValue.toLowerCase()
          }
        }
        
        hotspots.push({
          latitude: lat,
          longitude: lon,
          brightness: brightnessCol >= 0 ? parseFloat(values[brightnessCol] || 0) : 0,
          confidence: confidence,
          acq_date: acqDateCol >= 0 ? values[acqDateCol] : '',
          acq_time: acqTimeCol >= 0 ? values[acqTimeCol] : '',
          satellite: satelliteCol >= 0 ? values[satelliteCol] : source.includes('VIIRS') ? 'VIIRS' : 'MODIS',
          frp: frpCol >= 0 ? parseFloat(values[frpCol] || 0) : 0,
          daynight: daynightCol >= 0 ? values[daynightCol] : 'D',
          scan: 0,
          track: 0,
          source: source // Store original source for debugging
        })
      } else {
        skippedCount++
        if (skippedCount <= 3) {
          console.warn(`⚠️ ${source} Row ${i}: Invalid coordinates - lat: ${latStr}, lon: ${lonStr}`)
        }
      }
    }
    
    console.log(`\n✅ ${source}: Successfully parsed ${hotspots.length} hotspots`)
    if (skippedCount > 0) {
      console.warn(`⚠️ ${source}: Skipped ${skippedCount} rows (invalid coordinates)`)
    }
    if (emptyLineCount > 0) {
      console.log(`ℹ️ ${source}: ${emptyLineCount} empty lines skipped`)
    }
    
    return hotspots
    
  } catch (error) {
    console.error(`❌ Error parsing CSV for ${source}:`, error.message)
    console.error('Error stack:', error.stack)
    console.error('CSV data preview:', csvData.substring(0, 500))
    return []
  }
}

/**
 * Fetch AQI (Air Quality Index) data
 * Note: BMKG doesn't have a public AQI API, so we'll use mock data
 * In production, you would integrate with AQICN.org or similar services
 */
export const fetchAQIData = async () => {
  try {
    // Using mock data - In production, replace with real API
    // Example: https://api.waqi.info/feed/:city/?token=YOUR_TOKEN
    return getMockAQIData()
    
  } catch (error) {
    console.error('Error fetching AQI data:', error)
    return []
  }
}

/**
 * Fetch weather data from BMKG
 * Note: BMKG data is typically in XML format and may require CORS proxy
 */
export const fetchWeatherData = async () => {
  try {
    // Using mock data - In production, you would need to:
    // 1. Setup a backend proxy to handle BMKG API
    // 2. Parse XML data from BMKG
    // 3. Transform to usable JSON format
    
    return getMockWeatherData()
    
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return null
  }
}

/**
 * Mock hotspot data for testing/fallback
 */
const getMockHotspots = () => {
  // Generate mock hotspots across Indonesia
  const mockData = []
  const regions = [
    { name: 'Kalimantan', lat: -1.5, lng: 113, count: 50 },
    { name: 'Sumatera', lat: 0.5, lng: 101, count: 40 },
    { name: 'Papua', lat: -3.5, lng: 138, count: 30 },
    { name: 'Sulawesi', lat: -1, lng: 121, count: 25 },
  ]

  regions.forEach(region => {
    for (let i = 0; i < region.count; i++) {
      mockData.push({
        latitude: region.lat + (Math.random() - 0.5) * 8,
        longitude: region.lng + (Math.random() - 0.5) * 8,
        brightness: 300 + Math.random() * 200,
        confidence: ['high', 'nominal', 'low'][Math.floor(Math.random() * 3)],
        acq_date: new Date().toISOString().split('T')[0],
        acq_time: String(Math.floor(Math.random() * 2400)).padStart(4, '0'),
        satellite: 'VIIRS',
        frp: Math.random() * 100,
        daynight: 'D'
      })
    }
  })

  return mockData
}

/**
 * Mock AQI data for major Indonesian cities
 */
const getMockAQIData = () => {
  return [
    {
      id: 1,
      name: 'Jakarta Pusat',
      city: 'Jakarta',
      latitude: -6.2088,
      longitude: 106.8456,
      aqi: 120,
      pm25: 45,
      pm10: 80,
      o3: 60,
      co: 1200
    },
    {
      id: 2,
      name: 'Surabaya',
      city: 'Surabaya',
      latitude: -7.2575,
      longitude: 112.7521,
      aqi: 85,
      pm25: 30,
      pm10: 55,
      o3: 45,
      co: 900
    },
    {
      id: 3,
      name: 'Bandung',
      city: 'Bandung',
      latitude: -6.9175,
      longitude: 107.6191,
      aqi: 95,
      pm25: 35,
      pm10: 65,
      o3: 50,
      co: 1000
    },
    {
      id: 4,
      name: 'Medan',
      city: 'Medan',
      latitude: 3.5952,
      longitude: 98.6722,
      aqi: 110,
      pm25: 40,
      pm10: 75,
      o3: 55,
      co: 1100
    },
    {
      id: 5,
      name: 'Palembang',
      city: 'Palembang',
      latitude: -2.9761,
      longitude: 104.7754,
      aqi: 135,
      pm25: 55,
      pm10: 90,
      o3: 65,
      co: 1300
    },
    {
      id: 6,
      name: 'Pontianak',
      city: 'Pontianak',
      latitude: -0.0263,
      longitude: 109.3425,
      aqi: 165,
      pm25: 70,
      pm10: 110,
      o3: 70,
      co: 1500
    },
    {
      id: 7,
      name: 'Pekanbaru',
      city: 'Pekanbaru',
      latitude: 0.5071,
      longitude: 101.4478,
      aqi: 180,
      pm25: 80,
      pm10: 125,
      o3: 75,
      co: 1600
    },
    {
      id: 8,
      name: 'Makassar',
      city: 'Makassar',
      latitude: -5.1477,
      longitude: 119.4327,
      aqi: 75,
      pm25: 25,
      pm10: 45,
      o3: 40,
      co: 800
    }
  ]
}

/**
 * Mock weather data for Indonesian cities
 */
const getMockWeatherData = () => {
  return {
    stations: [
      {
        id: 1,
        name: 'Jakarta',
        city: 'Jakarta',
        latitude: -6.2088,
        longitude: 106.8456,
        temperature: 32,
        humidity: 65,
        windSpeed: 15,
        windDirection: 'NE',
        rainfall: 0,
        weather: 'Cerah Berawan'
      },
      {
        id: 2,
        name: 'Surabaya',
        city: 'Surabaya',
        latitude: -7.2575,
        longitude: 112.7521,
        temperature: 31,
        humidity: 70,
        windSpeed: 12,
        windDirection: 'E',
        rainfall: 0,
        weather: 'Berawan'
      },
      {
        id: 3,
        name: 'Palembang',
        city: 'Palembang',
        latitude: -2.9761,
        longitude: 104.7754,
        temperature: 34,
        humidity: 55,
        windSpeed: 8,
        windDirection: 'NW',
        rainfall: 0,
        weather: 'Panas'
      },
      {
        id: 4,
        name: 'Pontianak',
        city: 'Pontianak',
        latitude: -0.0263,
        longitude: 109.3425,
        temperature: 33,
        humidity: 60,
        windSpeed: 10,
        windDirection: 'W',
        rainfall: 0,
        weather: 'Panas Berawan'
      },
      {
        id: 5,
        name: 'Makassar',
        city: 'Makassar',
        latitude: -5.1477,
        longitude: 119.4327,
        temperature: 30,
        humidity: 75,
        windSpeed: 18,
        windDirection: 'SE',
        rainfall: 2,
        weather: 'Hujan Ringan'
      }
    ]
  }
}

