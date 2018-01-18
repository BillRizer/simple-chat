/* eslint-env browser */

let socket;
const output = document.getElementById('chatbox');
var missedMensages = 0;

const writeToScreen = (message) => {
    const pre = document.createElement('div');
    pre.className += ' linha';
    pre.innerHTML = message;
    output.appendChild(pre);

    output.scrollTop = output.scrollHeight;

    if (document.hidden)
        updateUnreadMesages(++missedMensages);
};


const updateUnreadMesages = (missed) => {
    var tabTitle = document.hidden ? `Simple-chat (${missed})` : 'Simple-chat';
    document.title = tabTitle;
    if (!document.hidden)
        missedMensages = 0;
    else if (missedMensages > 0)
        soundAlert();


};

const soundAlert = () => {
    var audio = new Audio('mp3/FDP.mp3');
    audio.play();
};
//TODO
//se existir video dentro da mensagem ele add html para video
const replaceIfExistVideoInside = (message) => {
    console.log(message);
    var er = /<a.+href="(.+((youtube.com|youtu.be)\/(embed|watch)(\?v=|\/)(.+)))".+<\/a>/;

    var obj = message.match(er);

    if (obj != null) {
        //obj[6] = id do video
        var res = message.replace(er, '<object width="280" height="210" data="http://www.youtube.com/embed/' + obj[6] + '"></object>');
    } else {
        res = message;
    }
    return res;
}



const sendMessage = () => {
    const message = document.getElementById('inputmessage').value;
    socket.send(JSON.stringify({
        message,
    }));
    document.getElementById('inputmessage').value = '';
};

const onError = (e) => {
    writeToScreen(`<span style="color: red;">ERROR:</span> ${e.data}`);
};

const onMessage = (e) => {
    const obj = JSON.parse(e.data);

    console.log(obj);

    if (obj.type == 'status') {
        writeToScreen(`<span class="newuser"> ${obj.name} entrou</span>`);
    } else {
        obj.message = replaceIfExistVideoInside(obj.message);

        writeToScreen(`<span class="baloon" style="background-color: ${obj.color};">
  ${obj.name} : ${obj.message}</span>`);
    }
};

const enterChat = () => {
    socket = new WebSocket('ws://' + window.location.host + ':3000');

    const obj = JSON.stringify({
        name: document.getElementById('inputname').value,
        type: 'status'
    });

    socket.onopen = () => {
        socket.send(obj);
        writeToScreen('agora voce esta conectado');

        document.getElementById('name-comp-form').style.display = 'none';
        document.getElementById('chat-container').removeAttribute('class');
        document.getElementById('name-comp-text').innerText = `Olá ${document.getElementById('inputname').value}`;
    };

    socket.onmessage = (e) => {
        onMessage(e);
    };

    socket.onerror = (e) => {
        onError(e);
    };
};

document.addEventListener('visibilitychange', function(e) {
    updateUnreadMesages(missedMensages);
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('js-enter-chat')
        .addEventListener('click', () => {
            enterChat();
        });


    document.getElementById('inputmessage')
        .addEventListener('keyup', (event) => {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById('sendmessage').click();
            }
        });

    document.getElementById('sendmessage')
        .addEventListener('click', () => {
            sendMessage();
        });

    $('#emojis-box span').click(function() {
        $('#inputmessage').val($('#inputmessage').val() + ' ' + $(this).text() + ' ');
    })

});