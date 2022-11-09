// Servidor de Express
"use strict";
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const cors = require("cors");
const serverless = require("serverless-http");

const Sockets = require("./models/sockets");
const { dbConnection } = require("./database/config");

const app = express();
dbConnection();
const server = http.createServer(app);
const io = socketio(server, {});

app.use(cors());
app.use(express.static(path.resolve(__dirname, "../public")));
app.use(express.json());

// API End Points
app.use(
  "/.netlify/functions/server/api/v1/consultor",
  require("./router/consultor")
);
app.use(
  "/.netlify/functions/server/api/v1/cliente",
  require("./router/cliente")
);
app.use(
  "/.netlify/functions/server/api/v1/consultoria",
  require("./router/consultoria")
);
app.use("/.netlify/functions/server/api/v1/auth", require("./router/auth"));

// Sockets
new Sockets(io);

module.exports = server;
module.exports.handler = serverless(server);
