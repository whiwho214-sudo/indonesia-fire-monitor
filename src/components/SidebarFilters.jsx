import { Filter, Flame, Eye, EyeOff } from 'lucide-react'

const PROVINCES = [
  'all', 'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Jambi',
  'Sumatera Selatan', 'Bengkulu', 'Lampung', 'Kalimantan Barat',
  'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur',
  'Kalimantan Utara', 'Sulawesi Utara', 'Sulawesi Tengah', 
  'Sulawesi Selatan', 'Sulawesi Tenggara', 'Papua', 'Papua Barat'
]

function SidebarFilters({ filters, onFilterChange, hotspotCount, totalCount, layers, onLayerToggle }) {
  return (
    <div className="w-80 bg-white shadow-lg overflow-y-auto custom-scrollbar z-10">
      <div className="p-4">
        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <Filter className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Filter & Layer</h2>
        </div>

        {/* Hotspot Count */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-lg mb-4 border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="text-red-600" size={20} />
            <h3 className="font-semibold text-gray-800">Hotspot Aktif</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">
            {hotspotCount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            dari {totalCount.toLocaleString()} total titik panas
          </p>
        </div>

        {/* Layer Controls */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Eye size={18} />
            Tampilan Layer
          </h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                Hotspot
              </span>
              <input
                type="checkbox"
                checked={layers.hotspots}
                onChange={() => onLayerToggle('hotspots')}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                Kualitas Udara (AQI)
              </span>
              <input
                type="checkbox"
                checked={layers.aqi}
                onChange={() => onLayerToggle('aqi')}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                Data Cuaca
              </span>
              <input
                type="checkbox"
                checked={layers.weather}
                onChange={() => onLayerToggle('weather')}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
            
            {/* Prediksi via API */}
            <label className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-500 rounded-full" style={{ borderStyle: 'dashed', borderWidth: '1px' }}></span>
                <span>Prediksi (1 Hari) – API</span>
              </span>
              <input
                type="checkbox"
                checked={layers.predictions}
                onChange={() => onLayerToggle('predictions')}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Prediksi evaluasi statis untuk sesi penilaian */}
            <label className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-300 rounded-full" style={{ borderStyle: 'dotted', borderWidth: '1px' }}></span>
                <span>Prediksi (1 Hari) – Evaluation</span>
              </span>
              <input
                type="checkbox"
                checked={layers.predictionsEval}
                onChange={() => onLayerToggle('predictionsEval')}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {(layers.predictions || layers.predictionsEval) && (
              <div className="ml-6 mt-1 text-xs text-gray-600 italic space-y-1">
                {layers.predictions && (
                  <div>🔮 Mode API: Menggunakan LSTM &amp; Random Forest (online)</div>
                )}
                {layers.predictionsEval && (
                  <div>🧪 Mode Evaluation: Untuk evaluasi model Random Forest dan akurasi Model</div>
                )}
              </div>
            )}
          </div>
        </div>

        <hr className="my-4" />

        {/* Confidence Filter */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confidence Level
          </label>
          <select
            value={filters.confidence}
            onChange={(e) => onFilterChange({ confidence: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua</option>
            <option value="high">High - Tinggi</option>
            <option value="nominal">Nominal - Sedang</option>
            <option value="low">Low - Rendah</option>
          </select>
        </div>

        {/* Province Filter */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Provinsi
          </label>
          <select
            value={filters.province}
            onChange={(e) => onFilterChange({ province: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PROVINCES.map(province => (
              <option key={province} value={province}>
                {province === 'all' ? 'Seluruh Indonesia' : province}
              </option>
            ))}
          </select>
        </div>

        {/* Brightness Filter */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Minimum Brightness: {filters.minBrightness}K
          </label>
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={filters.minBrightness}
            onChange={(e) => onFilterChange({ minBrightness: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0K</span>
            <span>500K</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-sm text-blue-800 mb-1">
            ℹ️ Informasi
          </h4>
          <p className="text-xs text-blue-700">
            Data hotspot diperbarui secara real-time dari NASA FIRMS VIIRS. 
            Gunakan time slider di bawah peta untuk melihat data historis.
          </p>
        </div>

        {/* Legend Card */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-sm text-gray-800 mb-2">
            🔥 Tingkat Confidence
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600"></div>
              <span>High - Kepercayaan Tinggi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
              <span>Nominal - Kepercayaan Sedang</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-400"></div>
              <span>Low - Kepercayaan Rendah</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidebarFilters

