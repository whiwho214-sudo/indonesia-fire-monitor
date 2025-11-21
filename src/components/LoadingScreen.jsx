import { useEffect, useState } from 'react'

function LoadingScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Fade out animation setelah 2 detik
    const timer = setTimeout(() => {
      setIsVisible(false)
      // Call onComplete setelah fade out animation selesai
      setTimeout(() => {
        onComplete?.()
      }, 500) // Wait for fade out animation (500ms)
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black z-[9999] flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo Container */}
        <div className="relative mb-8">
          {/* Outer Circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-gray-300/30 rounded-full animate-spin-slow"></div>
          </div>

          {/* Logo Circle Container */}
          <div className="relative w-40 h-40 bg-black rounded-full border border-gray-300/50 shadow-2xl flex items-center justify-center animate-scale-pulse">
            {/* Logo Content */}
            <div className="relative w-32 h-32 flex flex-col items-center justify-center">
              {/* Fire Icon - Animated */}
              <div className="mb-2 animate-fire-flicker">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Fire flames */}
                  <path
                    d="M12 22C15.866 22 19 18.866 19 15C19 12 16.5 10 14.5 8C14 7 13 6 12 5C11 6 10 7 9.5 8C7.5 10 5 12 5 15C5 18.866 8.134 22 12 22Z"
                    fill="#EF4444"
                    className="animate-fire-flicker"
                  />
                  <path
                    d="M12 18C14.2091 18 16 16.2091 16 14C16 12.5 14.5 11.5 13.5 10.5C13.25 10.25 12.75 9.75 12 9C11.25 9.75 10.75 10.25 10.5 10.5C9.5 11.5 8 12.5 8 14C8 16.2091 9.79086 18 12 18Z"
                    fill="#991B1B"
                    className="animate-fire-flicker-2"
                  />
                </svg>
              </div>

              {/* Geometric Shape - Animated */}
              <div className="mb-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
                  <path
                    d="M4 8 L16 2 L28 8 L28 10 L16 4 L4 10 Z"
                    stroke="#D1D5DB"
                    strokeWidth="1.5"
                    fill="none"
                    className="animate-draw-line"
                  />
                </svg>
              </div>

              {/* Green Arc - Animated */}
              <div className="mb-1 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
                  <path
                    d="M5 12 Q20 2 35 12"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="animate-draw-arc"
                  />
                </svg>
              </div>

              {/* IFM Text - Animated */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <span className="text-white text-xl font-bold tracking-wider drop-shadow-lg">
                  IFM
                </span>
              </div>
            </div>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 -z-10 w-40 h-40 bg-red-500/20 rounded-full blur-2xl animate-pulse-glow"></div>
        </div>

        {/* Loading Text */}
        <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-gray-300 text-sm font-medium tracking-wider">
            Loading Indonesia Fire Monitor...
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex gap-2 mt-4 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen

