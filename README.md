# KampüsFlow 🎓

> Uludağ Üniversitesi İnegöl İşletme Fakültesi — Kampüs Etkinlik Yönetim Platformu

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)

---

## 🎯 Proje Hakkında

KampüsFlow, üniversite topluluklarının etkinliklerini duyurduğu, öğrencilerin tek tıkla kayıt olabildiği ve kontenjan yönetiminin otomatik yapıldığı bir platformdur.

**İlk hedef topluluk:** UYBİST — Uludağ Yönetim Bilişim Sistemleri Topluluğu  
**Kapsam:** İnegöl İşletme Fakültesi (ilerleyen dönemde tüm fakültelere açılacak)

---

## ✨ Özellikler

- 🔐 **Rol bazlı erişim** — Admin, Topluluk Temsilcisi, Öğrenci
- 🎫 **Anlık kontenjan takibi** — Dolar dolmaz otomatik güncellenir
- ⏳ **Otomatik bekleme listesi** — İptal olunca sıradaki otomatik alınır
- 🔔 **Anlık bildirimler** — Temsilciler her kayıt/iptal için bildirim alır
- 📊 **Admin & Temsilci dashboard** — Grafikler, tablolar, istatistikler
- 📱 **Mobil uyumlu** — Her cihazdan erişilebilir

---

## 👥 Kullanıcı Rolleri

| Rol | Erişim |
|---|---|
| **Admin** | Tüm sistem yönetimi |
| **Topluluk Temsilcisi** | Kendi topluluğunun etkinlikleri |
| **Öğrenci** | Etkinlik listeleme, kayıt, profil |

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm

### Adımlar
```bash
# Repoyu klonla
git clone https://github.com/KULLANICI_ADIN/kampusflow.git
cd kampusflow

# Bağımlılıkları yükle
npm install

# Veritabanını oluştur
npx prisma db push

# Demo verilerini yükle
npx prisma db seed

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda aç: `http://localhost:3000`

---

## 🔑 Demo Hesapları

| Rol | E-posta | Şifre |
|---|---|---|
| Admin | admin@uludag.edu.tr | admin123 |
| UYBİST Temsilcisi | uybist@uludag.edu.tr | uybist123 |
| Öğrenci | ali@uludag.edu.tr | user123 |

---

## 🛠 Teknoloji Stack

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 14 (App Router) |
| Dil | TypeScript |
| Auth | NextAuth.js v5 |
| Veritabanı | SQLite + Prisma ORM |
| UI | Tailwind CSS |
| Bildirimler | react-hot-toast |
| Deploy | Vercel |

---

## 📁 Proje Yapısı
```
kampusflow/
├── app/
│   ├── (auth)/          → Giriş & Kayıt sayfaları
│   ├── (main)/          → Kullanıcı sayfaları
│   │   ├── events/      → Etkinlik listesi & detay
│   │   └── profile/     → Profil sayfası
│   ├── admin/           → Admin paneli
│   ├── representative/  → Topluluk temsilcisi paneli
│   └── api/             → API route'ları
├── lib/
│   ├── auth.ts          → NextAuth config
│   └── prisma.ts        → Prisma client
├── prisma/
│   ├── schema.prisma    → Veritabanı şeması
│   └── seed.ts          → Demo verileri
└── public/              → Logolar & görseller
```

---

## 🗃 Veritabanı Şeması
```
User ──────────── Registration ──────────── Event
 │                                            │
 │  id, name, email                          │  id, title, description
 │  role (admin|rep|user)                    │  quota, registeredCount
 │  communityName                            │  waitlistCount, deadline
 └── notifications                          └── community, status
```

---

## 🏗 Sistem Davranışları

### Bekleme Listesi Lojiği
```
Kullanıcı "Katıl" tıklar
       │
       ▼
registeredCount < quota?
   │              │
  EVET           HAYIR
   │              │
   ▼              ▼
"confirmed"   "waitlist"
 status       position = N+1
```

### İptal Lojiği
```
Kullanıcı iptal eder
       │
       ▼
Kayıt silinir → registeredCount - 1
       │
       ▼
Bekleme listesinde biri var mı?
       │
      EVET
       │
       ▼
1. kişi → "confirmed" olur
waitlistCount - 1
registeredCount + 1
Temsilciye bildirim gönderilir
```

---

## 📸 Ekran Görüntüleri

> Giriş Sayfası · Etkinlik Listesi · Etkinlik Detay · Admin Dashboard · Temsilci Paneli

---

## 🔮 Yol Haritası

- [ ] Diğer fakülte topluluklarına açılım
- [ ] E-posta bildirimleri
- [ ] Etkinlik görseli yükleme
- [ ] QR kod ile katılım doğrulama
- [ ] Mobil uygulama (React Native)

---

## 👨‍💻 Geliştirici

**Uludağ Üniversitesi İnegöl İşletme Fakültesi**  
UYBİST — Yönetim Bilişim Sistemleri Topluluğu  
Hackathon 2025 · 24 saatte geliştirildi ⚡

---

## 📄 Lisans

MIT License — Özgürce kullanabilir, geliştirebilirsin.
