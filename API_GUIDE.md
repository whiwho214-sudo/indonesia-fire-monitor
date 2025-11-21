# 🔌 API Integration Guide

## NASA FIRMS API

### Endpoint Structure
```
https://firms.modaps.eosdis.nasa.gov/api/area/csv/{MAP_KEY}/{source}/{area}/{day_range}
```

### Parameters

**MAP_KEY** (required)
- Your unique API key from NASA FIRMS
- Get it from: https://firms.modaps.eosdis.nasa.gov/api/area/

**source** (required)
- `VIIRS_SNPP_NRT` - VIIRS S-NPP Near Real-Time (recommended)
- `VIIRS_NOAA20_NRT` - VIIRS NOAA-20 Near Real-Time
- `MODIS_NRT` - MODIS Near Real-Time
- `VIIRS_SNPP_SP` - VIIRS S-NPP Standard Processing
- `VIIRS_NOAA20_SP` - VIIRS NOAA-20 Standard Processing
- `MODIS_SP` - MODIS Standard Processing

**area** (required)
- Format: `west,south,east,north`
- Indonesia: `95,-11,141,6`
- Example untuk Kalimantan: `108,-5,119,3`

**day_range** (required)
- Number of days to fetch: `1` to `10`
- Example: `1` = hari ini, `7` = 7 hari terakhir

### Example URLs

**Indonesia 1 hari:**
```
https://firms.modaps.eosdis.nasa.gov/api/area/csv/28a847cd248c2272dc9b58b20e74fa9f/VIIRS_SNPP_NRT/95,-11,141,6/1
```

**Kalimantan 7 hari:**
```
https://firms.modaps.eosdis.nasa.gov/api/area/csv/28a847cd248c2272dc9b58b20e74fa9f/VIIRS_SNPP_NRT/108,-5,119,3/7
```

### Response Format (CSV)

```csv
latitude,longitude,brightness,scan,track,acq_date,acq_time,satellite,confidence,version,bright_t31,frp,daynight
-2.3456,110.1234,345.6,1.2,1.1,2024-10-30,1234,N,h,2.0NRT,298.5,12.3,D
```

### CSV Fields

| Field | Description | Unit |
|-------|-------------|------|
| latitude | Latitude | Decimal degrees |
| longitude | Longitude | Decimal degrees |
| brightness | Brightness temperature | Kelvin |
| scan | Along-scan pixel size | km |
| track | Along-track pixel size | km |
| acq_date | Acquisition date | YYYY-MM-DD |
| acq_time | Acquisition time | HHMM (UTC) |
| satellite | Satellite name | - |
| confidence | Detection confidence | h/n/l |
| version | Processing version | - |
| bright_t31 | Brightness temp band 31 | Kelvin |
| frp | Fire Radiative Power | MW |
| daynight | Day or Night | D/N |

### Rate Limits
- **Free tier:** 1000 requests per day
- **Reset:** Daily at UTC midnight

### Customizing in Code

**Change Indonesia bounding box:**
```javascript
// src/services/api.js
const INDONESIA_BBOX = [95, -11, 141, 6] // [west, south, east, north]
```

**Change satellite source:**
```javascript
// src/services/api.js
const NASA_BASE_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv'
const url = `${NASA_BASE_URL}/${NASA_API_KEY}/MODIS_NRT/${INDONESIA_BBOX.join(',')}/${days}`
```

**Change day range:**
```javascript
// src/App.jsx
const [filters, setFilters] = useState({
  days: 3, // Change from 1 to 3 days
})
```

---

## Alternative AQI APIs

### 1. AQICN.org (World Air Quality Index)

**Endpoint:**
```
https://api.waqi.info/feed/{city}/?token={token}
```

**Get Token:**
- Visit: https://aqicn.org/data-platform/token/
- Free tier: 1000 requests/day

**Example:**
```javascript
// src/services/api.js
export const fetchAQIData = async () => {
  const cities = ['jakarta', 'surabaya', 'bandung', 'medan']
  const token = 'your_aqicn_token'
  
  const promises = cities.map(city => 
    axios.get(`https://api.waqi.info/feed/${city}/?token=${token}`)
  )
  
  const results = await Promise.all(promises)
  
  return results.map(res => ({
    name: res.data.data.city.name,
    latitude: res.data.data.city.geo[0],
    longitude: res.data.data.city.geo[1],
    aqi: res.data.data.aqi,
    pm25: res.data.data.iaqi.pm25?.v,
    pm10: res.data.data.iaqi.pm10?.v,
    o3: res.data.data.iaqi.o3?.v,
    co: res.data.data.iaqi.co?.v
  }))
}
```

### 2. OpenWeatherMap Air Pollution API

**Endpoint:**
```
http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_key}
```

**Get API Key:**
- Visit: https://openweathermap.org/api
- Free tier: 1000 calls/day

**Example:**
```javascript
export const fetchAQIData = async () => {
  const API_KEY = 'your_openweathermap_key'
  const locations = [
    { name: 'Jakarta', lat: -6.2088, lon: 106.8456 },
    { name: 'Surabaya', lat: -7.2575, lon: 112.7521 }
  ]
  
  const promises = locations.map(loc => 
    axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${loc.lat}&lon=${loc.lon}&appid=${API_KEY}`)
  )
  
  const results = await Promise.all(promises)
  
  return results.map((res, idx) => ({
    name: locations[idx].name,
    latitude: locations[idx].lat,
    longitude: locations[idx].lon,
    aqi: res.data.list[0].main.aqi * 50, // Convert to US AQI
    pm25: res.data.list[0].components.pm2_5,
    pm10: res.data.list[0].components.pm10,
    o3: res.data.list[0].components.o3,
    co: res.data.list[0].components.co
  }))
}
```

---

## Weather APIs

### 1. OpenWeatherMap

**Current Weather Endpoint:**
```
https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_key}&units=metric
```

**Example:**
```javascript
export const fetchWeatherData = async () => {
  const API_KEY = 'your_openweathermap_key'
  const cities = [
    { name: 'Jakarta', lat: -6.2088, lon: 106.8456 },
    { name: 'Surabaya', lat: -7.2575, lon: 112.7521 }
  ]
  
  const promises = cities.map(city => 
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`)
  )
  
  const results = await Promise.all(promises)
  
  return {
    stations: results.map((res, idx) => ({
      name: cities[idx].name,
      latitude: cities[idx].lat,
      longitude: cities[idx].lon,
      temperature: res.data.main.temp,
      humidity: res.data.main.humidity,
      windSpeed: res.data.wind.speed * 3.6, // m/s to km/h
      windDirection: getWindDirection(res.data.wind.deg),
      weather: res.data.weather[0].description
    }))
  }
}

