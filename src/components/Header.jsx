import { RefreshCw, AlertCircle, Flame } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

function Header({ lastUpdate, onRefresh, loading, offlineMode, useMockData, onToggleMockData }) {
  return (
    <header className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg z-20">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center gap-3">
            <Flame size={32} className="animate-pulse" />
            <div>
              <h1 className="text-2xl font-bold">
                Indonesia Fire & Air Quality Monitor
              </h1>
              <p className="text-sm text-red-100">
                Real-time Hotspot & Pollution Monitoring System
              </p>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center gap-4">
            {/* Last Update */}
            {lastUpdate && (
              <div className="text-right">
                <div className="text-xs text-red-100">Update Terakhir</div>
                <div className="text-sm font-semibold">
                  {format(lastUpdate, 'dd MMM yyyy HH:mm:ss', { locale: id })}
                </div>
              </div>
            )}

            {/* Offline Mode Indicator */}
            {offlineMode && (
              <div className="flex items-center gap-2 bg-yellow-500 px-3 py-2 rounded-lg">
                <AlertCircle size={18} />
                <span className="text-sm font-semibold">Mode Offline</span>
              </div>
            )}

            {/* Demo Mode Toggle */}
            {onToggleMockData && (
              <button
                onClick={onToggleMockData}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-md transition
                  ${useMockData 
                    ? 'bg-yellow-400 text-gray-800 hover:bg-yellow-300' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                  }
                `}
              >
                <span className="text-sm">
                  {useMockData ? '🎨 Demo Mode' : '📡 Real Data'}
                </span>
              </button>
            )}

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className={`
                flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg 
                font-semibold shadow-md hover:bg-red-50 transition
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              `}
            >
              <RefreshCw 
                size={18} 
                className={loading ? 'animate-spin' : ''} 
              />
              <span className="hidden sm:inline">
                {loading ? 'Memperbarui...' : 'Refresh'}
              </span>
            </button>
          </div>
        </div>

        {/* Loading Bar */}
        {loading && (
          <div className="mt-3">
            <div className="h-1 bg-red-400 rounded-full overflow-hidden">
              <div className="h-full bg-white animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

