const getHealthStatus = (req, res) => {
  res.status(200).send({
    status: "ok",
    message: "Los Chanchitos API is running",
  });
};

module.exports = {
  getHealthStatus,
};