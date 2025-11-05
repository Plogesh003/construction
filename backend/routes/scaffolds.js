const express = require('express');
const router = express.Router();
const Scaffold = require('../models/Scaffold');

// Get all scaffolds
router.get('/', async (req, res) => {
  try {
    const scaffolds = await Scaffold.find().populate('maintenanceHistory');
    res.json(scaffolds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a scaffold
router.post('/', async (req, res) => {
  try {
    const scaffold = new Scaffold(req.body);
    await scaffold.save();
    res.status(201).json(scaffold);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a scaffold
router.put('/:id', async (req, res) => {
  try {
    const scaffold = await Scaffold.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(scaffold);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a scaffold
router.delete('/:id', async (req, res) => {
  try {
    await Scaffold.findByIdAndDelete(req.params.id);
    res.json({ message: 'Scaffold deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
