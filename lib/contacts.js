const fs = require('fs')

const Contact = {
    save: (deviceId = "", contactId, data) => {
        const path = `./db/contact/contacts-${deviceId}.json`;

        if(!fs.existsSync(path)){
            fs.writeFileSync(path, "{}", 'utf-8');
        }

        var devices = JSON.parse(fs.readFileSync(path, 'utf-8'));

        devices[contactId] = data;

        fs.writeFileSync(path, JSON.stringify(devices), 'utf-8');
    },

    get: (deviceId) => {
        const path = `./db/contact/contacts-${deviceId}.json`;

        if(!fs.existsSync(path)){
            fs.writeFileSync(path, "{}", 'utf-8');
        }

        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    },

    delete: (deviceId, contactId) => {
        const path = `./db/contact/contacts-${deviceId}.json`;

        if(!fs.existsSync(path)){
            fs.writeFileSync(path, "{}", 'utf-8');
        }

        var devices = JSON.parse(fs.readFileSync(path, 'utf-8'));

        delete devices[contactId];

        fs.writeFileSync(path, JSON.stringify(devices), 'utf-8');
    }
}

module.exports = Contact;