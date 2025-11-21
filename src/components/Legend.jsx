import { Info } from 'lucide-react'
import { useState } from 'react'

function Legend({ layers }) {
  const [collapsed, setCollapsed] = useState(false)

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg z-[1000] hover:bg-gray-50 transition"
      >
        <Info size={24} className="text-blue-600" />
      </button>
    )
  }

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Info size={18} className="text-blue-600" />
          <h3 className="font-semibold text-gray-800">Legenda</h3>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-3 text-sm">
        {/* Hotspot Legend */}
        {layers.hotspots && (
          <div>
            <div className="font-semibold text-gray-700 mb-2">🔥 Hotspot</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span>Confidence Tinggi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>Confidence Sedang</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <span>Confidence Rendah</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                • Ukuran marker = tingkat brightness
              </div>
            </div>
          </div>
        )}

        {/* AQI Legend */}
        {layers.aqi && (
          <div className="pt-2 border-t">
            <div className="font-semibold text-gray-700 mb-2">🌫️ Kualitas Udara (AQI)</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>0-50: Baik</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span>51-100: Sedang</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>101-150: Tidak Sehat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>151-200: Sangat Tidak Sehat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span>201-300: Berbahaya</span>
              </div>
            </div>
          </div>
        )}

        {/* Weather Legend */}
        {layers.weather && (
          <div className="pt-2 border-t">
            <div className="font-semibold text-gray-700 mb-2">🌤️ Data Cuaca</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Suhu &gt; 30°C</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>Suhu 25-30°C</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Suhu &lt; 25°C</span>
              </div>
            </div>
          </div>
        )}

        {/* Prediction Legend */}
        {layers.predictions && (
          <div className="pt-2 border-t">
            <div className="font-semibold text-gray-700 mb-2">🔮 Prediksi Hotspot (2 Hari)</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600" style={{ border: '1px dashed white' }}></div>
                <span>Risiko Tinggi (&gt;70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" style={{ border: '1px dashed white' }}></div>
                <span>Risiko Sedang (40-70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400" style={{ border: '1px dashed white' }}></div>
                <span>Risiko Rendah (&lt;40%)</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                • Border putus-putus = prediksi ML
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t text-xs text-gray-500">
        Klik marker untuk detail informasi
      </div>
    </div>
  )
}

export default Legend

