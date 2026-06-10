const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

const server = http.createServer(app);

const { PORT = 3000, FRONTEND_URL } = process.env;

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("order:join", (orderCode) => {
    if (!orderCode) {
      return;
    }

    const normalizedOrderCode = String(orderCode).trim().toUpperCase();

    socket.join(`order:${normalizedOrderCode}`);
  });

  socket.on("order:leave", (orderCode) => {
    if (!orderCode) {
      return;
    }

    const normalizedOrderCode = String(orderCode).trim().toUpperCase();

    socket.leave(`order:${normalizedOrderCode}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});


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

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});