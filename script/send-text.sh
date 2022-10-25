
# Mengirim Pesan Biasa

curl -X POST http://HTTP_HOST/DEVICE_ID/send/message
   -H 'Content-Type: application/json'
   -d '{
            "receiver" : "nomor_tujuan",
            "message" : {
                "text":"Hello World"
            }
        }'



# Mengirim 1 Pesan Ke Banyak Nomor

curl -X POST http://HTTP_HOST/DEVICE_ID/send/message
   -H 'Content-Type: application/json'
   -d '{
            "receivers" : ["nomor_tujuan", "nomor_tujuan_2", "nomor_tujuan_3"],
            "message" : {
                "text":"Hello World"
            }
        }'

# Mengirim Banyak Pesan Ke Banyak Nomor

curl -X POST http://$1/send/message
   -H 'Content-Type: application/json'
   -d '{
            "receivers" : ["nomor_tujuan", "nomor_tujuan_2", "nomor_tujuan_3"],
            "messages" : [
                {
                    "text":"Hello World"
                },
                {
                    "text":"Apa kabar?"
                }
            ]
        }'