const Mensaje = require("../models/Mensaje");
const Cliente = require("../models/Cliente");
const Consultor = require("../models/Consultor");

const connectUser = async (uid) => {
  const cliente = await Cliente.findById(uid);
  if (!cliente) {
    const consultor = await Consultor.findById(uid);
    if (!consultor) {
      return false;
    }
    consultor.online = true;
    await consultor.save();
    return consultor;
  } else {
    cliente.online = true;
    await cliente.save();
    return cliente;
  }
};

const disconnectUser = async (uid) => {
  const cliente = await Cliente.findById(uid);
  if (!cliente) {
    const consultor = await Consultor.findById(uid);
    if (!consultor) {
      return false;
    }
    consultor.online = false;
    await consultor.save();
    return consultor;
  } else {
    cliente.online = false;
    await cliente.save();
    return cliente;
  }
};

const populateUsers = async (users) => {
  const promises = users.map(async (user) => {
    const cliente = await Cliente.findById(user.uid);
    if (!cliente) {
      const consultor = await Consultor.findById(user.uid);
      if (!consultor) {
        return false;
      }
      return {
        ...consultor.toObject(),
        lastMessage: user.lastMessage,
      };
    } else {
      return {
        ...cliente.toObject(),
        lastMessage: user.lastMessage,
      };
    }
  });
  const usersInfo = await Promise.all(promises);
  return usersInfo;
};

const getUsersFromMessages = async (messages, uid) => {
  const users = [];
  messages.forEach((message) => {
    if (!users.some((e) => e.uid == message.to) && message.to != uid) {
      users.push({
        uid: message.to,
        lastMessage: message,
      });
    } else if (
      !users.some((e) => e.uid == message.from) &&
      message.from != uid
    ) {
      users.push({
        uid: message.from,
        lastMessage: message,
      });
    }
  });
  const usersInfo = await populateUsers(users);
  return { usersInfo, users };
};

const getChats = async (uid) => {
  try {
    const messages = await Mensaje.find({
      $or: [{ from: uid }, { to: uid }],
    }).sort({ createdAt: "desc" });
    const { usersInfo } = await getUsersFromMessages(messages, uid);
    return usersInfo;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const saveMessage = async (payload) => {
  try {
    const message = new Mensaje(payload);
    await message.save();
    return message;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getMessages = async (from, to) => {
  try {
    const messages = await Mensaje.find({
      $or: [
        { from, to },
        { from: to, to: from },
      ],
    }).sort({ createdAt: "asc" });
    return messages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports = {
  connectUser,
  disconnectUser,
  getChats,
  saveMessage,
  getMessages,
};
