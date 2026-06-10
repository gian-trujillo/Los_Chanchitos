const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res, next) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(501).send({
        message: "Carga de imágenes próximamente. Falta configurar Cloudinary.",
      });
    }

    if (!req.file) {
      return res.status(400).send({
        message: "No se recibió ninguna imagen.",
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "los-chanchitos/menu",
          resource_type: "image",
          transformation: [
            {
              width: 1200,
              height: 900,
              crop: "limit",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    return res.status(201).send({
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  uploadImage,
};