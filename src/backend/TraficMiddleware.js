"use strict";
exports.__esModule = true;
exports.TraficMiddleware = void 0;
var http_1 = require("http");
var express = require("express");
var package_json_1 = require("../../package.json");
var ws_1 = require("ws");
var TraficMiddleware = /** @class */ (function () {
    function TraficMiddleware(options) {
        this._express = express();
        this._httpServer = http_1.createServer(this._express);
        this._express.use(express.static("src/frontend", {
            extensions: ["html"]
        }));
        this._httpServer.listen(options.port || 8192);
        this._wss = new ws_1.Server({
            server: this._httpServer,
            path: "/api/gateway"
        });
        this.middleware = function (req, res, next) {
            console.log(req.path);
            res.header("X-Protected-By", "express-trafic/" + package_json_1.version);
            next();
        };
    }
    return TraficMiddleware;
}());
exports.TraficMiddleware = TraficMiddleware;
