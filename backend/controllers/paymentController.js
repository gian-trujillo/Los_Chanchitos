const crypto = require("crypto");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const Order = require("../models/orderModel");

// Security note:
// The Mercado Pago access token must stay only in the backend.
// The frontend should never receive or store Mercado Pago secrets.
// When real card payments are enabled, payment status should be confirmed
// through Mercado Pago webhooks, not only through frontend redirects.

const parseMercadoPagoSignature = (signatureHeader) => {
  return String(signatureHeader || "")
    .split(",")
    .reduce((signatureParts, part) => {
      const [key, value] = part.split("=");

      if (key && value) {
        signatureParts[key.trim()] = value.trim();
      }

      return signatureParts;
    }, {});
};

const isMercadoPagoWebhookSignatureValid = ({ signatureHeader, requestId, dataId }) => {
  const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return false;
  }

  const { ts, v1 } = parseMercadoPagoSignature(signatureHeader);

  if (!ts || !v1 || !requestId || !dataId) {
    return false;
  }

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(manifest)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(v1)
    );
  } catch {
    return false;
  }
};

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

const handlePaymentWebhook = async (req, res, next) => {
  try {
    const signatureHeader = req.headers["x-signature"];
    const requestId = req.headers["x-request-id"];
    const dataId = req.query["data.id"] || req.body?.data?.id;

    if (!process.env.MERCADO_PAGO_WEBHOOK_SECRET) {
      return res.status(501).send({
        message: "Webhook de Mercado Pago pendiente de configuración.",
      });
    }

    const signatureIsValid = isMercadoPagoWebhookSignatureValid({
      signatureHeader,
      requestId,
      dataId,
    });

    if (!signatureIsValid) {
      return res.status(401).send({
        message: "Firma de webhook inválida.",
      });
    }

    // Later, when payments are enabled:
    // 1. Use dataId to request the payment details from Mercado Pago.
    // 2. Confirm the payment belongs to one of our orders.
    // 3. Update order.paymentStatus based on the trusted Mercado Pago response.
    // 4. Never trust frontend redirects alone for payment status.

    return res.status(200).send({
      received: true,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createPaymentPreference,
  handlePaymentWebhook,
};