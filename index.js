require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');
const bodyParser = require('body-parser');

const waConnect = require('./wa-connect.js');

const APP_HOST = process.env.APP_HOST;
const APP_PORT = parseInt(process.env.APP_PORT);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/lib/js/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/lib/css/tubagus_css', express.static(__dirname + '/lib/css/tubagus_css'));
app.use('/lib/js/feather', express.static(__dirname + '/lib/js/feather'));
app.use('/file/image', express.static(__dirname + '/assets/images'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('wa:connect', (data) => {
        waConnect(io, app, data);
    });
});

server.listen(APP_PORT, APP_HOST, () => {
    console.log(`listening on ${APP_HOST}:${APP_PORT}`);
});

