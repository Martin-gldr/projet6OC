const sharp = require('sharp')

module.exports = async (req, res, next) => {
    const { buffer, originalname } = req.file;
    const timestamp = new Date().toISOString();
    const ref = `${timestamp}-${originalname}.webp`;
    await sharp(buffer)
      .webp({ quality: 80 })
      .resize( {
        width: 450,
        height: 600,
        fit: sharp.fit.cover})
      .toFile("./images/" + ref);
    req.file.filename = ref

    next()}

