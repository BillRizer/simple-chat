var socket;
var output = document.getElementById("chatbox");

document.getElementById("inputmessage")
    .addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            document.getElementById("sendmessage").click();
        }
    });

function enterChat() {
    socket = new WebSocket('ws://localhost:3000');

    var obj = JSON.stringify({
        name: document.getElementById('inputname').value
    })

    socket.onopen = function () {
        socket.send(obj);
        writeToScreen("agora voce esta conectado");

        document.getElementById('name-comp-form').style.display = "none";
        document.getElementById('chat-container').removeAttribute('class');
        document.getElementById('name-comp-text').innerText = 'Olá ' + document.getElementById('inputname').value;
    };

    socket.onmessage = function (e) {
        onMessage(e)
    };

    socket.onerror = function (e) {
        onError(e)
    };
}

function onMessage(e) {

    var obj = JSON.parse(e.data);
    if (obj.message === undefined) {
        writeToScreen('<span class="newuser"> ' + obj.name + ' entrou</span>');
    } else {
        writeToScreen('<span class="baloon" style="background-color: ' + obj.color + ';"> ' + obj.name + ' : ' +
            obj.message +
            '</span>');
    }
}

function onError(e) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + e.data);
}

function sendMessage() {
    var message = document.getElementById('inputmessage').value;
    socket.send(JSON.stringify({
        message: message
    }));
    document.getElementById('inputmessage').value = '';
}


var writeToScreen = function (message) {
    var pre = document.createElement("div");
    pre.className += ' linha';
    pre.innerHTML = message;
    output.appendChild(pre);
}