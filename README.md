<<<<<<< HEAD
# 🔥 Indonesia Fire & Air Quality Monitor

Aplikasi web interaktif real-time untuk monitoring hotspot kebakaran dan kualitas udara di Indonesia menggunakan data dari NASA FIRMS dan BMKG.

![Indonesia Fire Monitor](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-5.3.1-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.3-cyan)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-green)

## ✨ Fitur Utama

- 🗺️ **Interactive Map** - Peta interaktif Indonesia dengan Leaflet.js
- 🔥 **Real-time Hotspot Data** - Data hotspot kebakaran dari NASA FIRMS VIIRS
- 🌫️ **Air Quality Index (AQI)** - Monitoring kualitas udara PM2.5, PM10, O3, CO
- 🌤️ **Weather Data** - Data cuaca (suhu, kelembaban, kecepatan angin)
- ⏱️ **Time Slider** - Lihat perubahan data 1-7 hari terakhir
- 🎯 **Advanced Filtering** - Filter berdasarkan confidence, provinsi, brightness
- 📊 **Fire Weather Index** - Indikator risiko kebakaran sederhana
- 🔄 **Auto-refresh** - Update otomatis setiap 10 menit
- 📱 **Responsive Design** - Tampilan optimal di desktop dan mobile
- 🌐 **Offline Mode** - Fallback data ketika API tidak tersedia

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ dan npm/yarn
- NASA FIRMS API Key (gratis dari [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/api/area/))

### Instalasi

1. **Clone atau ekstrak project**
```bash
cd indonesia-fire-monitor
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
# Salin file .env.example ke .env
copy .env.example .env
```

4. **Edit file `.env` dan masukkan API key Anda**
```env
VITE_NASA_MAP_KEY=28a847cd248c2272dc9b58b20e74fa9f
VITE_REFRESH_INTERVAL=600000
# Optional: Mapbox token untuk satellite imagery
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

5. **Run development server**
```bash
npm run dev
```

6. **Buka browser** di `http://localhost:3000`

## 🔑 Mendapatkan NASA FIRMS API Key

