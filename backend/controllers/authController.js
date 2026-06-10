const jwt = require("jsonwebtoken");
const AdminUser = require("../models/adminUserModel");

const createToken = (adminUser) => {
  return jwt.sign(
    {
      id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "Correo y contraseña son requeridos",
      });
    }

    const adminUser = await AdminUser.findOne({
      email: email.toLowerCase(),
    }).select("+passwordHash");

    if (!adminUser) {
      return res.status(401).send({
        message: "Correo o contraseña incorrectos",
      });
    }

    const passwordIsCorrect = await adminUser.comparePassword(password);

    if (!passwordIsCorrect) {
      return res.status(401).send({
        message: "Correo o contraseña incorrectos",
      });
    }

    const token = createToken(adminUser);

    return res.status(200).send({
      token,
      admin: {
        id: adminUser._id,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getCurrentAdmin = async (req, res) => {
  res.status(200).send({
    admin: req.admin,
  });
};

module.exports = {
  loginAdmin,
  getCurrentAdmin,
};