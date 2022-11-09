const { comprobarJWT } = require("../helpers/jwt");
const {
  connectUser,
  disconnectUser,
  getChats,
  saveMessage,
  getMessages,
} = require("../controllers/sockets");

class Sockets {
  constructor(io) {
    this.io = io;
    this.socketEvents();
    this.sockets = {};
  }

  socketEvents() {
    // On connection
    this.io.on("connection", async (socket) => {
      const [valido, uid] = comprobarJWT(socket.handshake.query["x-token"]);
      if (!valido) {
        console.log("socket no identificado");
        return socket.disconnect();
      }
      await connectUser(uid);
      this.sockets[uid] = socket.id;

      const users = await getChats(uid);

      users.forEach(async (user) => {
        this.io.to(this.sockets[user._id]).emit("lista-usuarios", await getChats(user._id));
      });
      
      socket.emit("lista-usuarios", users);
      
      socket.on("obtener-mensajes", async (payload) => {
        const messages = await getMessages(payload.from, payload.to);
        socket.emit("mensajes", messages);
      });

      socket.on("mensaje-personal", async (payload, callback) => {
        try {
          const mensaje = await saveMessage(payload);
          callback({
            ok: true,
            loading: false,
            msg: "Mensaje enviado exitosamente",
          });
          this.io.to(this.sockets[payload.to]).emit("mensaje-personal", mensaje);
          socket.emit("mensaje-personal", mensaje);
          // emit lista-usuarios
          socket.emit("lista-usuarios", await getChats(payload.from));
          this.io.to(this.sockets[payload.to]).emit("lista-usuarios", await getChats(payload.to));

        } catch (error) {
          console.log(error);
          callback({
            ok: false,
            loading: false,
            msg: "Error al enviar el mensaje",
          });
        }
      });

      socket.on("disconnect", async () => {
        try {
          await disconnectUser(uid);
          const users = await getChats(uid);
          users.forEach(async (user) => {
            this.io.to(this.sockets[user._id]).emit("lista-usuarios", await getChats(user._id));
          });
          console.log("user disconnected from: ", uid);
          delete this.sockets[uid];
        } catch (error) {
          console.log(error);
        }
      });
    });
  }
}

module.exports = Sockets;
