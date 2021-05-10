
import { TraficMiddleware } from "./TraficMiddleware";
import { MiddlewareOptions } from "./types";

export function middleware(options?: MiddlewareOptions) {
    return new TraficMiddleware(options || {}).middleware;
}