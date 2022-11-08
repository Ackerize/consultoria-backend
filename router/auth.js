/*
    path: api/login
*/
const { Router } = require("express");
const { check } = require("express-validator");

// Controladores
const { login, renewToken } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

// Login
router.post(
  "/login",
  [
    check("email", "El email debe de ser válido").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  login
);

// Revalidar Token
router.get("/renew", validarJWT, renewToken);

module.exports = router;
