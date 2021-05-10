
import { Express } from "express";

export interface MiddlewareOptions {
    server?: Express
    path?: string,
    port?: number,
    defualtConfig?: {
        approveMode?: boolean
    }
}