require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

const { PORT = 3000, FRONTEND_URL } = process.env;

connectDB();

app.use(helmet());

app.use(
  cors({
    origin: FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "production" ? 100 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      message: "Demasiadas solicitudes. Intenta de nuevo más tarde.",
    },
  })
);

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).send({
    message: "Ruta no encontrada",
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});