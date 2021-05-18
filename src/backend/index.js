"use strict";
exports.__esModule = true;
exports.Console = exports.middleware = void 0;
var Console_1 = require("./Console");
exports.Console = Console_1.Console;
var TraficMiddleware_1 = require("./TraficMiddleware");
function middleware(options) {
    return new TraficMiddleware_1.TraficMiddleware(options || {});
}
exports.middleware = middleware;
