const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');
const bodyParser = require('body-parser');

const waConnect = require('./wa-connect.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/lib/js/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/lib/css/chota', express.static(__dirname + '/node_modules/chota/dist'));
app.use('/lib/css/tubagus_css', express.static(__dirname + '/lib/css/tubagus_css'));
app.use('/lib/js/feather', express.static(__dirname + '/lib/js/feather'));
app.use('/file/image', express.static(__dirname + '/assets/images'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('wa:connect', (data) => {
        console.log(data);
        waConnect(io, app, data);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

