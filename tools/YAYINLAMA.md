# Yeni sürüm yayınlama (bakımcı notu)

1. Yeni kurulumu `updates/KayraPOS_V<sürüm>_Kurulum.exe` olarak ekleyin.
2. İmzalayın (imza anahtarı bu depoda DEĞİLDİR; sahibinde saklanan `KayraPOS_Guncelleme_Imza_Anahtari.key` dosyası gerekir):

       python3 tools/sign.py KayraPOS_Guncelleme_Imza_Anahtari.key updates/KayraPOS_V24_86_Kurulum.exe 24.86 SURUM_NOTLARI.txt stable.json

3. `stable.json` ve kurulum dosyasını aynı commit ile gönderin.

Kasalardaki güncelleyici yalnız bu depodaki, gömülü açık anahtarla doğrulanan `stable.json`'u kabul eder
(açık anahtar: `oViCBYEMk8cpApmqq9MXQRzBKPbJpWYKxJkHYD52CAM=`). Eski sürüm dosyaları silinebilir.
