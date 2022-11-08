const Consultor = require("../models/Consultor");
const Cliente = require("../models/Cliente");

const searchByEmail = async (email) => {
  const consultor = await Consultor.findOne({ email });
  const cliente = await Cliente.findOne({ email });
  return {
    exists: consultor || cliente,
    user: consultor ?? cliente,
  };
};

module.exports = {
  searchByEmail,
};
