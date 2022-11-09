const { response } = require("express");

const Consultoria = require("../models/Consultoria");

const create = async (req, res = response) => {
  try {
    const consultoria = new Consultoria(req.body);
    await consultoria.save();

    return res.status(201).json({
      ok: true,
      consultoria,
      msg: "Solicitud creada exitosamente",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Occurrió un error interno",
      innerError: error,
    });
  }
};

const toggleStatus = async (req, res = response) => {
  try {
    const { id } = req.params;
    const consultoria = await Consultoria.findOneAndUpdate(
      { _id: id },
      { $set: { status: req.body.status } },
      { new: true }
    );

    return res.status(200).json({
      ok: true,
      msg: consultoria.status === "Aceptada" ? "Consultoría aceptada" : "Consultoría rechazada",
      consultoria,
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
    const sortProperty = req.query.sortby || "createdAt";
    const sort = req.query.sort || "desc";
    const filter = req.query.filter || "";

    const consultorias = await Consultoria.find({
      ...(filter === "all" ? {} : { status: filter }),
    }).sort({ [sortProperty]: sort });

    // populate consultor and cliente
    const consultoriasPopulated = await Consultoria.populate(consultorias, [
      { path: "consultor", select: "name" },
      { path: "cliente", select: "name" },
    ]);

    return res.status(200).json({
      ok: true,
      consultorias: consultoriasPopulated,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Occurrió un error interno",
      innerError: error,
    });
  }
};

const getAllByUser = async (req, res = response) => {
  try {
    const { userId } = req.query;
    const sortProperty = req.query.sortby || "createdAt";
    const sort = req.query.sort || "desc";
    const filter = req.query.filter || "all";
    const consultorias = await Consultoria.find({
      $or: [
        { consultor: userId, ...(filter === "all" ? {} : { status: filter }), },
        { cliente: userId, ...(filter === "all" ? {} : { status: filter }), },
      ],
    }).sort({ [sortProperty]: sort });
    const consultoriasPopulated = await Consultoria.populate(consultorias, [
      { path: "consultor", select: "name" },
      { path: "cliente", select: "name" },
    ]);

    return res.status(200).json({
      ok: true,
      consultorias: consultoriasPopulated,
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
  create,
  toggleStatus,
  getAll,
  getAllByUser,
};
