import { Circle, Popup } from 'react-leaflet'

function AQILayer({ data }) {
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#00e400' // Good
    if (aqi <= 100) return '#ffff00' // Moderate
    if (aqi <= 150) return '#ff7e00' // Unhealthy for Sensitive Groups
    if (aqi <= 200) return '#ff0000' // Unhealthy
    if (aqi <= 300) return '#8f3f97' // Very Unhealthy
    return '#7e0023' // Hazardous
  }

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return { name: 'Baik', desc: 'Kualitas udara baik' }
    if (aqi <= 100) return { name: 'Sedang', desc: 'Dapat diterima' }
    if (aqi <= 150) return { name: 'Tidak Sehat (Sensitif)', desc: 'Kelompok sensitif mungkin terpengaruh' }
    if (aqi <= 200) return { name: 'Tidak Sehat', desc: 'Semua orang mulai terpengaruh' }
    if (aqi <= 300) return { name: 'Sangat Tidak Sehat', desc: 'Peringatan kesehatan' }
    return { name: 'Berbahaya', desc: 'Darurat kesehatan' }
  }

  return (
    <>
      {data.map((station, index) => {
        const color = getAQIColor(station.aqi)
        const category = getAQICategory(station.aqi)
        
        return (
          <Circle
            key={`aqi-${station.id || index}`}
            center={[station.latitude, station.longitude]}
            radius={20000} // 20km radius
            pathOptions={{
              fillColor: color,
              color: color,
              weight: 2,
              opacity: 0.5,
              fillOpacity: 0.3
            }}
          >
            <Popup>
              <div className="p-2 min-w-[220px]">
                <h3 className="font-bold text-lg mb-2">
                  🌫️ Kualitas Udara
                </h3>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">Lokasi:</span>
                    <span>{station.name || station.city}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold">AQI:</span>
                    <span 
                      className="text-2xl font-bold px-3 py-1 rounded"
                      style={{ backgroundColor: color, color: '#fff' }}
                    >
                      {station.aqi}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Kategori:</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  
                  <div className="text-xs mt-2 text-gray-600">
                    {category.desc}
                  </div>
                  
                  {station.pm25 && (
                    <div className="flex justify-between mt-2 pt-2 border-t">
                      <span className="font-semibold">PM2.5:</span>
                      <span>{station.pm25} µg/m³</span>
                    </div>
                  )}
                  
                  {station.pm10 && (
                    <div className="flex justify-between">
                      <span className="font-semibold">PM10:</span>
                      <span>{station.pm10} µg/m³</span>
                    </div>
                  )}
                  
                  {station.o3 && (
                    <div className="flex justify-between">
                      <span className="font-semibold">O₃:</span>
                      <span>{station.o3} µg/m³</span>
                    </div>
                  )}
                  
                  {station.co && (
                    <div className="flex justify-between">
                      <span className="font-semibold">CO:</span>
                      <span>{station.co} µg/m³</span>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Circle>
        )
      })}
    </>
  )
}

export default AQILayer

