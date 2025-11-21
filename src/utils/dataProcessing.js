/**
 * Filter hotspots based on various criteria
 * @param {Array} hotspots - Array of hotspot objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered hotspots
 */
export const filterHotspots = (hotspots, filters) => {
  if (!hotspots || hotspots.length === 0) {
    console.log('📊 Filter: Input hotspots = 0')
    return []
  }

  // Log jumlah hotspot sebelum filter
  console.log(`📊 Filter: Sebelum filter = ${hotspots.length} hotspots`)

  const filtered = hotspots.filter(hotspot => {
    // Filter by confidence - Allow "h" + "n" values, parse number if necessary
    if (filters.confidence !== 'all') {
      // Normalize confidence value - handle string and number
      let confidence = hotspot.confidence
      
      // If confidence is a number, convert to string equivalent
      if (typeof confidence === 'number') {
        if (confidence >= 80 || confidence === 3) confidence = 'h' // high
        else if (confidence >= 50 || confidence === 2) confidence = 'n' // nominal
        else if (confidence >= 0 || confidence === 1) confidence = 'l' // low
      }
      
      // Convert to lowercase string for comparison
      confidence = String(confidence || '').toLowerCase()
      
      // Filter based on confidence type
      if (filters.confidence === 'high') {
        // Allow "h" (high) values
        if (confidence !== 'high' && confidence !== 'h') {
          return false
        }
      } else if (filters.confidence === 'nominal') {
        // Allow "n" (nominal) values
        if (confidence !== 'nominal' && confidence !== 'n') {
          return false
        }
      } else if (filters.confidence === 'low') {
        // Allow "l" (low) values
        if (confidence !== 'low' && confidence !== 'l') {
          return false
        }
      }
    }

    // Filter by minimum brightness
    if (filters.minBrightness > 0) {
      if (hotspot.brightness < filters.minBrightness) {
        return false
      }
    }

    // Filter by province (simplified - in production, use proper geocoding)
    if (filters.province !== 'all') {
      // This is a simplified implementation
      // In production, you would use proper reverse geocoding
      const provinceRegions = getProvinceRegions()
      const region = provinceRegions[filters.province]
      
      if (region) {
        const { latMin, latMax, lngMin, lngMax } = region
        if (
          hotspot.latitude < latMin ||
          hotspot.latitude > latMax ||
          hotspot.longitude < lngMin ||
          hotspot.longitude > lngMax
        ) {
          return false
        }
      }
    }

    return true
  })
  
  // Log jumlah hotspot sesudah filter
  console.log(`📊 Filter: Sesudah filter = ${filtered.length} hotspots`)
  console.log(`📊 Filter: Dihapus = ${hotspots.length - filtered.length} hotspots`)
  
  return filtered
}

/**
 * Get approximate regions for Indonesian provinces
 * Note: This is a simplified approximation
 */
const getProvinceRegions = () => {
  return {
    'Aceh': { latMin: 2, latMax: 6, lngMin: 95, lngMax: 98 },
    'Sumatera Utara': { latMin: 1, latMax: 4, lngMin: 98, lngMax: 100 },
    'Sumatera Barat': { latMin: -3, latMax: 1, lngMin: 98, lngMax: 102 },
    'Riau': { latMin: -1, latMax: 2, lngMin: 100, lngMax: 105 },
    'Jambi': { latMin: -3, latMax: 0, lngMin: 101, lngMax: 105 },
    'Sumatera Selatan': { latMin: -5, latMax: -1, lngMin: 102, lngMax: 106 },
    'Bengkulu': { latMin: -5, latMax: -2, lngMin: 101, lngMax: 103 },
    'Lampung': { latMin: -6, latMax: -3, lngMin: 103, lngMax: 106 },
    'Kalimantan Barat': { latMin: -3, latMax: 2, lngMin: 108, lngMax: 112 },
    'Kalimantan Tengah': { latMin: -4, latMax: 0, lngMin: 111, lngMax: 115 },
    'Kalimantan Selatan': { latMin: -5, latMax: -2, lngMin: 114, lngMax: 117 },
    'Kalimantan Timur': { latMin: -2, latMax: 3, lngMin: 115, lngMax: 119 },
    'Kalimantan Utara': { latMin: 2, latMax: 5, lngMin: 115, lngMax: 118 },
    'Sulawesi Utara': { latMin: 0, latMax: 3, lngMin: 123, lngMax: 127 },
    'Sulawesi Tengah': { latMin: -3, latMax: 2, lngMin: 119, lngMax: 124 },
    'Sulawesi Selatan': { latMin: -7, latMax: -2, lngMin: 118, lngMax: 122 },
    'Sulawesi Tenggara': { latMin: -6, latMax: -2, lngMin: 120, lngMax: 124 },
    'Papua': { latMin: -9, latMax: -1, lngMin: 134, lngMax: 141 },
    'Papua Barat': { latMin: -4, latMax: 1, lngMin: 130, lngMax: 135 }
  }
}

