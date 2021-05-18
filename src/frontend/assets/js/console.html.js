
function escapeHTML(str) {
    return str.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#039;")
    .replace(/"/g, "&quot;");
}

function formatConsoleMsg(str) {
    return str

    // style
    .replace(/\x1b\[0m/g, a => `<span style="color: inherit; background: transparent;">${a.substr(5)}</span>`)
    .replace(/\x1b\[1m/g, a => `</span>${a.substr(5)}<span style="font-weight: 600;">`)
    .replace(/\x1b\[3m/g, a => `</span>${a.substr(5)}<span style="font-style: italic;">`)
    .replace(/\x1b\[4m/g, a => `</span>${a.substr(5)}<span style="text-decoration: underline;">`)
    .replace(/\x1b\[22m/g, a => `</span>${a.substr(5)}<span style="font-weight: unset;">`)
    .replace(/\x1b\[23m/g, a => `</span>${a.substr(5)}<span style="font-weight: unset;">`)
    .replace(/\x1b\[24m/g, a => `</span>${a.substr(5)}<span style="text-decoration: unset;">`)

    // fg
    .replace(/\x1b\[30m/g, a => `<span style="color: black;">${a.substr(5)}</span>`)
    .replace(/\x1b\[31m/g, a => `</span>${a.substr(5)}<span style="color: rgb(205, 49, 49);">`)
    .replace(/\x1b\[32m/g, a => `</span>${a.substr(5)}<span style="color: rgb(13, 188, 121);">`)
    .replace(/\x1b\[33m/g, a => `</span>${a.substr(5)}<span style="color: rgb(229, 229, 16);">`)
    .replace(/\x1b\[34m/g, a => `</span>${a.substr(5)}<span style="color: rgb(36, 114, 200);">`)
    .replace(/\x1b\[35m/g, a => `</span>${a.substr(5)}<span style="color: rgb(188, 63, 188);">`)
    .replace(/\x1b\[36m/g, a => `</span>${a.substr(5)}<span style="color: rgb(17, 168, 205);">`)
    .replace(/\x1b\[37m/g, a => `</span>${a.substr(5)}<span style="color: rgb(229, 229, 229);">`)
    .replace(/\x1b\[39m/g, a => `</span>${a.substr(5)}<span style="color: unset;">`)

    // bg
    .replace(/\x1b\[41m/g, a => `</span>${a.substr(5)}<span style="background: rgb(205, 49, 49);">`)
    .replace(/\x1b\[42m/g, a => `</span>${a.substr(5)}<span style="background: rgb(13, 188, 121);">`)
    .replace(/\x1b\[43m/g, a => `</span>${a.substr(5)}<span style="background: rgb(229, 229, 16);">`)
    .replace(/\x1b\[44m/g, a => `</span>${a.substr(5)}<span style="background: rgb(36, 114, 200);">`)
    .replace(/\x1b\[45m/g, a => `</span>${a.substr(5)}<span style="background: rgb(188, 63, 188);">`)
    .replace(/\x1b\[46m/g, a => `</span>${a.substr(5)}<span style="background: rgb(17, 168, 205);">`)
    .replace(/\x1b\[47m/g, a => `</span>${a.substr(5)}<span style="background: rgb(229, 229, 229);">`)
    .replace(/\x1b\[49m/g, a => `</span>${a.substr(5)}<span style="background: unset;">`)

    // bright fg
    .replace(/\x1b\[90m/g, a => `</span>${a.substr(5)}<span style="color: rgb(102, 102, 102);">`)
    .replace(/\x1b\[91m/g, a => `</span>${a.substr(5)}<span style="color: rgb(241, 76, 76);">`)
    .replace(/\x1b\[92m/g, a => `</span>${a.substr(5)}<span style="color: rgb(35, 209, 139);">`)
    .replace(/\x1b\[93m/g, a => `</span>${a.substr(5)}<span style="color: rgb(245, 245, 67);">`)
    .replace(/\x1b\[94m/g, a => `</span>${a.substr(5)}<span style="color: rgb(59, 142, 234);">`)
    .replace(/\x1b\[95m/g, a => `</span>${a.substr(5)}<span style="color: rgb(214, 112, 214);">`)
    .replace(/\x1b\[96m/g, a => `</span>${a.substr(5)}<span style="color: rgb(41, 184, 219);">`)
    .replace(/\x1b\[97m/g, a => `</span>${a.substr(5)}<span style="color: rgb(229, 229, 229);">`)
    
    // bright bg
    .replace(/\x1b\[100m/g, a => `</span>${a.substr(6)}<span style="background: rgb(102, 102, 102);">`)
    .replace(/\x1b\[101m/g, a => `</span>${a.substr(6)}<span style="background: rgb(241, 76, 76);">`)
    .replace(/\x1b\[102m/g, a => `</span>${a.substr(6)}<span style="background: rgb(35, 209, 139);">`)
    .replace(/\x1b\[103m/g, a => `</span>${a.substr(6)}<span style="background: rgb(245, 245, 67);">`)
    .replace(/\x1b\[104m/g, a => `</span>${a.substr(6)}<span style="background: rgb(59, 142, 234);">`)
    .replace(/\x1b\[105m/g, a => `</span>${a.substr(6)}<span style="background: rgb(214, 112, 214);">`)
    .replace(/\x1b\[106m/g, a => `</span>${a.substr(6)}<span style="background: rgb(41, 184, 219);">`)
    .replace(/\x1b\[107m/g, a => `</span>${a.substr(6)}<span style="background: rgb(229, 229, 229);">`)
}

function outmsgElem(data) {
    
    const date = new Date(data.date);
    const padNumber = a => String(a).padStart(2, "0");

    const outmsg = $(document.createElement("span"));
    outmsg.addClass("outmsg");
    outmsg.attr("data-time", `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}:${padNumber(date.getSeconds())}`);
    outmsg.html(formatConsoleMsg(escapeHTML(data.content)));

    return outmsg;
}

ws.addEventListener("message", e => {
    const data = JSON.parse(e.data);

    if (data.type == "console") {
        const msgElem = outmsgElem(data.payload);
        $("#output").append(msgElem);

        $("#output").scrollTop($("#output").get(0).scrollHeight - $("#output").height());
    }
});

ws.addEventListener("open", () => {
    ws.send(JSON.stringify({
        type: "subscribe",
        name: "console"
    }));
});

$.get({
    url: "/api/console",
    cache: false
})
.then(res => {
    res.forEach(msg => {
        const msgElem = outmsgElem(msg);
        $("#output").append(msgElem);
        
        $("#output").scrollTop($("#output").get(0).scrollHeight - $("#output").height());
    });
})
.catch(console.error);

$("#inputForm").on("submit", e => {
    ws.send(JSON.stringify({
        type: "console",
        payload: {
            type: "input",
            content: $("#inputCmd").val(),
            date: new Date().toISOString()
        }
    }));

    $("#inputCmd").val("");

    e.originalEvent.preventDefault();
});