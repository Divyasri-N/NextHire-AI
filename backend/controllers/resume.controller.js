const crypto = require('crypto');
const Resume = require('../models/Resume.model');

// ── @route   GET /api/resumes ────────────────────────────────────
exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, count: resumes.length, resumes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   POST /api/resumes ───────────────────────────────────
exports.createResume = async (req, res) => {
  try {
    const resume = await Resume.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   GET /api/resumes/:id ───────────────────────────────
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });
    res.status(200).json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   PUT /api/resumes/:id ───────────────────────────────
exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });
    res.status(200).json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   DELETE /api/resumes/:id ────────────────────────────
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });
    res.status(200).json({ success: true, message: 'Resume deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   POST /api/resumes/:id/duplicate ─────────────────────
exports.duplicateResume = async (req, res) => {
  try {
    const original = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!original) return res.status(404).json({ success: false, message: 'Resume not found.' });

    const copy = original.toObject();
    delete copy._id;
    copy.title     = `${copy.title} (Copy)`;
    copy.createdAt = undefined;
    copy.updatedAt = undefined;

    const newResume = await Resume.create(copy);
    res.status(201).json({ success: true, resume: newResume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   POST /api/resumes/:id/share ─────────────────────────
exports.generateShareLink = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

    if (!resume.shareableSlug) {
      resume.shareableSlug = crypto.randomBytes(8).toString('hex');
    }
    resume.isPublic = true;
    await resume.save();

    const shareUrl = `${process.env.CLIENT_URL}/r/${resume.shareableSlug}`;
    res.status(200).json({ success: true, shareUrl, slug: resume.shareableSlug });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   GET /api/resumes/public/:slug ───────────────────────
exports.getPublicResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ shareableSlug: req.params.slug, isPublic: true });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found or not public.' });
    res.status(200).json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};