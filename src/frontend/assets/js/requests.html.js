
function requestElem(data) {

    const container = $(document.createElement("div"));
    container.addClass("request");
    container.attr("data-req-id", data.reqId);

    const reqDate = new Date(data.date);
    const padNumber = a => String(a).padStart(2, "0");

    const time = $(document.createElement("span"));
    time.addClass("request-time");
    time.text(`${padNumber(reqDate.getHours())}:${padNumber(reqDate.getMinutes())}:${padNumber(reqDate.getSeconds())}`);
    container.append(time);

    const status = $(document.createElement("span"));
    status.addClass("request-status");
    status.text("...");
    container.append(status);

    const path = $(document.createElement("span"));
    path.addClass("request-path");
    path.text(data.path);
    container.append(path);

    const restime = $(document.createElement("span"));
    restime.addClass("request-restime");
    restime.text("waiting...");
    container.append(restime);

    const ip = $(document.createElement("span"));
    ip.addClass("request-ip");
    ip.text(data.ip);
    container.append(ip);


    if (data.approve) {
        const approveBtn = $(document.createElement("button"));
        approveBtn.addClass("request-approve");
        approveBtn.html("<i class=\"fas fa-check\"></i> Approve");
        container.append(approveBtn);

        approveBtn.on("click", () => {
            $.post(`/api/approve?reqId=${encodeURI(data.reqId)}`)
            .then(res => {
                if (res.success) {
                    approveBtn.remove();
                } else {
                    console.error(res.msg);
                }
            })
            .catch(console.error);
        });
    }

    return container;
}

function updateRequestElem(containerElem, data) {
    
    const restime = containerElem.children(".request-restime");
    restime.text(`${data.timeMs} ms`);

    const status = containerElem.children(".request-status");
    status.addClass(`status-${String(data.status).substr(0, 1)}xx`);
    status.text(data.status);

    containerElem.children(".request-approve").remove();

    return containerElem;
}

$.get({
    url: "/api/requests",
    cache: false
})
.then(requests => {
    if (requests.length) {
        $("#reqsMsg").hide();

        requests.forEach(req => {
            var reqElem = requestElem(req);
            if (req.finished) {
                reqElem = updateRequestElem(reqElem, req);
            }
    
            $("#reqs").append(reqElem);
        });
    
        $("#reqs").scrollTop($("#reqs").get(0).scrollHeight - $("#reqs").height());
    } else {
        $("#reqsMsg").show();
        $("#reqsMsg").removeClass("error");
        $("#reqsMsg").text("Waiting for requests...");
    }
})
.catch(err => {
    console.error(err);

    $("#reqsMsg").show();
    $("#reqsMsg").addClass("error");
    $("#reqsMsg").text("Couln't load requests");
});

ws.addEventListener("message", e => {
    const data = JSON.parse(e.data);

    if (data.type == "request") {

        $("#reqsMsg").hide();

        const reqElem = requestElem(data.payload);
        $("#reqs").append(reqElem);

        $("#reqs").scrollTop($("#reqs").get(0).scrollHeight - $("#reqs").height());

    } else if (data.type == "response") {

        const container = $(`.request[data-req-id=\"${data.payload.reqId}\"]`);
        if (container.length) {
            updateRequestElem(container, data.payload);
        }

        $("#reqs").scrollTop($("#reqs").get(0).scrollHeight - $("#reqs").height());

    }
});

ws.addEventListener("open", () => {
    ws.send(JSON.stringify({
        type: "subscribe",
        name: "requests"
    }));
});