const fs = require('fs')

const Device = {
    save: (id = "") => {
        const path = __dirname + '/db/devices.json';

        if(!fs.existsSync(path)){
            fs.writeFileSync(path, "{}", 'utf-8');
        }

        var devices = JSON.parse(fs.readFileSync(path, 'utf-8'));

        devices[id] = id;

        fs.writeFileSync(path, JSON.stringify(devices), 'utf-8');
    },

    get: () => {
        const path = __dirname + '/db/devices.json';

        if(!fs.existsSync(path)){
            fs.writeFileSync(path, "{}", 'utf-8');
        }

        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    },

    delete: (id) => {
        const path = __dirname + '/db/devices.json';

        if(!fs.existsSync(path)){
            fs.writeFileSync(path, "{}", 'utf-8');
        }

        var devices = JSON.parse(fs.readFileSync(path, 'utf-8'));

        delete devices[id];

        fs.writeFileSync(path, JSON.stringify(devices), 'utf-8');
    }
}

module.exports = Device