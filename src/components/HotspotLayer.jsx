import { CircleMarker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

function HotspotLayer({ hotspots }) {
  const map = useMap()

  useEffect(() => {
    // Fit bounds to show all hotspots when data changes
    if (hotspots && hotspots.length > 0) {
      const bounds = hotspots.map(h => [h.latitude, h.longitude])
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 })
    }
  }, [hotspots, map])

  const getHotspotColor = (confidence) => {
    switch (confidence) {
      case 'high':
      case 'h':
        return '#dc2626' // red-600
      case 'nominal':
      case 'n':
        return '#f59e0b' // amber-500
      case 'low':
      case 'l':
        return '#fbbf24' // amber-400
      default:
        return '#ef4444' // red-500
    }
  }

  const getHotspotRadius = (brightness) => {
    // Radius based on brightness temperature
    if (brightness > 400) return 12
    if (brightness > 350) return 10
    if (brightness > 320) return 8
    return 6
  }

  const getFireRiskLevel = (brightness, confidence) => {
    // Simple fire risk calculation
    let risk = 0
    
    if (brightness > 400) risk += 3
    else if (brightness > 350) risk += 2
    else risk += 1
    
    if (confidence === 'high' || confidence === 'h') risk += 2
    else if (confidence === 'nominal' || confidence === 'n') risk += 1
    
    if (risk >= 4) return { level: 'Sangat Tinggi', color: '#dc2626' }
    if (risk >= 3) return { level: 'Tinggi', color: '#f59e0b' }
    if (risk >= 2) return { level: 'Sedang', color: '#fbbf24' }
    return { level: 'Rendah', color: '#10b981' }
  }

  return (
    <>
      {hotspots.map((hotspot, index) => {
        const color = getHotspotColor(hotspot.confidence)
        const radius = getHotspotRadius(hotspot.brightness)
        const risk = getFireRiskLevel(hotspot.brightness, hotspot.confidence)
        
        return (
          <CircleMarker
            key={`${hotspot.latitude}-${hotspot.longitude}-${index}`}
            center={[hotspot.latitude, hotspot.longitude]}
            radius={radius}
            pathOptions={{
              fillColor: color,
              color: '#fff',
              weight: 1,
              opacity: 0.8,
              fillOpacity: 0.6
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2 text-red-600">
                  🔥 Hotspot Terdeteksi
                </h3>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">Lokasi:</span>
                    <span>{hotspot.latitude.toFixed(4)}, {hotspot.longitude.toFixed(4)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Waktu:</span>
                    <span>
                      {hotspot.acq_date && format(new Date(hotspot.acq_date), 'dd MMM yyyy HH:mm', { locale: id })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Confidence:</span>
                    <span className="capitalize font-medium" style={{ color }}>
                      {hotspot.confidence}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Brightness:</span>
                    <span>{hotspot.brightness}K</span>
                  </div>
                  
                  {hotspot.frp && (
                    <div className="flex justify-between">
                      <span className="font-semibold">FRP:</span>
                      <span>{hotspot.frp.toFixed(2)} MW</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Satelit:</span>
                    <span>{hotspot.satellite || 'VIIRS'}</span>
                  </div>
                  
                  <div className="flex justify-between mt-2 pt-2 border-t">
                    <span className="font-semibold">Risiko Kebakaran:</span>
                    <span className="font-bold" style={{ color: risk.color }}>
                      {risk.level}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </>
  )
}

export default HotspotLayer

