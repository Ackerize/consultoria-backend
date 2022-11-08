// Servidor de Express
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const cors = require("cors");

const Sockets = require("./sockets");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    dbConnection();
    this.server = http.createServer(this.app);
    this.io = socketio(this.server, {});
  }

  middlewares() {
    this.app.use(express.static(path.resolve(__dirname, "../public")));
    this.app.use(cors());
    this.app.use(express.json());

    // API End Points
    this.app.use("/api/v1/consultor", require("../router/consultor"));
    this.app.use("/api/v1/cliente", require("../router/cliente"));
    this.app.use("/api/v1/consultoria", require("../router/consultoria"));
    this.app.use("/api/v1/auth", require("../router/auth"));
  }

  configurarSockets() {
    new Sockets(this.io);
  }

  execute() {
    this.middlewares();
    this.configurarSockets();
    this.server.listen(this.port, () => {
      console.log("Server corriendo en puerto:", this.port);
    });
  }
}

module.exports = Server;
