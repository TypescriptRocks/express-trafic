"use strict";
exports.__esModule = true;
exports.TraficMiddleware = void 0;
var http_1 = require("http");
var express = require("express");
var ws_1 = require("ws");
var crypto_1 = require("crypto");
var package_json_1 = require("../../package.json");
var dashboard_auth_1 = require("./helpers/dashboard-auth");
var send_status_1 = require("./helpers/send-status");
var Console_1 = require("./Console");
var TraficMiddleware = /** @class */ (function () {
    function TraficMiddleware(options) {
        var _this = this;
        this.config = Object.assign({
            approveMode: false,
            requestTimeout: 2000
        }, options.defaultConfig || {});
        this._requestes = [];
        this._console = [];
        this._startupDate = new Date();
        var approveCallbacks = {};
        this._express = express();
        this._httpServer = http_1.createServer(this._express);
        this._express.use(function (req, res, next) { return dashboard_auth_1["default"](options, req, res, next); });
        this._express.get("/api/requests", function (req, res) {
            res.header("Cache-Control", "no-cache, no-store, must-revalidate");
            res.header("Pragma", "no-cache");
            res.header("Expires", "0");
            return res.json(_this._requestes);
        });
        this._express.get("/api/console", function (req, res) {
            res.header("Cache-Control", "no-cache, no-store, must-revalidate");
            res.header("Pragma", "no-cache");
            res.header("Expires", "0");
            return res.json(_this._console);
        });
        this._express.post("/api/approve", function (req, res) {
            var reqId = req.query.reqId;
            if (approveCallbacks.hasOwnProperty(reqId)) {
                approveCallbacks[reqId]();
                return res.status(200)
                    .json({
                    success: true
                });
            }
            else {
                return res.status(400)
                    .json({
                    msg: "no request with the given request id was found",
                    success: false
                });
            }
        });
        this._express.get("/api/uptime", function (req, res) {
            res.header("Cache-Control", "no-cache, no-store, must-revalidate");
            res.header("Pragma", "no-cache");
            res.header("Expires", "0");
            return res.json({
                date: _this._startupDate.toISOString(),
                success: true
            });
        });
        this._express.use(express.static("src/frontend", { extensions: ["html"] }));
        this._httpServer.listen(options.port || 8192);
        this._wss = new ws_1.Server({
            server: this._httpServer,
            path: "/api/gateway"
        });
        send_status_1["default"](this._wss);
        this._wss["subscriptions"] = {
            requests: [],
            console: [],
            status: []
        };
        this._wss.on("connection", function (socket) {
            socket.on("message", function (raw) {
                var data = JSON.parse(raw.toString());
                if (data.type == "ping") {
                    socket.send(JSON.stringify({
                        type: "pong"
                    }));
                }
                else if (data.type == "subscribe") {
                    if (_this._wss["subscriptions"].hasOwnProperty(data.name)) {
                        _this._wss["subscriptions"][data.name].push(socket);
                    }
                }
                else if (data.type == "console") {
                    _this.console.exec(data.payload.content);
                }
            });
            socket.on("close", function () {
                Object.keys(_this._wss["subscriptions"]).forEach(function (key) {
                    var index = _this._wss["subscriptions"][key].findIndex(function (a) { return a == socket; });
                    _this._wss["subscriptions"][key].splice(index, 1);
                });
            });
        });
        this.middleware = function (req, res, next) {
            res.header("X-Protected-By", "express-trafic/" + package_json_1.version);
            req.reqId = crypto_1.randomBytes(16).toString("hex");
            var timeStart;
            if (!_this.config.approveMode) {
                timeStart = process.hrtime();
            }
            var ip = req.header("X-Forwared-For") || req.socket.remoteAddress;
            if (ip.substr(0, 7) == "::ffff:") {
                ip = ip.substr(7);
            }
            var reqDate = new Date();
            _this._requestes.push({
                reqId: req.reqId,
                path: req.path,
                date: reqDate.toISOString(),
                ip: ip,
                approve: _this.config.approveMode,
                finished: false
            });
            var reqArrayIndex = _this._requestes.length - 1;
            var reqMsg = JSON.stringify({
                type: "request",
                payload: {
                    reqId: req.reqId,
                    path: req.path,
                    date: reqDate.toISOString(),
                    ip: ip,
                    approve: _this.config.approveMode
                }
            });
            _this._wss["subscriptions"]["requests"].forEach(function (socket) { return socket.send(reqMsg); });
            res.on("finish", function () {
                var timeDiff = process.hrtime(timeStart);
                var timeMs = Math.round((timeDiff[0] * 1000000000 + timeDiff[1]) / 1000000);
                _this._requestes.splice(reqArrayIndex, 1, Object.assign(_this._requestes[reqArrayIndex], {
                    status: res.statusCode,
                    timeMs: timeMs,
                    approve: false,
                    finished: true
                }));
                var resMsg = JSON.stringify({
                    type: "response",
                    payload: {
                        reqId: req.reqId,
                        status: res.statusCode,
                        timeMs: timeMs
                    }
                });
                _this._wss["subscriptions"]["requests"].forEach(function (socket) { return socket.send(resMsg); });
            });
            if (_this.config.approveMode) {
                approveCallbacks[req.reqId] = function () {
                    timeStart = process.hrtime();
                    return next();
                };
                return;
            }
            else {
                return next();
            }
        };
        this.console = new Console_1.Console(function (payload) {
            var rawMsg = JSON.stringify({
                type: "console",
                payload: payload
            });
            _this._console.push(payload);
            _this._wss["subscriptions"]["console"].forEach(function (socket) { return socket.send(rawMsg); });
        });
    }
    return TraficMiddleware;
}());
exports.TraficMiddleware = TraficMiddleware;
