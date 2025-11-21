import { Wind, Thermometer, Droplets, Cloud } from 'lucide-react'

function SidebarAQI({ aqiData, weatherData }) {
  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { text: 'Baik', color: 'bg-green-500', emoji: '😊' }
    if (aqi <= 100) return { text: 'Sedang', color: 'bg-yellow-400', emoji: '😐' }
    if (aqi <= 150) return { text: 'Tidak Sehat (Sensitif)', color: 'bg-orange-500', emoji: '😷' }
    if (aqi <= 200) return { text: 'Tidak Sehat', color: 'bg-red-500', emoji: '😰' }
    if (aqi <= 300) return { text: 'Sangat Tidak Sehat', color: 'bg-purple-600', emoji: '🤢' }
    return { text: 'Berbahaya', color: 'bg-red-900', emoji: '☠️' }
  }

  // Calculate average AQI
  const avgAQI = aqiData.length > 0 
    ? Math.round(aqiData.reduce((sum, d) => sum + d.aqi, 0) / aqiData.length)
    : 0

  const aqiStatus = getAQIStatus(avgAQI)

  return (
    <div className="w-80 bg-white shadow-lg overflow-y-auto custom-scrollbar z-10">
      <div className="p-4">
        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <Wind className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Kualitas Udara</h2>
        </div>

        {/* Average AQI Card */}
        {aqiData.length > 0 ? (
          <div className={`${aqiStatus.color} p-4 rounded-lg mb-4 text-white shadow-lg`}>
            <div className="text-center">
              <div className="text-4xl mb-2">{aqiStatus.emoji}</div>
              <div className="text-5xl font-bold mb-2">{avgAQI}</div>
              <div className="text-lg font-semibold">{aqiStatus.text}</div>
              <div className="text-sm mt-2 opacity-90">
                Rata-rata dari {aqiData.length} stasiun
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded-lg mb-4 text-center text-gray-600">
            <Cloud size={48} className="mx-auto mb-2 opacity-50" />
            <p>Data AQI tidak tersedia</p>
          </div>
        )}

        {/* AQI Stations List */}
        {aqiData.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-3">Stasiun Pemantauan</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {aqiData.slice(0, 10).map((station, index) => {
                const status = getAQIStatus(station.aqi)
                return (
                  <div 
                    key={station.id || index}
                    className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{station.name || station.city}</span>
                      <span className={`${status.color} text-white px-2 py-1 rounded font-bold text-sm`}>
                        {station.aqi}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">{status.text}</div>
                    {station.pm25 && (
                      <div className="text-xs text-gray-500 mt-1">
                        PM2.5: {station.pm25} µg/m³
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <hr className="my-4" />

        {/* Weather Summary */}
        {weatherData && weatherData.stations && weatherData.stations.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Thermometer size={18} />
              Kondisi Cuaca
            </h3>
            <div className="space-y-3">
              {weatherData.stations.slice(0, 5).map((station, index) => (
                <div 
                  key={station.id || index}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200"
                >
                  <div className="font-medium text-sm mb-2">{station.name || station.city}</div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {station.temperature && (
                      <div className="flex items-center gap-1">
                        <Thermometer size={14} className="text-red-500" />
                        <span>{station.temperature}°C</span>
                      </div>
                    )}
                    
                    {station.humidity && (
                      <div className="flex items-center gap-1">
                        <Droplets size={14} className="text-blue-500" />
                        <span>{station.humidity}%</span>
                      </div>
                    )}
                    
                    {station.windSpeed && (
                      <div className="flex items-center gap-1">
                        <Wind size={14} className="text-gray-500" />
                        <span>{station.windSpeed} km/h</span>
                      </div>
                    )}
                    
                    {station.weather && (
                      <div className="col-span-2 text-xs text-gray-600 mt-1">
                        {station.weather}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AQI Scale Reference */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-sm text-gray-800 mb-2">
            📊 Skala AQI
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span>0-50: Baik</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-400"></div>
              <span>51-100: Sedang</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500"></div>
              <span>101-150: Tidak Sehat (Sensitif)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span>151-200: Tidak Sehat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-600"></div>
              <span>201-300: Sangat Tidak Sehat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-900"></div>
              <span>300+: Berbahaya</span>
            </div>
          </div>
        </div>

        {/* Health Recommendations */}
        {aqiData.length > 0 && avgAQI > 100 && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-semibold text-sm text-orange-800 mb-1">
              ⚠️ Rekomendasi Kesehatan
            </h4>
            <ul className="text-xs text-orange-700 space-y-1 list-disc list-inside">
              {avgAQI > 200 && <li>Hindari aktivitas outdoor</li>}
              {avgAQI > 150 && <li>Gunakan masker saat keluar rumah</li>}
              {avgAQI > 100 && <li>Kurangi aktivitas berat di luar</li>}
              <li>Kelompok sensitif harus berhati-hati</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default SidebarAQI

