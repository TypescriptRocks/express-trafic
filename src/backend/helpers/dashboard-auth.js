"use strict";
exports.__esModule = true;
var crypto_1 = require("crypto");
function matchAuthentication(authOptions, username, pwd) {
    if ((authOptions === null || authOptions === void 0 ? void 0 : authOptions.hashAlgorithm) && (authOptions === null || authOptions === void 0 ? void 0 : authOptions.hashAlgorithm) != "plain") {
        var hash = crypto_1.createHash(authOptions.hashAlgorithm)
            .update(pwd)
            .digest("hex");
        return authOptions.password === hash && authOptions.username === username;
    }
    else {
        return authOptions.password === pwd && authOptions.username === username;
    }
}
function default_1(options, req, res, next) {
    var _a, _b;
    var authOptions = options.dashboardAuth;
    if (authOptions.password && authOptions.username) {
        var decoded = (_b = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")) === null || _b === void 0 ? void 0 : _b[1];
        var _c = Buffer.from(decoded || "", "base64").toString().split(":"), username = _c[0], pwd = _c[1];
        if (username && pwd && matchAuthentication(options.dashboardAuth, username, pwd)) {
            return next();
        }
        else {
            res.setHeader("WWW-Authenticate", "Basic realm=\"Unauthorized\"");
            return res.status(401)
                .end("Authentication required.");
        }
    }
    else {
        return next();
    }
}
exports["default"] = default_1;
