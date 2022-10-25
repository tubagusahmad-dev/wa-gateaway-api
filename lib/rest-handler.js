const formidable = require('formidable');
const fs = require('fs');
const Device = require('./devices.js');

const HTTP_PROTOCOL = process.env.HTTP_PROTOCOL;
const APP_HOST = process.env.APP_HOST;
const APP_PORT = parseInt(process.env.APP_PORT);

const handleRest = (http, wa, idStr) => {

    http.post(`/${idStr}/send/message`, async (req, res) => {

        if (!Device.get()[idStr] && !fs.existsSync(__dirname + `/db/wa_auth/${idStr}`)) {
            res.status(404).send("Device Not Found").end();
            return;
        }
        
        if (req.body.receiver == undefined && req.body.receivers == undefined) {
            res.status(500).send("Input Receiver ID").end();
            return;
        }

        let receivers = [];
        let messages = [];

        if (req.body.receiver) {
            let receiver = req.body.receiver.replaceAll('+', '') + "@s.whatsapp.net";
            receivers = [receiver];
        } else if (req.body.receivers) {
            let unrealReceivers = req.body.receivers;
            for (var i = 0; i < unrealReceivers.length; i++) {
                let receiver = unrealReceivers[i].replaceAll('+', '') + "@s.whatsapp.net";
                receivers.push(receiver);
            }
        }

        if (req.body.message) {
            messages = [req.body.message];
        }else if (req.body.messages) {
            messages = req.body.messages;
        }

        await sendMessages(receivers, messages, wa, res);
    });

    http.post(`/${idStr}/send/media`, async (req, res, next) => {

        if (!Device.get()[idStr] && !fs.existsSync(__dirname + `/db/wa_auth/${idStr}`)) {
            res.status(404).send("Device Not Found").end();
            return;
        }

        const form = formidable({multiples: true});
        let media = null;
        let mimeType = null;
        let message = {};
        let caption = "";

        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(500).send("Uploading Media Error").end();
                return;
            }

            if (fields.caption) {
                caption = fields.caption;
            }

            if (files.image) {
                media = files.image;
                mimeType = "image/*";
                message = {
                    image:{url: `${HTTP_PROTOCOL}://${req.headers.host}/file/${mimeType.split('/')[0]}/` + media.originalFilename},
                    caption: caption
                }
            }else if (files.video) {
                media = files.video;
                mimeType = "video/*";
                message = {
                    video:{url: __dirname + `/assets/${mimeType.split('/')[0]}/` + media.originalFilename},
                    caption: caption,
                    gifPlayback: true
                }
            }else if (files.audio) {
                media = files.audio;
                mimeType = "audio/mp4";
                message = {
                    audio:{url: __dirname + `/assets/${mimeType.split('/')[0]}/` + media.originalFilename}
                }
            }else {
                res.status(500).send("Upload Media File To Send").end();
                return;
            }

            if (fields.receiver == undefined) {
                res.status(500).send("Input Receiver ID").end();
                return;
            }

            let receiver = fields.receiver.replaceAll('+', '') + "@s.whatsapp.net";
            let oldPath = media.filepath;
            let newPath = __dirname + `/assets/${mimeType.split('/')[0]}/` + media.originalFilename;

            fs.rename(oldPath, newPath, async (err) => {
                if (err) {
                    res.status(500).send(`FS Server Error: ${err}`).end();
                    return;
                }

                await wa.sendMessage(receiver, message);

                res.status(200).send("Media Sent!").end();
            });
        });
    });

    http.get(`/${idStr}/logout`, (req, res) => {
        if (!Device.get()[idStr] && !fs.existsSync(__dirname + `/db/wa_auth/${idStr}`)) {
            res.status(404).send("Device Not Found").end();
            return;
        }
        wa.logout();
        Device.delete(idStr);
        fs.rmdirSync(__dirname + `/db/wa_auth/${idStr}`, { recursive: true, force: true });
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