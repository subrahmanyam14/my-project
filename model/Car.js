const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: {
    car_type: { type: String },
    company: { type: String },
    dealer: { type: String }
  },
  images: [String],
}, { timestamps: true });

CarSchema.index({ title: 'text', description: 'text', 'tags.car_type': 'text', 'tags.company': 'text', 'tags.dealer': 'text' }); // Updated for full-text search

module.exports = mongoose.model('Car', CarSchema);
