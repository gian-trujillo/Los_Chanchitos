const errorHandler = (err, req, res, next) => {
  void next;

  console.error(err);

  if (err.code === 11000) {
    return res.status(409).send({
      message: "Ya existe un documento con ese identificador.",
      fields: err.keyValue,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).send({
      message: "Error de validación",
      errors: Object.values(err.errors).map((error) => error.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).send({
      message: "ID inválido",
    });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Error en el servidor" : err.message;

  return res.status(statusCode).send({
    message,
  });
};

module.exports = errorHandler;