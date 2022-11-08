const { response } = require("express");
const bcrypt = require("bcryptjs");

const Consultor = require("../models/Consultor");
const { generarJWT } = require("../helpers/jwt");
const { searchByEmail } = require("../helpers/search_email");
const { diacriticSensitiveRegex } = require("../helpers/data-parse");

const register = async (req, res = response) => {
  try {
    const { email, password } = req.body;
    const { exists } = await searchByEmail(email);
    if (exists) {
      return res.status(409).json({
        ok: false,
        msg: "Ya existe un usuario con ese email",
      });
    }

    const consultor = new Consultor(req.body);
    const salt = bcrypt.genSaltSync();
    consultor.password = bcrypt.hashSync(password, salt);
    await consultor.save();
    const token = await generarJWT(consultor._id);

    return res.status(201).json({
      ok: true,
      user: consultor,
      token,
      type: "consultor",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Occurrió un error interno",
      innerError: error,
    });
  }
};

const searchByAreaOrName = async (req, res = response) => {
  try {
    const { term } = req.query;
    if (term.length < 3) {
      return res.status(400).json({
        ok: false,
        msg: "El término de búsqueda debe tener al menos 3 caracteres",
      });
    }
    const regex = new RegExp(diacriticSensitiveRegex(term), "i");
    const consultores = await Consultor.find({
      $or: [{ name: regex }, { areas: regex }],
    });
    return res.status(200).json({
      ok: true,
      consultores,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Occurrió un error interno",
      innerError: error,
    });
  }
};

const getAll = async (req, res = response) => {
  try {
    const perPage = Number(req.query.size) || 10;
    const page = req.query.page > 0 ? req.query.page : 0;

    const sortProperty = req.query.sortby || "createdAt";
    const sort = req.query.sort || "desc";

    const consultores = await Consultor.find({})
      .limit(perPage)
      .skip(perPage * page)
      .sort({ [sortProperty]: sort });

    return res.status(200).json({
      ok: true,
      consultores,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Occurrió un error interno",
      innerError: error,
    });
  }
};

module.exports = {
  register,
  searchByAreaOrName,
  getAll,
};
