# WA Gateaway API

Aplikasi ini adalah implementasi dari [@adiwajshing/Baileys](https://github.com/adiwajshing/Baileys) sebuah RESTful API WhatsApp dengan yg mendukung multi device dan mudah digunakan.

## Persyaratan

-   **NodeJS** versi **14.5.0** atau diatasnya.

## Instalasi

1. Download atau clone repo.
2. Masuk ke direktori project.
3. Instal dependency jalankan `(npm install --save)`.

## Konfigurasi file `.env`

```env
# Listening Host
HOST=127.0.0.1

# Listening Port
PORT=8000
```

## Dokumentasi API

Endpoint API `http://APP_HOST/DEVICE_ID/send/message`
Server akan mengirim response json:

```javascript
{
    success: true|false, // bool
    message: "", // string
    data: {}|[] // object atau array object
}
```

## Mengirim Pesan

Semua pesan yg dikirim harus berupa json 

Contoh:

```javascript
// Mengirim pesan teks
{
    "receiver": "628231xxxxx", // Untuk mengirim ke banyak nomor ["628231xxxxx", "628231xxxxx"]
    "message": {               // Untuk mengirim banyak pesan [Object, Object]
        "text": "Hello there!"
    }
}

// Mengirim pesan gambar
{
    "receiver": "628231xxxxx",
    "message": {
        "image": {
            "url": "https://example.com/logo.png"
        },
        "caption": "My logo"
    }
}

// Mengirim pesan video
{
    "receiver": "628231xxxxx",
    "message": {
        "video": {
            "url': "https://example.com/intro.mp4"
        },
        "caption": "My intro"
    }
}

// Mengirim pesan dokumen
{
    "receiver": "628231xxxxx",
    "message": {
        "document": {
            "url": "https://example.com/presentation.pdf"
        },
        "mimetype": "application/pdf",
        "fileName": "presentation-1.pdf"
    }
}
```

Untuk contoh lainnya bisa lihat dokumentasi Baileys [disini](https://github.com/adiwajshing/Baileys#sending-messages).

