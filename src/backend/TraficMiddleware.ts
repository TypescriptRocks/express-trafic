
import { createServer, Server as HTTPServer } from "http";
import * as express from "express";
import { Server as WebSocketServer } from "ws";

import { randomBytes, randomInt } from "crypto";
 
import { version } from "../../package.json";
import { MiddlewareConfigOptions } from "./types";
import dashboardAuth from "./helpers/dashboard-auth";
import sendStatus from "./helpers/send-status";
import { Console } from "./Console";

export class TraficMiddleware {

    private _httpServer: HTTPServer;
    private _express: express.Express;
    private _wss: WebSocketServer;
    private _requestes;
    private _console;
    private _startupDate: Date;

    public middleware: Function;
    public console: Console;
    public config: MiddlewareConfigOptions;

    constructor(options) {

        this.config = Object.assign({
            approveMode: false,
            requestTimeout: 2000
        }, options.defaultConfig || {});

        this._requestes = [];
        this._console = [];
        this._startupDate = new Date();
        const approveCallbacks = {};

        this._express = express();
        this._httpServer = createServer(this._express);

        this._express.use((req, res, next) => dashboardAuth(options, req, res, next));

        this._express.get("/api/requests", (req, res) => {
            res.header("Cache-Control", "no-cache, no-store, must-revalidate");
            res.header("Pragma", "no-cache");
            res.header("Expires", "0");

            return res.json(this._requestes);
        });

        this._express.get("/api/console", (req, res) => {
            res.header("Cache-Control", "no-cache, no-store, must-revalidate");
            res.header("Pragma", "no-cache");
            res.header("Expires", "0");

            return res.json(this._console);
        });

        this._express.post("/api/approve", (req, res) => {
            const reqId: string = req.query.reqId as string;

            if (approveCallbacks.hasOwnProperty(reqId)) {
                approveCallbacks[reqId]();

                return res.status(200)
                .json({
                    success: true
                });
            } else {
                return res.status(400)
                .json({
                    msg: "no request with the given request id was found",
                    success: false
                });
            }
        });

        this._express.get("/api/uptime", (req, res) => {
            res.header("Cache-Control", "no-cache, no-store, must-revalidate");
            res.header("Pragma", "no-cache");
            res.header("Expires", "0");

            return res.json({
                date: this._startupDate.toISOString(),
                success: true
            });
        });

        this._express.use(express.static("src/frontend", { extensions: ["html"] }));

        this._httpServer.listen(options.port || 8192);

        this._wss = new WebSocketServer({
            server: this._httpServer,
            path: "/api/gateway"
        });
        sendStatus(this._wss);

        this._wss["subscriptions"] = {
            requests: [],
            console: [],
            status: []
        };

        this._wss.on("connection", socket => {
            socket.on("message", raw => {
                const data = JSON.parse(raw.toString());
                if (data.type == "ping") {
                    socket.send(JSON.stringify({
                        type: "pong"
                    }));
                } else if (data.type == "subscribe") {
                    if (this._wss["subscriptions"].hasOwnProperty(data.name)) {
                        this._wss["subscriptions"][data.name].push(socket);
                    }
                } else if (data.type == "console") {
                    this.console.exec(data.payload.content);
                }
            });

            socket.on("close", () => {
                Object.keys(this._wss["subscriptions"]).forEach(key => {
                    const index = this._wss["subscriptions"][key].findIndex(a => a == socket);
                    this._wss["subscriptions"][key].splice(index, 1);
                });
            });
        });

        this.middleware = (req, res, next) => {
            res.header("X-Protected-By", `express-trafic/${version}`);

            req.reqId = randomBytes(16).toString("hex");

            let timeStart;
            if (!this.config.approveMode) {
                timeStart = process.hrtime();
            }

            var ip = req.header("X-Forwared-For") || req.socket.remoteAddress;
            if (ip.substr(0, 7) == "::ffff:") {
                ip = ip.substr(7);
            }

            const reqDate = new Date();

            this._requestes.push({
                reqId: req.reqId,
                path: req.path,
                date: reqDate.toISOString(),
                ip,
                approve: this.config.approveMode,
                finished: false
            });
            const reqArrayIndex = this._requestes.length - 1;
            
            const reqMsg = JSON.stringify({
                type: "request",
                payload: {
                    reqId: req.reqId,
                    path: req.path,
                    date: reqDate.toISOString(),
                    ip,
                    approve: this.config.approveMode
                }
            });

            this._wss["subscriptions"]["requests"].forEach(socket => socket.send(reqMsg));

            res.on("finish", () => {

                const timeDiff = process.hrtime(timeStart);
                const timeMs = Math.round((timeDiff[0] * 1000000000 + timeDiff[1]) / 1000000);

                this._requestes.splice(
                    reqArrayIndex,
                    1,
                    Object.assign(this._requestes[reqArrayIndex], {
                        status: res.statusCode,
                        timeMs,
                        approve: false,
                        finished: true
                    })
                );

                const resMsg = JSON.stringify({
                    type: "response",
                    payload: {
                        reqId: req.reqId,
                        status: res.statusCode,
                        timeMs
                    }
                });

                this._wss["subscriptions"]["requests"].forEach(socket => socket.send(resMsg));
            });
            
            if (this.config.approveMode) {
                approveCallbacks[req.reqId] = function() {
                    timeStart = process.hrtime();
                    return next();
                }

                return;
            } else {
                return next();
            }
        }

        this.console = new Console(payload => {
            const rawMsg = JSON.stringify({
                type: "console",
                payload
            });

            this._console.push(payload);

            this._wss["subscriptions"]["console"].forEach(socket => socket.send(rawMsg));
        });
    }
}