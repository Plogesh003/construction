const mongoose = require('mongoose');

const ScaffoldRentalOrderSchema = new mongoose.Schema({
  order: { type: String, required: true, unique: true },
  site: { type: String, required: true },
});

module.exports = mongoose.model('ScaffoldRentalOrder', ScaffoldRentalOrderSchema);
