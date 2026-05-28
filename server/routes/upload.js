const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: req.file.path });
});

module.exports = router;
