const RestaurantSettings = require("../models/restaurantSettingsModel");

const getRestaurantSettings = async (req, res, next) => {
  try {
    const settings = await RestaurantSettings.findOne();

    if (!settings) {
      return res.status(404).send({
        message: "Configuración no encontrada",
      });
    }

    return res.status(200).send(settings);
  } catch (error) {
    return next(error);
  }
};

const updateRestaurantSettings = async (req, res, next) => {
  try {
    const settings = await RestaurantSettings.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
      upsert: true,
    });

    return res.status(200).send(settings);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getRestaurantSettings,
  updateRestaurantSettings,
};