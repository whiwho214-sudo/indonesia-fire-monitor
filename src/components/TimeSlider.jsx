import { Calendar } from 'lucide-react'

function TimeSlider({ maxDays, currentDays, onChange }) {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-[1000] w-96">
      <div className="flex items-center gap-3 mb-3">
        <Calendar size={20} className="text-blue-600" />
        <h3 className="font-semibold text-gray-800">Rentang Waktu</h3>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="range"
            min="1"
            max={maxDays}
            value={currentDays}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 hari</span>
            <span>{maxDays} hari</span>
          </div>
        </div>
        
        <div className="text-center min-w-[80px]">
          <div className="text-2xl font-bold text-blue-600">{currentDays}</div>
          <div className="text-xs text-gray-600">hari terakhir</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          Menampilkan data hotspot dalam {currentDays} hari terakhir
        </div>
      </div>
    </div>
  )
}

export default TimeSlider

