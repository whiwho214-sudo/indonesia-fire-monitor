import { CircleMarker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import { format, addDays } from 'date-fns'
import { id } from 'date-fns/locale'

function PredictionLayer({ predictions }) {
  const map = useMap()

  useEffect(() => {
    // Fit bounds to show all predictions when data changes
    if (predictions && predictions.length > 0) {
      const bounds = predictions.map(p => [p.latitude, p.longitude])
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 })
    }
  }, [predictions, map])

  const getPredictionColor = (probability, riskLevel) => {
    if (riskLevel === 'high' || probability >= 0.7) {
      return '#dc2626' // red-600
    } else if (riskLevel === 'medium' || probability >= 0.4) {
      return '#f59e0b' // amber-500
    } else {
      return '#fbbf24' // amber-400
    }
  }

  const getPredictionRadius = (probability) => {
    // Radius based on probability
    if (probability >= 0.7) return 10
    if (probability >= 0.4) return 8
    return 6
  }

  const getRiskLevelText = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return { text: 'Tinggi', color: '#dc2626' }
      case 'medium':
        return { text: 'Sedang', color: '#f59e0b' }
      case 'low':
        return { text: 'Rendah', color: '#10b981' }
      default:
        return { text: 'Tidak Diketahui', color: '#6b7280' }
    }
  }

  return (
    <>
      {predictions.map((prediction, index) => {
        const probability = prediction.probability || 0
        const riskLevel = prediction.risk_level || prediction.risk || 'low'
        const color = getPredictionColor(probability, riskLevel)
        const radius = getPredictionRadius(probability)
        const risk = getRiskLevelText(riskLevel)
        const targetDate = prediction.date ? new Date(prediction.date) : addDays(new Date(), 1)
        
        return (
          <CircleMarker
            key={`pred-${prediction.latitude}-${prediction.longitude}-${index}`}
            center={[prediction.latitude, prediction.longitude]}
            radius={radius}
            pathOptions={{
              fillColor: color,
              color: '#fff',
              weight: 2,
              opacity: 0.9,
              fillOpacity: 0.5,
              dashArray: '5, 5' // Dashed border untuk membedakan dari hotspot aktual
            }}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <h3 className="font-bold text-lg mb-2 text-purple-600">
                  🔮 Prediksi Hotspot
                </h3>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">Lokasi:</span>
                    <span>{prediction.latitude.toFixed(4)}, {prediction.longitude.toFixed(4)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Tanggal Prediksi:</span>
                    <span>
                      {format(targetDate, 'dd MMM yyyy', { locale: id })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Probabilitas:</span>
                    <span className="font-bold" style={{ color }}>
                      {(probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Tingkat Risiko:</span>
                    <span className="font-bold capitalize" style={{ color: risk.color }}>
                      {risk.text}
                    </span>
                  </div>
                  
                  {prediction.model && (
                    <div className="flex justify-between">
                      <span className="font-semibold">Model:</span>
                      <span className="capitalize">
                        {prediction.model === 'random_forest' ? 'Random Forest' : 
                         prediction.model === 'lstm' ? 'LSTM (Deep Learning)' :
                         prediction.model === 'combined' ? 'Kombinasi (RF + LSTM)' :
                         prediction.model}
                      </span>
                    </div>
                  )}
                  
                  {prediction.rf_probability !== undefined && (
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>RF:</span>
                      <span>{(prediction.rf_probability * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  
                  {prediction.lstm_probability !== undefined && (
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>LSTM:</span>
                      <span>{(prediction.lstm_probability * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  
                  <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                    Prediksi untuk 1 hari ke depan menggunakan Machine Learning
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

export default PredictionLayer

