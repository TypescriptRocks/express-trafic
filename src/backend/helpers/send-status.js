"use strict";
exports.__esModule = true;
var os_utils_1 = require("os-utils");
var lastSent = {};
function default_1(wss) {
    return setInterval(function () {
        os_utils_1.cpuUsage(function (percent) {
            var cpuUsage = Math.round(percent * 100);
            var memoryUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100;
            var payload = {};
            if (lastSent.cpuUsage != cpuUsage) {
                payload.cpuUsage = cpuUsage;
            }
            if (lastSent.memoryUsage != memoryUsage) {
                payload.memoryUsage = memoryUsage;
            }
            if (Object.keys(payload).length) {
                lastSent = Object.assign(lastSent, payload);
                var rawMsg_1 = JSON.stringify({
                    type: "status",
                    payload: payload
                });
                wss["subscriptions"]["status"].forEach(function (socket) { return socket.send(rawMsg_1); });
            }
        });
    }, 1000);
}
exports["default"] = default_1;
