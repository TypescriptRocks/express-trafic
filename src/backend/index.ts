
import { Console } from "./Console";
import { TraficMiddleware } from "./TraficMiddleware";
import { MiddlewareOptions } from "./types";

function middleware(options?: MiddlewareOptions) {
    return new TraficMiddleware(options || {});
}

export {
    middleware,
    Console
}