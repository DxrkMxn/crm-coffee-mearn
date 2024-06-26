const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = require("../models/User");
const errorHandler = require("../utils/errorHandler");

/**
 * Iniciar sesión
 * @param req - solicitud
 * @param res - respuesta
 * @returns {Promise<void>}
 */
module.exports.login = async function (req, res) {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    const passwordResult = bcrypt.compareSync(
      req.body.password,
      candidate.password
    );
    if (passwordResult) {
      const token = jwt.sign(
        {
          email: candidate.email,
          userId: candidate._id,
        },
        keys.jwt,
        { expiresIn: 3600 * 24 * 30 }
      );
      res.status(200).json({
        token: `Bearer ${token}`,
      });
    } else {
      res.status(401).json({
        message: "Contraseña incorrecta.",
      });
    }
  } else {
    res.status(404).json({
      message: "Usuario no encontrado.",
    });
  }
};

/**
 * Registro de usuario
 * @param req - solicitud
 * @param res - respuesta
 * @returns {Promise<void>}
 */
module.exports.register = async function (req, res) {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    res.status(409).json({
      message: "Este usuario ya existe.",
    });
  } else {
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const user = new User({
      name: req.body.name,
      surname: req.body.surname,
      phone: req.body.phone,
      email: req.body.email,
      password: bcrypt.hashSync(password, salt),
      admin: Boolean(req.body.admin),
    });

    try {
      await user.save();
      res.status(201).json(user);
    } catch (e) {
      errorHandler(res, e);
    }
  }
};
