const express = require('express');
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const { exit } = require('process');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/buffer", upload.single('file'), async (req, res) => {
  const { buffer, originalname, size } = req.file;

  await sharp(buffer)
  .webp({
      quality: 60
  })
  .resize({
    height: 1720,
    withoutEnlargement: true
  })
  .toBuffer({resolveWithObject: true})
  .then(async buffer => {
    buffer.success = true;
    buffer.info.oldSize = size;
    buffer.info.compress = ((buffer.info.size / size) -1) * -100;

    return res.json(buffer);
  })
  .catch(err => {
    console.log('Error:', err);

    return res.status(400).json({
      success: false,
      message: 'Invalid or corrupted image'
    });
  });
});

module.exports = router;
