const fs = require('fs');
const Device = require('./devices.js');

const handleRest = (http, wa, idStr) => {

    http.post(`/${idStr}/send/message`, async (req, res) => {

        if (!Device.get()[idStr] && !fs.existsSync(`./db/wa_auth/${idStr}`)) {
            res.status(404).send("Device Not Found").end();
            return;
        }
        
        if (req.body.receiver == undefined && req.body.receivers == undefined) {
            res.status(500).send("Input Receiver ID").end();
            return;
        }

        let receivers = [];
        let messages = [];

        if (req.body.receiver instanceof Array) {
            let unrealReceivers = req.body.receiver;
            for (var i = 0; i < unrealReceivers.length; i++) {
                let receiver = unrealReceivers[i].replaceAll('+', '') + "@s.whatsapp.net";
                receivers.push(receiver);
            }
        } else {
            let receiver = req.body.receiver.replaceAll('+', '') + "@s.whatsapp.net";
            receivers = [receiver];
        }

        if (req.body.message instanceof Array) {
            messages = req.body.message;
        }else {
            messages = [req.body.message];
        }

        await sendMessages(receivers, messages, wa, res);
    });

    http.get(`/${idStr}/logout`, (req, res) => {
        if (!Device.get()[idStr] && !fs.existsSync(`./db/wa_auth/${idStr}`)) {
            res.status(404).send("Device Not Found").end();
            return;
        }
        wa.logout();
        res.status(200).send("Device Logout!").end();
    });

    const sendMessages = async (receivers, messages, wa, httpRes) => {
        for (var r = 0; r < receivers.length; r++) {
            for (var m = 0; m < messages.length; m++) {
                await wa.sendMessage(receivers[r], messages[m]);
            }
        }

        httpRes.status(200).send("Message Sent!").end();
    }
}

module.exports = handleRest;