/**
 * Calculate Fire Weather Index (simplified version)
 * @param {number} temperature - Temperature in Celsius
 * @param {number} humidity - Humidity in percentage
 * @param {number} windSpeed - Wind speed in km/h
 * @returns {Object} FWI value and risk level
 */
export const calculateFireWeatherIndex = (temperature, humidity, windSpeed) => {
  // Simplified FWI calculation
  // Real FWI is much more complex and requires historical data
  
  let fwi = 0
  
  // Temperature factor (0-40)
  if (temperature > 35) fwi += 40
  else if (temperature > 30) fwi += 30
  else if (temperature > 25) fwi += 20
  else fwi += 10
  
  // Humidity factor (inverse, 0-40)
  if (humidity < 30) fwi += 40
  else if (humidity < 50) fwi += 30
  else if (humidity < 70) fwi += 20
  else fwi += 10
  
  // Wind speed factor (0-20)
  if (windSpeed > 30) fwi += 20
  else if (windSpeed > 20) fwi += 15
  else if (windSpeed > 10) fwi += 10
  else fwi += 5
  
  // Determine risk level
  let riskLevel, riskColor
  if (fwi >= 80) {
    riskLevel = 'Ekstrim'
    riskColor = '#7e0023'
  } else if (fwi >= 60) {
    riskLevel = 'Sangat Tinggi'
    riskColor = '#dc2626'
  } else if (fwi >= 40) {
    riskLevel = 'Tinggi'
    riskColor = '#f59e0b'
  } else if (fwi >= 20) {
    riskLevel = 'Sedang'
    riskColor = '#fbbf24'
  } else {
    riskLevel = 'Rendah'
    riskColor = '#10b981'
  }
  
  return { fwi, riskLevel, riskColor }
}

/**
 * Group hotspots by date
 * @param {Array} hotspots - Array of hotspot objects
 * @returns {Object} Hotspots grouped by date
 */
export const groupHotspotsByDate = (hotspots) => {
  const grouped = {}
  
  hotspots.forEach(hotspot => {
    const date = hotspot.acq_date
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(hotspot)
  })
  
  return grouped
}

/**
 * Calculate statistics for hotspots
 * @param {Array} hotspots - Array of hotspot objects
 * @returns {Object} Statistics
 */
export const calculateHotspotStats = (hotspots) => {
  if (!hotspots || hotspots.length === 0) {
    return {
      total: 0,
      highConfidence: 0,
      avgBrightness: 0,
      maxBrightness: 0,
      avgFRP: 0
    }
  }
  
  const stats = {
    total: hotspots.length,
    highConfidence: hotspots.filter(h => 
      h.confidence?.toLowerCase() === 'high' || 
      h.confidence?.toLowerCase() === 'h'
    ).length,
    avgBrightness: 0,
    maxBrightness: 0,
    avgFRP: 0
  }
  
  const brightnesses = hotspots.map(h => h.brightness).filter(b => b > 0)
  const frps = hotspots.map(h => h.frp).filter(f => f > 0)
  
  if (brightnesses.length > 0) {
    stats.avgBrightness = brightnesses.reduce((a, b) => a + b, 0) / brightnesses.length
    stats.maxBrightness = Math.max(...brightnesses)
  }
  
  if (frps.length > 0) {
    stats.avgFRP = frps.reduce((a, b) => a + b, 0) / frps.length
  }
  
  return stats
}

/**
 * Convert CSV string to array of objects
 * @param {string} csv - CSV string
 * @returns {Array} Array of objects
 */
export const parseCSV = (csv) => {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return []
  
  const headers = lines[0].split(',').map(h => h.trim())
  const data = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    const obj = {}
    
    headers.forEach((header, index) => {
      obj[header] = values[index]?.trim()
    })
    
    data.push(obj)
  }
  
  return data
}

