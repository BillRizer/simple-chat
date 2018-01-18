const randomColor = require('randomcolor');
const Ws = require('websocket').server;

const http = require('http');

const anchorme = require("anchorme").default;


const socket = new Ws({
  httpServer: http.createServer().listen(3000),
});
const users = {};

function buildMessage(type,color, name, message) {
  console.log(JSON.stringify({type,name, message, color}));
  return JSON.stringify({type,name, message, color});
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
    
    //caso exista link na mensagem ele vai com o <a>
    var message=undefined;
    if(parsedData.message!=undefined){
       message = anchorme(parsedData.message);
    }

    if(parsedData.type=='status'){
      users[req.key].name = parsedData.name;
    }
    
    sendAll(buildMessage(parsedData.type,users[req.key].color, users[req.key].name,message));


    // console.log(users);
  });

  conn.on('close', function (code, reason) {
    console.log(conn.user_id + ' disconnected');
    delete users[conn.user_id];
  });
  // conn.on('close', () => {
  //   // console.log('close');
  // });
});

