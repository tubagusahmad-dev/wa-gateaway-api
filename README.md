# WA Gateaway API

Aplikasi ini adalah implementasi dari [@adiwajshing/Baileys](https://github.com/adiwajshing/Baileys) sebuah RESTful API WhatsApp dengan yg mendukung multi device dan mudah digunakan.

## Persyaratan

-   **NodeJS** versi **14.5.0** atau diatasnya.

## Instalasi

1. Download atau clone repo.
2. Masuk ke direktori project.
3. Jalankan `npm start`.

## Konfigurasi file `.env`

```env
# Listening Host
HOST=127.0.0.1

# Listening Port
PORT=8000
```

## Dokumentasi API

Endpoint: `http://APP_HOST/DEVICE_ID/send/message` value `DEVICE_ID` bisa kamu dapetin di daftar device di dashboard

Response json dari pesan yg dikirim akan seperti ini:

```javascript
{
    success: true|false, 
    message: "", 
    data: {}|[] 
}
```

## Mengirim Pesan

Semua data pesan yg dikirim harus berupa json body 

### Penerima Pesan

Kamu bisa ngirim satu kesan ke beberapa nomor atau beberapa pesan sekaligus dengan beberapa format berikut:

```javascript
// Mengirim pesan ke satu nomor dan satu pesan
{
    "receiver": "628231xxxxx", 
    "message": {               
        // Object pesan
    }
}

// Mengirim pesan ke semua kontak yg tampil di dashboard 
{
    "receiver": "all_contacts", 
    "message": {               
        // Object pesan
    }
}

// Mengirim pesan ke beberapa nomor pilihan dan mengirim beberapa pesan sekaligus
// Tidak bisa pake value all_contacts
{
    "receiver": ["628231xxxxx", "628231xxxxx", "628231xxxxx"], 
    "message": [
        {               
            // Object pesan 1
        },
        {               
            // Object pesan 2
        },
        {               
            // Object pesan 3
        }
    ]
}
```

### Object Pesan

```javascript

    // Mengirim pesan teks biasa
    {
        "receiver": "628231xxxxx",
        "message": {
            "text": {
                "url": "https://example.com/logo.png"
            }
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

