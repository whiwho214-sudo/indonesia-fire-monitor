# 🔧 Fix: API Sudah Jalan Tapi localhost Tidak Bisa Dibuka

API sudah berjalan di terminal (ada pesan `INFO: Uvicorn running`), tapi `http://localhost:8000` tidak bisa dibuka di browser.

## ✅ KEMUNGKINAN PENYEBAB & SOLUSI:

### 1. Masalah IPv6 vs IPv4
Browser mungkin mencoba IPv6 (`::1`) yang gagal, padahal API listening di IPv4.

**Solusi:**
- Coba gunakan langsung: `http://127.0.0.1:8000` (tanpa localhost)
- Atau restart API dengan host `127.0.0.1` (sudah saya update)

### 2. Browser Cache atau Proxy
Browser mungkin cache response atau ada proxy yang memblokir.

**Solusi:**
- **Hard refresh**: Tekan `Ctrl + Shift + R`
- **Incognito mode**: Buka tab incognito/private dan coba akses
- **Ganti browser**: Coba browser lain (Chrome, Firefox, Edge)

### 3. Firewall Windows
Windows Firewall mungkin memblokir koneksi.

**Solusi:**
1. Buka **Windows Defender Firewall**
2. Klik **Allow an app or feature through Windows Firewall**
3. Cari **Python** dan pastikan centang untuk **Private** dan **Public**
4. Atau tambahkan exception untuk port 8000

### 4. Port Terblokir
Port 8000 mungkin terblokir oleh antivirus atau security software.

**Solusi:**
- Cek antivirus/security software Anda
- Tambahkan exception untuk Python atau port 8000

### 5. Browser Extension
Extension browser mungkin memblokir localhost.

**Solusi:**
- Nonaktifkan extension sementara
- Atau gunakan browser incognito

---

## 🧪 TEST KONEKSI:

### Test 1: Menggunakan curl
Buka terminal baru dan jalankan:
```powershell
curl http://localhost:8000
```
atau
```powershell
curl http://127.0.0.1:8000
```

**Jika berhasil**: Muncul JSON response
**Jika gagal**: Muncul error connection refused atau timeout

### Test 2: Test dari Terminal
```powershell
Test-NetConnection -ComputerName localhost -Port 8000
```

**Jika berhasil**: `TcpTestSucceeded : True`

### Test 3: Test dari Browser dengan IP Langsung
Coba akses:
- `http://127.0.0.1:8000` (tanpa localhost)

---

## 🛠️ LANGKAH PERBAIKAN:

### Langkah 1: Stop API
Di terminal API, tekan **Ctrl+C** untuk stop.

### Langkah 2: Restart API
Jalankan lagi:
```powershell
cd ml-prediction
.\venv\Scripts\python.exe api\prediction_api.py
```

### Langkah 3: Test dengan 127.0.0.1
Setelah API running, coba akses di browser:
```
http://127.0.0.1:8000
```

### Langkah 4: Test dari Browser Console
1. Buka aplikasi React
2. Tekan **F12**
3. Di console, ketik:
```javascript
fetch('http://127.0.0.1:8000')
  .then(r => r.json())
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Error:', err))
```

---

## 📋 CHECKLIST:

- [ ] API sudah berjalan (`INFO: Uvicorn running`)
- [ ] Test-NetConnection berhasil
- [ ] Coba akses `http://127.0.0.1:8000` (bukan localhost)
- [ ] Hard refresh browser (`Ctrl + Shift + R`)
- [ ] Coba browser lain
- [ ] Cek Windows Firewall
- [ ] Test dengan curl dari terminal

---

## 🆘 MASIH TIDAK BISA?

Jika semua sudah dicoba tapi masih tidak bisa:

1. **Coba port lain**: Ubah port dari 8000 ke 8001 atau 3000
2. **Cek antivirus**: Nonaktifkan sementara untuk test
3. **Cek proxy**: Pastikan browser tidak menggunakan proxy
4. **Restart komputer**: Terkadang solusi paling sederhana

Jika masih error, kirimkan:
- Screenshot error di browser
- Output dari `curl http://127.0.0.1:8000`
- Output dari `netstat -ano | findstr :8000`

