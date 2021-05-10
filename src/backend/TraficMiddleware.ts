
import { createServer, Server as HTTPServer } from "http";
import * as express from "express";

import { version } from "../../package.json";
import { Server as WebSocketServer } from "ws";
import { join as joinPaths } from "path";

export class TraficMiddleware {

    private _httpServer: HTTPServer;
    private _express: express.Express;
    private _wss: WebSocketServer;

    public middleware: Function;

    constructor(options) {

        this._express = express();
        this._httpServer = createServer(this._express);

        this._express.use(express.static("src/frontend", {
            extensions: ["html"]
        }));

        this._httpServer.listen(options.port || 8192);

        this._wss = new WebSocketServer({
            server: this._httpServer,
            path: "/api/gateway"
        });

        this.middleware = function(req, res, next) {
            console.log(req.path);

            res.header("X-Protected-By", `express-trafic/${version}`);
            
            next();
        }
    }
}