const ws = new WebSocket(`ws://localhost:443`);
// const ws = new WebSocket(`ws://${document.location.host}:443`); //use this if you're deploying to azure app service

ws.onopen = function () {
    console.log('Client connected!');
};

ws.onmessage = function (msg) {
    let message = JSON.parse(msg.data)
    document.getElementById('entriesList').innerHTML += `
    <li class="flex items-center lh-copy pa3 ph0-l bb b--black-10">  
<div class="pl3 flex-auto">
    <img class="w2 h2 w3-ns h3-ns br-100" src="${message.isCosmos ? 'cosmos' : 'mysql'}.svg" /> 
    <span class="f6 db black-70">${Date()}</span>
    <span class="f6 db black-90">${message.sender}</span>
    <span class="f6 db black-100">${message.message}</span>
  </div>
</li>`
};


let gb = {}

window.onload = function () {
    document.querySelector('#send').addEventListener('click', function () {
        gb.sender = document.querySelector("input[name='sender']").value
        gb.message = document.querySelector("input[name='message']").value
        gb.isCosmos = document.querySelector("#cosmos").checked ? true : false;
        if (ws.readyState !== WebSocket.CLOSED) {
            ws.send(JSON.stringify(gb));
        }
    });
}

function reloadEntries(html) {
    document.getElementById('entriesList').innerHTML = html
}