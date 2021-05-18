
import { cpuUsage } from "os-utils";

import { statusPayload } from "../types";

let lastSent: statusPayload = {};

export default function(wss) {
    return setInterval(() => {
        
        cpuUsage((percent) => {

            const cpuUsage = Math.round(percent * 100);
            const memoryUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100;

            const payload: statusPayload = {};

            if (lastSent.cpuUsage != cpuUsage) { payload.cpuUsage = cpuUsage; }
            if (lastSent.memoryUsage != memoryUsage) { payload.memoryUsage = memoryUsage; }

            if (Object.keys(payload).length) {
                lastSent = Object.assign(lastSent, payload);
    
                const rawMsg = JSON.stringify({
                    type: "status",
                    payload
                });

                wss["subscriptions"]["status"].forEach(socket => socket.send(rawMsg));
            }

        });

    }, 1000);
}