const randomColor = require('randomcolor');
const Ws = require('websocket').server;

const http = require('http');

const socket = new Ws({
  httpServer: http.createServer().listen(3000),
});
const users = {};

function buildMessage(color, name, message) {
  return JSON.stringify({ name, message, color });
}

function sendAll(obj) {
  Object.keys(users).forEach(key => users[key].send(obj));
//   for (const j of Object.keys(users)) {
//     // Отправить сообщения всем, включая отправителя
//     users[j].send(obj);
//   }
}

socket.on('request', (req) => {
  const conn = req.accept(null, req.origin);

  // criando chave de usuario
  users[req.key] = conn;
  users[req.key].color = randomColor({ hue: 'random', luminosity: 'random', format: 'rgba', alpha: 0.5 });

  conn.on('message', (data) => {
    const parsedData = JSON.parse(data.utf8Data);

    if (parsedData.message === undefined) {
      // add nome ao usuario
      users[req.key].name = parsedData.name;
      // ele entrou agora
      sendAll(buildMessage(users[req.key].color, users[req.key].name), undefined);
    } else {
      // conn.sendUTF(buildMessage(users[req.key].name,parsedData.message));
      sendAll(buildMessage(users[req.key].color, users[req.key].name, parsedData.message));
    }
    // console.log(users);
  });


  conn.on('close', () => {
    // console.log('close');
  });
});

