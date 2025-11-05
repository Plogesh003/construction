const mongoose = require('mongoose');

const ScaffoldSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  totalQty: { type: Number, default: 0 },
  availableQty: { type: Number, default: 0 },
  damagedQty: { type: Number, default: 0 },
  location: { type: String, default: '' },
  condition: { type: String, default: 'Good' },
  lastMaintenance: { type: Date, default: Date.now },
  maintenanceHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Maintenance' }]
}, { timestamps: true });

module.exports = mongoose.model('Scaffold', ScaffoldSchema);
