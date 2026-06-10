const { MercadoPagoConfig, Preference } = require("mercadopago");
const Order = require("../models/orderModel");

// Security note:
// The Mercado Pago access token must stay only in the backend.
// The frontend should never receive or store Mercado Pago secrets.
// When real card payments are enabled, payment status should be confirmed
// through Mercado Pago webhooks, not only through frontend redirects.

const createPaymentPreference = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      return res.status(501).send({
        message:
          "Pago con tarjeta próximamente. Falta configurar Mercado Pago.",
      });
    }

    if (!orderId) {
      return res.status(400).send({
        message: "orderId es requerido.",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({
        message: "Pedido no encontrado.",
      });
    }

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    });

    const preference = new Preference(client);

    const preferenceResponse = await preference.create({
      body: {
        items: order.items.map((item) => ({
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: "MXN",
        })),
        external_reference: order.code,
        back_urls: {
          success: process.env.FRONTEND_SUCCESS_URL,
          failure: process.env.FRONTEND_FAILURE_URL,
          pending: process.env.FRONTEND_PENDING_URL,
        },
        metadata: {
          orderId: String(order._id),
          orderCode: order.code,
        },
      },
    });

    order.paymentMethod = "online";
    order.paymentStatus = "pending";
    order.paymentPreferenceId = preferenceResponse.id;
    order.paymentUrl = preferenceResponse.init_point || "";

    await order.save();

    return res.status(200).send({
      preferenceId: preferenceResponse.id,
      paymentUrl: preferenceResponse.init_point,
      order,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createPaymentPreference,
};