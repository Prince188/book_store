const mongoose = require('mongoose');

const stockAlertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

stockAlertSchema.index({ book: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('StockAlert', stockAlertSchema);
