
import { createHash } from "crypto";

function matchAuthentication(authOptions, username, pwd) {
    if (authOptions?.hashAlgorithm && authOptions?.hashAlgorithm != "plain") {
        const hash = createHash(authOptions.hashAlgorithm)
        .update(pwd)
        .digest("hex");

        return authOptions.password === hash && authOptions.username === username;
    } else {
        return authOptions.password === pwd && authOptions.username === username;
    }

}

export default function(options, req, res, next) {
    const authOptions = options.dashboardAuth;
    if (authOptions.password && authOptions.username) {
        const decoded = req.header("Authorization")?.split(" ")?.[1];
        const [ username, pwd ] = Buffer.from(decoded || "", "base64").toString().split(":");
    
        if (username && pwd && matchAuthentication(options.dashboardAuth, username, pwd)) {
            return next();
        } else {
            res.setHeader("WWW-Authenticate", "Basic realm=\"Unauthorized\"");
    
            return res.status(401)
            .end("Authentication required.");
        }
    } else {
        return next();
    }
}