const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const Scaffold = require('../models/Scaffold');

// Log maintenance
router.post('/', async (req, res) => {
  try {
    const maintenance = new Maintenance(req.body);
    await maintenance.save();
    await Scaffold.findOneAndUpdate(
      { id: req.body.scaffoldId },
      { $push: { maintenanceHistory: maintenance._id }, lastMaintenance: new Date() }
    );
    res.status(201).json(maintenance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
