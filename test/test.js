
const express = require("express");
const app = express();
const server = require("http").createServer(app);

app.use(require("../src/backend/index").middleware({}));

app.get("/he", (req, res) => res.end("f"));

server.listen(8193);