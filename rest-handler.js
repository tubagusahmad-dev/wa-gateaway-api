const formidable = require('formidable');
const fs = require('fs');

const handleRest = (http, wa, idStr) => {

    http.post(`/${idStr}/send/message`, async (req, res) => {
        
        if (req.body.receiver == undefined) {
            res.status(500).send("Input Receiver ID").end();
            return;
        }

        let receiver = req.body.receiver.replaceAll('+', '') + "@s.whatsapp.net";
        let text = "";

        if (req.body.message !== undefined) {
            text = req.body.message.text;
        }

        wa.sendMessage(receiver, {text: text});
        res.status(200).send("Message Sent!").end();
    });

    //Bulk Message
    http.post(`/${idStr}/send/message/bulk`, async (req, res) => {

        if (req.body.receiver == undefined) {
            res.status(500).send("Input Receiver ID").end();
            return;
        }

        let receiver = req.body.receiver.replaceAll('+', '') + "@s.whatsapp.net";
        let messages = [];
        
        if (req.body.messages !== undefined && req.body.messages instanceof Array) {
            messages = req.body.messages;
            for (var i = 0; i < messages.length; i++){
                wa.sendMessage(receiver, {text: messages[i].text});
            }
            res.status(200).send("Message Sent!").end();
            return;
        }
    });

    http.post(`/${idStr}/send/image`, async (req, res, next) => {
        const form = formidable({multiples: true});
        form.parse(req, (err, fields, files) => {
            if (err) {
                res.status(500).send("Error").end();
                return;
            }

            if (files.image == undefined) {
                res.status(500).send("Input an Image").end();
                return;
            }

            if (fields.receiver == undefined) {
                res.status(500).send("Input Receiver ID").end();
                return;
            }

            let caption = fields.caption;
            let receiver = fields.receiver.replaceAll('+', '') + "@s.whatsapp.net";
            let oldPath = files.image.filepath;
            let newPath = __dirname + "/assets/images/" + files.image.originalFilename;

            if (fields.caption == undefined) {
                caption = "";
            }

            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    res.status(500).send("FS Error").end();
                    return;
                }

                wa.sendMessage(receiver, {
                    image:{url: "http://localhost:3000/file/image/" + files.image.originalFilename},
                    caption: caption
                });

                res.status(200).send("Image Sent!").end();
            });
 
        });
    });

    http.post(`/${idStr}/send/video`, async (req, res) => {
        
    });

    http.post(`/${idStr}/send/audio`, async (req, res) => {
        
    });

    http.post(`/${idStr}/send/document`, async (req, res) => {
        
    });

    http.post(`/${idStr}/logout`, async (req, res) => {
        wa.logout();
        fs.rmdirSync(__dirname + `/db/wa_auth/${idStr}`, { recursive: true, force: true });
        res.status(200).send("Loged out!").end();
    });
}

module.exports = handleRest;