const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require("@adiwajshing/baileys")
const fs = require('fs');
const qrCode = require('qrcode');
const handleRest = require('./rest-handler.js');
const Device = require('./devices.js');

const connectWA = async (io, http, idStr) => {
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + `/db/wa_auth/${idStr}`)

    let conn = await makeWASocket({
        printQRInTerminal: false,
        auth: state
    });
    
    conn.ev.on('connection.update', async (update) => {

        const { connection, lastDisconnect } = update;
        let code = "";

        if (update.qr){
            qrCode.toDataURL(update.qr, (err, qrCode) => {
                code = qrCode;
                io.emit(`wa:qr ${idStr}`, code);
            });
        }

        if(connection === 'close') {

            const shouldReconnect = lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
            
            if(shouldReconnect) {
                connectWA(io, http, idStr);
            }else{

            }

        } else if(connection === 'open') {
            Device.save(idStr);
            handleRest(http, conn, idStr);
            io.emit(`wa:connected ${idStr}`, code);
        }

    });

    conn.ev.on('creds.update', saveCreds);

}

module.exports = connectWA;