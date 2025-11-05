const Project = require('../models/Project');

exports.linkScaffoldRentalToProject = async (req, res) => {
  try {
    const { siteId, orderId } = req.body;
    const project = new Project({ siteId, orderId });
    await project.save();
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
