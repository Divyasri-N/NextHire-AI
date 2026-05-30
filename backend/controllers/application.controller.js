const Application = require('../models/Application.model');

// @route  GET /api/applications
exports.getAll = async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, applications: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  POST /api/applications
exports.create = async (req, res) => {
  try {
    const { company, role, status, date, notes, jobUrl, salary } = req.body;
    if (!company || !role) return res.status(400).json({ success: false, message: 'Company and role are required.' });
    const app = await Application.create({ user: req.user._id, company, role, status, date, notes, jobUrl, salary });
    res.status(201).json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PUT /api/applications/:id
exports.update = async (req, res) => {
  try {
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });
    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  DELETE /api/applications/:id
exports.remove = async (req, res) => {
  try {
    const app = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });
    res.json({ success: true, message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};