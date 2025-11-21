import { MapContainer, TileLayer, ScaleControl } from 'react-leaflet'
import HotspotLayer from './HotspotLayer'
import AQILayer from './AQILayer'
import WeatherLayer from './WeatherLayer'
import PredictionLayer from './PredictionLayer'
import 'leaflet/dist/leaflet.css'

// Indonesia center coordinates
const INDONESIA_CENTER = [-2.5, 118.0]
const DEFAULT_ZOOM = 5

function MapView({ hotspots, aqiData, weatherData, predictions, layers }) {
  return (
    <MapContainer
      center={INDONESIA_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
      className="z-0"
    >
      {/* Base Map Layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      
      {/* Optional: Satellite imagery if Mapbox token is available */}
      {import.meta.env.VITE_MAPBOX_TOKEN && (
        <TileLayer
          attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`}
          maxZoom={19}
          opacity={0.5}
        />
      )}
      
      {/* Weather Layer (if enabled) */}
      {layers.weather && weatherData && (
        <WeatherLayer data={weatherData} />
      )}
      
      {/* AQI Layer (if enabled) */}
      {layers.aqi && aqiData && aqiData.length > 0 && (
        <AQILayer data={aqiData} />
      )}
      
      {/* Hotspot Layer (if enabled) */}
      {layers.hotspots && hotspots && hotspots.length > 0 && (
        <HotspotLayer hotspots={hotspots} />
      )}
      
      {/* Prediction Layer (if enabled) */}
      {layers.predictions && predictions && predictions.length > 0 && (
        <PredictionLayer predictions={predictions} />
      )}
      
      
      {/* Scale Control */}
      <ScaleControl position="bottomleft" imperial={false} />
    </MapContainer>
  )
}

export default MapView

