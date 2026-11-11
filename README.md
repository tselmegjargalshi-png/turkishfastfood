# İstanbul Fast Food · Dijital Menü

Dijital menü, 14 alerjen simgesi, kalori bilgisi, yemek kartları, yönetim paneli ve 2 QR kod.

* Menü: `/`
* Yönetim: `/admin` (şifre Vercel'deki `ADMIN_PASSWORD` değişkenidir)
* QR kodlar: `/qr`

## Depolama
İlk menü `data/menu.json` dosyasındadır. Yönetim panelinde yapılan değişiklikler `/api/menu` üzerinden Vercel Blob'a kaydedilir ve menü yaklaşık 1 dakika içinde güncellenir. Fotoğraflar `/api/upload` ile Blob'a yüklenir.

Vercel ayarları: `ADMIN_PASSWORD` (zorunlu). Storage bölümünde bir Blob store bağlayınca `BLOB_READ_WRITE_TOKEN` otomatik oluşur.
