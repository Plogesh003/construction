const ConstructionSite = require('../models/ConstructionSite');

// Create a new construction site
exports.createConstructionSite = async (req, res) => {
  try {
    const { id, name, location, startDate, endDate } = req.body;
    const constructionSite = new ConstructionSite({ id, name, location, startDate, endDate });
    await constructionSite.save();
    res.status(201).json(constructionSite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all construction sites
exports.getAllConstructionSites = async (req, res) => {
  try {
    const constructionSites = await ConstructionSite.find();
    res.json(constructionSites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
