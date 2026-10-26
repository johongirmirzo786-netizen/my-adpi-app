# YangiAlifbo — telefon uchun oddiy ilova

Bu telefon brauzerida ishlaydigan, bosh ekranga ilova sifatida o‘rnatiladigan PWA.

## Funksiyalar
- Matn kiritish
- `o‘ → ö`, `g‘ → ğ`, `sh → ş`, `ch → ç` alifbo konvertatsiyasi
- Nusxalash va ulashish
- Sozlamalarda ixtiyoriy imlo API manzili
- Telefon ekraniga mos interfeys

## Muhim
API manzili sozlanmaganda ilova qurilmada alifbo o‘girishni va kichik namuna imlo tuzatishlarini bajaradi. Bu to‘liq o‘zbek imlo tekshiruvchisi emas. To‘liq AI tekshiruvi uchun avvalgi FastAPI backendni HTTPS orqali joylashtiring va ilovadagi Sozlamalar bo‘limiga `/api/convert` manzilini kiriting.

## Telefonga o‘rnatish
1. Fayllarni HTTPS hostingga joylashtiring.
2. Android Chrome’da saytni ochib menyu → **Bosh ekranga qo‘shish** ni tanlang.
3. iPhone Safari’da Share → **Add to Home Screen** ni tanlang.

## Lokal sinov
`python -m http.server 8080` buyrug‘ini bajarib, `http://localhost:8080/yangi-alifbo-phone-app/` yo‘lini oching.
