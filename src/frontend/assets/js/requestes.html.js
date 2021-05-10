
const ws = new WebSocket(`ws://${location.host}/api/gateway`);

ws.addEventListener("message", e => {
    const data = JSON.parse(e.data);

    if (data.type == "request") {
        
    }
});