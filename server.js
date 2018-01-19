const randomColor = require('randomcolor');
const Ws = require('websocket').server;

const http = require('http');

const anchorme = require("anchorme").default;


const socket = new Ws({
    httpServer: http.createServer().listen(3000),
});
const users = {};

function buildMessage(type, color, name, message) {
    var onlineUsers = getUsers();
    console.log(JSON.stringify({ type, name, message, color, onlineUsers }));
    return JSON.stringify({ type, name, message, color, onlineUsers });
}

function getUsers() {
    var onlineUsers = [];
    Object.keys(users).forEach(key => onlineUsers.push(users[key].name));
    return onlineUsers;
}

function buildUsers(userDisconnected) {
    var onlineUsers = getUsers();
    return JSON.stringify({ onlineUsers, type: "onlineUsers", userDisconnected: userDisconnected });
}

function sendAll(obj) {
    Object.keys(users).forEach(key => users[key].send(obj));
}

socket.on('request', (req) => {
    const conn = req.accept(null, req.origin);

    conn.on('message', (data) => {

        const parsedData = JSON.parse(data.utf8Data);

        // criando chave de usuario
        users[req.key] = conn;
        users[req.key].id = req.key;

        if (parsedData.type == 'status') {
            users[req.key].name = parsedData.name;
        }

        if (users[req.key].color == undefined)
            users[req.key].color = randomColor({ hue: 'random', luminosity: 'random', format: 'rgba', alpha: 0.5 });


        //caso exista link na mensagem ele vai com o <a>
        var message = undefined;
        if (parsedData.message != undefined) {
            message = anchorme(parsedData.message);
        }



        sendAll(buildMessage(parsedData.type, users[req.key].color, users[req.key].name, message));

    });

    conn.on('close', function(code, reason) {

        console.log(conn.id + ' disconnected');
        let name = users[conn.id].name;
        delete users[conn.id];
        sendAll(buildUsers(name));
    });

});