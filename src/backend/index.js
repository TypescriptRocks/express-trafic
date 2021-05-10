"use strict";
exports.__esModule = true;
exports.middleware = void 0;
var TraficMiddleware_1 = require("./TraficMiddleware");
function middleware(options) {
    return new TraficMiddleware_1.TraficMiddleware(options || {}).middleware;
}
exports.middleware = middleware;