const getWindDirection = (deg) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return directions[Math.round(deg / 45) % 8]
}
```

### 2. WeatherAPI.com

**Endpoint:**
```
http://api.weatherapi.com/v1/current.json?key={API_key}&q={city}&aqi=yes
```

**Get API Key:**
- Visit: https://www.weatherapi.com/
- Free tier: 1 million calls/month

---

## BMKG Data (Advanced)

### BMKG Data Sources

BMKG tidak menyediakan REST API publik, tapi data bisa diambil dari:

1. **BMKG Open Data (XML)**
   - URL: https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/
   - Format: XML
   - Perlu parsing

2. **BMKG Web Scraping**
   - URL: https://www.bmkg.go.id/kualitas-udara/
   - Perlu scraping (gunakan Puppeteer/Cheerio)

3. **InaRISK API (BNPB)**
   - URL: https://inarisk.bnpb.go.id/
   - Perlu registrasi

### Example: Parse BMKG XML

```javascript
import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'

export const fetchBMKGWeather = async () => {
  try {
    // Fetch XML data
    const response = await axios.get('https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-Indonesia.xml')
    
    // Parse XML
    const parser = new XMLParser()
    const data = parser.parse(response.data)
    
    // Transform to usable format
    const stations = data.forecast.area.map(area => ({
      name: area.name,
      latitude: parseFloat(area.parameter.find(p => p.id === 'lat').value),
      longitude: parseFloat(area.parameter.find(p => p.id === 'lon').value),
      temperature: parseFloat(area.parameter.find(p => p.id === 't').value),
      humidity: parseFloat(area.parameter.find(p => p.id === 'hu').value),
      // ... other parameters
    }))
    
    return { stations }
  } catch (error) {
    console.error('Error fetching BMKG data:', error)
    return null
  }
}
```

**Install XML parser:**
```bash
npm install fast-xml-parser
```

---

## Backend Proxy (Optional)

Jika API memerlukan CORS proxy atau API key harus disembunyikan:

### Simple Express Proxy

**Create `server.js`:**
```javascript
import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()
app.use(cors())

const NASA_API_KEY = process.env.NASA_API_KEY

app.get('/api/hotspots/:days', async (req, res) => {
  try {
    const days = req.params.days
    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${NASA_API_KEY}/VIIRS_SNPP_NRT/95,-11,141,6/${days}`
    
    const response = await axios.get(url)
    res.send(response.data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(3001, () => {
  console.log('Proxy server running on port 3001')
})
```

**Update frontend API:**
```javascript
// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const fetchHotspots = async (days = 1) => {
  const response = await axios.get(`${API_URL}/api/hotspots/${days}`)
  // Parse response...
}
```

---

## Environment Variables Reference

```env
# NASA FIRMS (Required)
VITE_NASA_MAP_KEY=28a847cd248c2272dc9b58b20e74fa9f

# Refresh interval (Optional, default: 600000 = 10 minutes)
VITE_REFRESH_INTERVAL=600000

# Mapbox (Optional, for satellite imagery)
VITE_MAPBOX_TOKEN=pk.eyJ1...

# OpenWeatherMap (Optional)
VITE_OPENWEATHER_API_KEY=your_openweathermap_key

# AQICN (Optional)
VITE_AQICN_TOKEN=your_aqicn_token

# Backend API URL (Optional)
VITE_API_URL=http://localhost:3001
```

---

## Testing API Endpoints

### Using cURL

**Test NASA FIRMS:**
```bash
curl "https://firms.modaps.eosdis.nasa.gov/api/area/csv/28a847cd248c2272dc9b58b20e74fa9f/VIIRS_SNPP_NRT/95,-11,141,6/1"
```

**Test AQICN:**
```bash
curl "https://api.waqi.info/feed/jakarta/?token=YOUR_TOKEN"
```

### Using Postman

1. Import collection dari `postman_collection.json`
2. Set environment variables
3. Test each endpoint

---

**Need help? Check README.md for more information!**

