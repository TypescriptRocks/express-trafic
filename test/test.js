
const express = require("express");
const app = express();
const server = require("http").createServer(app);

const chalk = require("chalk");

const expressTrafic = require("../src/backend/index");

const { Server } = require("ws");
const ws = new Server({
    server,
    path: "/asdfgh"
});

const traficMiddleware = expressTrafic.middleware({
    dashboardAuth: {
        hashAlgorithm: "sha1",
        username: "hide",
        password: "e9d71f5ee7c92d6dc9e92ffdad17b8bd49418f98"
    },
    defaultConfig: {
        approveMode: false
    }
});

app.use(traficMiddleware.middleware);

const { console } = traficMiddleware;

console.log("compile 4 gods sake");
console.info("compile 4 gods sake");
console.warn("compile 4 gods sake");
console.error("compile 4 gods sake");

console.log(chalk.bold("hey", chalk.redBright("nice", chalk.whiteBright(chalk.bgGreen("nice sync")))), chalk.underline("hi"));

console.on("command", console.info)

app.get("/he", (req, res) => res.end("f"));

app.get("/herh", (req, res) => {
    setTimeout(() => {
        res.end("ok");
        console.log("hey", "im cool")
    }, 2000);
});

server.listen(8193);