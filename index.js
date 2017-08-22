var ws = require('websocket').server;

var http = require('http');

var socket = new ws({
    httpServer: http.createServer().listen(3000)
});
var users={};
 

socket.on('request', function (req) {
    var conn = req.accept(null, req.origin);
    
    //criando chave de usuario
    users[req.key] = conn;
    
    conn.on('message', function (data) {
        var data = JSON.parse(data.utf8Data);
        
        if(data.message == undefined){
            //add nome ao usuario
            users[req.key].name = data.name;
            //ele entrou agora
            conn.send(buil_message(users[req.key].name),undefined);    
        }
        else{
            // conn.sendUTF(buil_message(users[req.key].name,data.message));    
            sendAll(buil_message(users[req.key].name,data.message))
        }
        console.log(users);
     });


    conn.on('close', function (connection) {
        console.log('close');
    });
});
function sendAll(obj) {
    for (var j of Object.keys(users)) {
        // Отправить сообщения всем, включая отправителя
         users[j].send(obj);
    }
}

function buil_message(name,message){
    return JSON.stringify({name:name,message:message});
}