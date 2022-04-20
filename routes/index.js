const express = require('express');
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const uuid = require('uuid');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", upload.single('file'), async (req, res) => {
  return res.json([]);
});

module.exports = router;
