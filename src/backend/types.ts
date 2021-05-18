
export interface MiddlewareConfigOptions {
    approveMode?: boolean,
    requestTimeout?: number
}

interface dashboardAuth {
    hashAlgorithm?: "plain" | "sha1" | "sha256" | "sha512",
    username: string,
    password: string
}

export interface MiddlewareOptions {
    path?: string,
    port?: number,
    defaultConfig?: MiddlewareConfigOptions,
    dashboardAuth?: dashboardAuth
}

export interface statusPayload {
    cpuUsage?: number,
    memoryUsage?: number
}

export interface wssSubscriptions {
    status?: any[]
}