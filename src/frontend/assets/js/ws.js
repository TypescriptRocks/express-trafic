
const ws = new WebSocket(`ws://${location.host}/api/gateway`);

setInterval(() => {
    ws.send(JSON.stringify({
        type: "ping"
    }));
}, 16000);

ws.addEventListener("error", e => console.error(e));