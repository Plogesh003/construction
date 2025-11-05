const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  scaffoldId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, required: true },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
