import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Create custom weather icon
const createWeatherIcon = (temp) => {
  const color = temp > 30 ? '#ef4444' : temp > 25 ? '#f59e0b' : '#3b82f6'
  return L.divIcon({
    html: `<div style="background: ${color}; border-radius: 50%; width: 24px; height: 24px; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 12px; color: white; font-weight: bold;">🌡️</div>`,
    className: '',
    iconSize: [24, 24]
  })
}

function WeatherLayer({ data }) {
  if (!data || !data.stations || data.stations.length === 0) {
    return null
  }

  return (
    <>
      {data.stations.map((station, index) => (
        <Marker
          key={`weather-${station.id || index}`}
          position={[station.latitude, station.longitude]}
          icon={createWeatherIcon(station.temperature)}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg mb-2">
                🌤️ Data Cuaca
              </h3>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">Lokasi:</span>
                  <span>{station.name || station.city}</span>
                </div>
                
                {station.temperature && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Suhu:</span>
                    <span className="font-bold text-red-600">{station.temperature}°C</span>
                  </div>
                )}
                
                {station.humidity && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Kelembaban:</span>
                    <span>{station.humidity}%</span>
                  </div>
                )}
                
                {station.windSpeed && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Kecepatan Angin:</span>
                    <span>{station.windSpeed} km/h</span>
                  </div>
                )}
                
                {station.windDirection && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Arah Angin:</span>
                    <span>{station.windDirection}</span>
                  </div>
                )}
                
                {station.rainfall && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Curah Hujan:</span>
                    <span>{station.rainfall} mm</span>
                  </div>
                )}
                
                {station.weather && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Kondisi:</span>
                    <span>{station.weather}</span>
                  </div>
                )}
                
                {/* Fire Weather Index - Simple calculation */}
                {station.temperature && station.humidity && (
                  <div className="flex justify-between mt-2 pt-2 border-t">
                    <span className="font-semibold">Fire Weather Index:</span>
                    <span className={`font-bold ${
                      station.temperature > 30 && station.humidity < 40 
                        ? 'text-red-600' 
                        : station.temperature > 28 && station.humidity < 50
                        ? 'text-orange-600'
                        : 'text-green-600'
                    }`}>
                      {station.temperature > 30 && station.humidity < 40 
                        ? 'Tinggi' 
                        : station.temperature > 28 && station.humidity < 50
                        ? 'Sedang'
                        : 'Rendah'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

export default WeatherLayer

