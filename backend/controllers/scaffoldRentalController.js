const ScaffoldRentalOrder = require('../models/ScaffoldRentalOrder');

// Create a new scaffold rental order
exports.createScaffoldRentalOrder = async (req, res) => {
  try {
    const { order, site } = req.body;
    const scaffoldRentalOrder = new ScaffoldRentalOrder({ order, site });
    await scaffoldRentalOrder.save();
    res.status(201).json(scaffoldRentalOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all scaffold rental orders
exports.getAllScaffoldRentalOrders = async (req, res) => {
  try {
    const scaffoldRentalOrders = await ScaffoldRentalOrder.find();
    res.json(scaffoldRentalOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
