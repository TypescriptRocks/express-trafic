
function updateUptime(date) {
    const padNumber = a => String(a).padStart(2, "0");

    const diff = Math.round((Date.now() - date.getTime()) / 1000);

    const secs = diff % 60;
    const mins = Math.floor(diff % 3600 / 60);
    const hours = Math.floor(diff % 86400 / 3600);
    const days = Math.floor(diff / 86400);

    const sStr = padNumber(secs);
    const mStr = (hours ? padNumber(mins) : mins) + ":";
    const hStr = days ? padNumber(hours) + ":" : hours ? hours + ":" : "";
    const dStr = days ? days + ":" : "";

    $("#uptime").text(`${dStr}${hStr}${mStr}${sStr}`);
}

ws.addEventListener("message", e => {
    const data = JSON.parse(e.data);

    if (data.type == "status") {
        $("#cpuUsage").text(data.payload.cpuUsage);
        $("#memoryUsage").text(data.payload.memoryUsage);
    }
});

ws.addEventListener("open", () => {
    ws.send(JSON.stringify({
        type: "subscribe",
        name: "status"
    }));
});

$.get({
    url: "/api/uptime",
    cache: false
})
.then(res => {
    if (res.success) {

        const date = new Date(res.date);

        setInterval(updateUptime, 1000, date);
        updateUptime(date)

    } else {
        console.error(res.msg);
    }
})
.catch(console.error);