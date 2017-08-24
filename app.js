/* eslint-env browser */
let socket;
const output = document.getElementById('chatbox');

const writeToScreen = (message) => {
  const pre = document.createElement('div');
  pre.className += ' linha';
  pre.innerHTML = message;
  output.appendChild(pre);
};

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
  if (obj.message === undefined) {
    writeToScreen(`<span class="newuser"> ${obj.name} entrou</span>`);
  } else {
    writeToScreen(`<span class="baloon" style="background-color: ${obj.color};"> ${obj.name} : ${
      obj.message
    }</span>`);
  }
};

const enterChat = () => {
  socket = new WebSocket('ws://localhost:3000');

  const obj = JSON.stringify({
    name: document.getElementById('inputname').value,
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
});

