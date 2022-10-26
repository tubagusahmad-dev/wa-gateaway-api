const fs = require('fs');
const Device = require('./devices.js');
const Contact = require('./contacts.js');

const handleRest = (http, wa, idStr) => {

    http.post(`/${idStr}/send/message`, async (req, res) => {

        if (!Device.get()[idStr] && !Contact.get(idStr)) {
            res.json({
                success: false,
                message: "Device Not Found",
                data: null
            }).end();
            return;
        }
        
        if (req.body.receiver == undefined) {
            res.json({
                success: false,
                message: "Receiver ID Not Valid",
                data: null
            }).end();
            return;
        }

        let receivers = [];
        let messages = [];

        if (req.body.receiver instanceof Array) {
            let unrealReceivers = req.body.receiver;
            for (var i = 0; i < unrealReceivers.length; i++) {
                let receiver = unrealReceivers[i].replaceAll('+', '');
                if (!receiver.includes('@g.us') && !receiver.includes('@s.whatsapp.net')) {
                    receiver = receiver + "@s.whatsapp.net";
                }
                receivers.push(receiver);
            }
        }else if(req.body.receiver === "all_contacts") {
            let contacts = require('./contacts.js').get(idStr);
            Object.keys(contacts).forEach((key, i) => {
                receivers.push(key);
            });
        } else {
            let receiver = req.body.receiver.replaceAll('+', '');
            if (!receiver.includes('@g.us') && !receiver.includes('@s.whatsapp.net')) {
                receiver = receiver + "@s.whatsapp.net";
            }
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
        if (!Device.get()[idStr] && !Contact.get(idStr)) {
            res.json({
                success: false,
                message: "Device Not Found",
                data: null
            }).end();
            return;
        }
        wa.logout();
        res.json({
            success: true,
            message: "Device Logout Success",
            data: null
        }).end();
    });

    http.get(`/${idStr}/contacts`, (req, res) => {
        if (!Device.get()[idStr] && !Contact.get(idStr)) {
            res.json({
                success: false,
                message: "Device Not Found",
                data: null
            }).end();
            return;
        }
        res.json(Contact.get(idStr)).end();
    });

    const sendMessages = async (receivers, messages, wa, httpRes) => {
        for (var r = 0; r < receivers.length; r++) {
            for (var m = 0; m < messages.length; m++) {
                await wa.sendMessage(receivers[r], messages[m]);
            }
        }

        httpRes.json({
            success: true,
            message: "Message Sent!",
            data: {
                receiverCount: receivers.length,
                messagecount: messages.length
            }
        }).end();
    }
}

module.exports = handleRest;