1. Kunjungi [NASA FIRMS API](https://firms.modaps.eosdis.nasa.gov/api/area/)
2. Isi formulir pendaftaran dengan email Anda
3. Cek email untuk mendapatkan MAP KEY
4. Salin MAP KEY ke file `.env`

**Format URL NASA FIRMS:**
```
https://firms.modaps.eosdis.nasa.gov/api/area/csv/28a847cd248c2272dc9b58b20e74fa9f/VIIRS_SNPP_NRT/95,-11,141,6/1
```

## 📁 Struktur Project

```
indonesia-fire-monitor/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── MapView.jsx           # Main map container
│   │   ├── HotspotLayer.jsx      # Hotspot markers layer
│   │   ├── AQILayer.jsx          # Air quality layer
│   │   ├── WeatherLayer.jsx      # Weather data layer
│   │   ├── SidebarFilters.jsx    # Left sidebar with filters
│   │   ├── SidebarAQI.jsx        # Right sidebar with AQI info
│   │   ├── Header.jsx            # Top header component
│   │   ├── TimeSlider.jsx        # Time range slider
│   │   └── Legend.jsx            # Map legend
│   │
│   ├── services/          # API services
│   │   └── api.js               # NASA FIRMS & BMKG API calls
│   │
│   ├── utils/             # Utility functions
│   │   └── dataProcessing.js    # Data filtering & processing
│   │
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
│
├── .env.example           # Environment variables template
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🛠️ Teknologi Stack

- **Frontend Framework:** React 18.3.1
- **Build Tool:** Vite 5.3.1
- **Styling:** TailwindCSS 3.4.3
- **Mapping Library:** Leaflet.js 1.9.4 + React-Leaflet 4.2.1
- **HTTP Client:** Axios 1.7.2
- **Date Handling:** date-fns 3.6.0
- **Icons:** Lucide React 0.344.0

## 🎨 Fitur Detail

### 1. Hotspot Layer
- Marker dengan warna berbeda berdasarkan confidence level:
  - 🔴 **Merah** - High confidence
  - 🟠 **Orange** - Nominal confidence
  - 🟡 **Kuning** - Low confidence
- Ukuran marker berdasarkan brightness temperature
- Popup detail: lokasi, waktu, confidence, brightness, FRP, satelit
- Indikator risiko kebakaran

### 2. Air Quality Index (AQI) Layer
- Lingkaran radius 20km untuk setiap stasiun monitoring
- Warna berdasarkan standar AQI PM2.5:
  - 🟢 0-50: Baik
  - 🟡 51-100: Sedang
  - 🟠 101-150: Tidak Sehat (Sensitif)
  - 🔴 151-200: Tidak Sehat
  - 🟣 201-300: Sangat Tidak Sehat
  - ⚫ 300+: Berbahaya

### 3. Weather Layer
- Marker dengan ikon termometer
- Warna berdasarkan suhu
- Data: suhu, kelembaban, kecepatan angin, arah angin, curah hujan
- Fire Weather Index sederhana

### 4. Filter & Controls
- **Confidence Level:** All / High / Nominal / Low
- **Provinsi:** Filter berdasarkan wilayah provinsi
- **Brightness:** Slider untuk minimum brightness (0-500K)
- **Time Range:** 1-7 hari terakhir
- **Layer Toggle:** On/Off untuk setiap layer

### 5. Real-time Features
- Auto-refresh setiap 10 menit (configurable)
- Timestamp update terakhir
- Offline mode dengan fallback data
- Loading indicators

## 📊 Data Sources

### NASA FIRMS (Fire Information for Resource Management System)
- **Satelit:** VIIRS SNPP Near Real-Time
- **Coverage:** Indonesia (95°E - 141°E, 11°S - 6°N)
- **Update Frequency:** 3 jam
- **Data:** Hotspot location, brightness, confidence, FRP

### BMKG Data
⚠️ **Note:** BMKG tidak menyediakan public API yang mudah diakses. Aplikasi ini menggunakan:
- Mock data untuk demonstrasi
- Untuk production, Anda perlu:
  1. Setup backend proxy untuk BMKG API
  2. Atau gunakan alternatif seperti AQICN.org, OpenWeatherMap
  3. Parse XML data dari BMKG

### Alternative API Sources (Production)
- **AQI:** [aqicn.org](https://aqicn.org/api/)
- **Weather:** [OpenWeatherMap](https://openweathermap.org/api)
- **Weather:** [WeatherAPI](https://www.weatherapi.com/)

## 🔧 Configuration

### Environment Variables

```env
# NASA FIRMS API Key (Required)
VITE_NASA_MAP_KEY=28a847cd248c2272dc9b58b20e74fa9f

# Auto-refresh interval in milliseconds (Optional, default: 600000 = 10 minutes)
VITE_REFRESH_INTERVAL=600000

# Mapbox token for satellite imagery (Optional)
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

### Customization

**Mengubah refresh interval:**
```javascript
// src/App.jsx, line ~37
const refreshInterval = import.meta.env.VITE_REFRESH_INTERVAL || 600000
```

**Mengubah Indonesia bounding box:**
```javascript
// src/services/api.js, line ~7
const INDONESIA_BBOX = [95, -11, 141, 6] // [west, south, east, north]
```

**Mengubah center map:**
```javascript
// src/components/MapView.jsx, line ~7
const INDONESIA_CENTER = [-2.5, 118.0] // [latitude, longitude]
```

## 📱 Responsive Design

Aplikasi fully responsive dengan breakpoints:
- **Desktop:** Full sidebar layout (>1280px)
- **Tablet:** Collapsible sidebars (768px - 1280px)
- **Mobile:** Bottom sheet layout (<768px)

## 🚀 Build untuk Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

Output akan ada di folder `dist/`.

### Deploy

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**GitHub Pages / Static Hosting:**
```bash
npm run build
# Upload folder dist/ ke hosting Anda
```

## 🐛 Troubleshooting

### Issue: "Failed to fetch hotspots"
- Pastikan NASA MAP KEY sudah benar di `.env`
- Cek koneksi internet
- NASA API memiliki rate limit (1000 requests/day untuk free tier)

### Issue: "Map not loading"
- Pastikan Leaflet CSS ter-load
- Cek browser console untuk errors
- Clear cache dan reload

### Issue: "Data tidak update"
- Cek NASA FIRMS mungkin sedang delay
- Pastikan auto-refresh aktif
- Manual refresh dengan tombol Refresh

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:
1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 TODO / Future Enhancements

- [ ] Integrasi dengan BMKG API real (butuh backend proxy)
- [ ] Clustering untuk hotspot yang berdekatan
- [ ] Export data ke CSV/Excel
- [ ] Notifikasi push untuk hotspot baru
- [ ] Historical data comparison
- [ ] Heatmap layer
- [ ] Smoke dispersion modeling
- [ ] Mobile app (React Native)
- [ ] Admin dashboard untuk data management
- [ ] Multi-language support (EN/ID)
- [x] 🔮 **Hotspot Prediction dengan Deep Learning** - See `PREDICTION_GUIDE.md` and `IMPLEMENTATION_ROADMAP.md`

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 👨‍💻 Author

Created with ❤️ for Indonesia's fire monitoring and air quality awareness.

## 🙏 Acknowledgments

- [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) - Fire data
- [BMKG](https://www.bmkg.go.id/) - Weather & climate data
- [Leaflet.js](https://leafletjs.com/) - Mapping library
- [OpenStreetMap](https://www.openstreetmap.org/) - Map tiles

---

**⚠️ Important Notes:**
1. Data hotspot memiliki delay ~3 jam dari deteksi satelit
2. Mock data digunakan untuk AQI dan Weather (production perlu API real)
3. Confidence "low" bisa termasuk false positives
4. Aplikasi ini untuk monitoring, bukan untuk emergency response official

**🆘 Emergency:**
Untuk kebakaran darurat, hubungi:
- **Damkar:** 113
- **Manggala Agni (KLHK):** 021-5747322
- **BNPB:** 117

---

**Made with 🔥 for Indonesia**

=======
# indonesia-fire-monitor
untuk lomba 
>>>>>>> 5dc439c733d12e21c3a372cfc7a88b8c798c4166
