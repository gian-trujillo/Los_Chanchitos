const jwt = require("jsonwebtoken");
const AdminUser = require("../models/adminUserModel");

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).send({
        message: "Autorización requerida",
      });
    }

    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const adminUser = await AdminUser.findById(payload.id);

    if (!adminUser) {
      return res.status(401).send({
        message: "Token inválido",
      });
    }

    req.admin = {
      id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role,
    };

    return next();
  } catch (error) {
    console.error(error)
    return res.status(401).send({
      message: "Token inválido o expirado",
    });
  }
};

module.exports = auth;