const bcrypt = require("bcryptjs");

const { generarJWT } = require("../helpers/jwt");
const { searchByEmail } = require("../helpers/search_email");

// // login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, exists } = await searchByEmail(email);
    if (!exists) {
      return res.status(404).json({
        ok: false,
        msg: "Credeciales incorrectas",
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "Credeciales incorrectas",
      });
    }

    // Generar el JWT
    const token = await generarJWT(user._id);
    user.online = true;
    await user.save();
    res.status(200).json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Ocurrio un error interno",
      innerError: error,
    });
  }
};

// // renewToken
const renewToken = async (req, res) => {
  try {
    const uid = req.uid;
    const token = await generarJWT(uid);
    
    return res.status(200).json({
      ok: true,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Ocurrio un error interno",
      innerError: error,
    });
  }
};

module.exports = {
  login,
  renewToken,
};
