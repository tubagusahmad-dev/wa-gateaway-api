const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, Browsers } = require("@adiwajshing/baileys")
const fs = require('fs');
const qrCode = require('qrcode');
const handleRest = require('./rest-handler.js');
const Device = require('./devices.js');
const Contact = require('./contacts.js');

const connectWA = async (io, http, idStr) => {
    const { state, saveCreds } = await useMultiFileAuthState(`./db/wa_auth/${idStr}`)

    let conn = await makeWASocket({
        printQRInTerminal: false,
        auth: state,
        browser: Browsers.ubuntu("Firefox")
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
                Device.delete(idStr);
                fs.rmSync(`./db/contact/contacts-${idStr}.json`, { recursive: true, force: true })
                io.emit(`wa:logedout ${idStr}`, idStr);
            }

        } else if(connection === 'open') {
            Device.save(idStr);
            handleRest(http, conn, idStr);
            io.emit(`wa:connected ${idStr}`, code);
        }

    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('contacts.upsert', contacts => {
        contacts.forEach(contact => {
            const contactSet = {
                name: contact.name,
                id: contact.id,
                type: "contact"
            }
            Contact.save(idStr, contact.id, contactSet);
        });
        io.emit(`wa:contacts ${idStr}`, JSON.stringify(Contact.get(idStr)));
    });

    conn.ev.on('groups.upsert', groups => {
        groups.forEach(group => {
            const groupSet = {
                name: group.subject,
                id: group.id,
                type: "group"
            };
            Contact.save(idStr, group.id, groupSet);
        });
        io.emit(`wa:contacts ${idStr}`, JSON.stringify(Contact.get(idStr)));
    });

    conn.ev.on('messages.upsert', m => {
        m.messages.forEach(message => {
            let id = message.key.remoteJid;
            let name = id.includes('g.us') ? message.labels : message.pushName;
            let type = id.includes('g.us') ? 'group' : 'contact';
            if (message.messageStubType == 28) {
                Contact.delete(idStr, id);
            }
            if (message.messageStubType == 32) {
                Contact.delete(idStr, id);
            }
            if(!message.key.fromMe){
                Contact.save(idStr, id, {
                    name: name,
                    id: id,
                    type: type
                });
            }
        });
        io.emit(`wa:contacts ${idStr}`, JSON.stringify(Contact.get(idStr)));
    });

    io.on(`wa:get-contacts ${idStr}`, (device) => {
        io.emit(`wa:contacts ${idStr}`, JSON.stringify(Contact.get(idStr)));
        console.log(idStr);
    });

}

module.exports = connectWA;