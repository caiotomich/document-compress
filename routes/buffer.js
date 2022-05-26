const express = require('express');
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const { exit } = require('process');
const PDFDocument = require('pdfkit');
const stream = require('./stream');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/buffer", upload.single('file'), async (req, res) => {
  const { buffer, originalname, size } = req.file;
  const uuid = uuidv4();

  localUStoreImage = './storage/uploads';
  localStorePdf = './storage/pdfs';

  await sharp(buffer)
  .jpeg({ quality: 40 })
  .resize({
    height: 1720,
    withoutEnlargement: true
  })
  .toFile(`${localUStoreImage}/output-${uuid}.jpeg`)
  .then(info => {
    const doc = new PDFDocument();
    let docStream = new stream.WritableBufferStream();

    doc.pipe(docStream);
    doc.image(`${localUStoreImage}/output-${uuid}.jpeg`, 10, 10, {
      fit: [doc.page.width - 20, doc.page.height - 20],
      align: 'center'
    });
    doc.end()

    info.formatImage = info.format
    info.format = 'pdf'
    info.compression = ((info.size / size) -1) * -100
  
    const buffer = {
      success: true,
      compress: info
    }

    docStream.on('finish', () => {
      buffer.data = docStream.toBuffer()
      return res.json(buffer)
    })
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
