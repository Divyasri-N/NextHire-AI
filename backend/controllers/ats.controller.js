const Resume = require('../models/Resume.model');
const { computeATSScore, KEYWORD_BANK } = require('../utils/ats.helper');

// ── @route   POST /api/ats/score ─────────────────────────────────
// Score a resume by ID (optionally pass jobDescription in body)
exports.scoreResume = async (req, res) => {
  try {
    const { resumeId, jobDescription = '' } = req.body;

    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

    const result = computeATSScore(resume.toObject(), jobDescription);

    // Save score and push to history
    resume.atsScore = result.score;
    resume.atsHistory.push({ score: result.score });
    await resume.save();

    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   POST /api/ats/score-raw ────────────────────────────
// Score raw resume data without saving (for live preview)
exports.scoreRaw = async (req, res) => {
  try {
    const { resumeData, jobDescription = '' } = req.body;
    if (!resumeData) return res.status(400).json({ success: false, message: 'Resume data is required.' });

    const result = computeATSScore(resumeData, jobDescription);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   GET /api/ats/keywords ───────────────────────────────
exports.getKeywordBank = async (req, res) => {
  res.status(200).json({ success: true, keywords: KEYWORD_BANK });
};

// ── @route   GET /api/ats/history/:resumeId ──────────────────────
exports.getATSHistory = async (req, res) => {
  try {
    const resume = await Resume.findOne(
      { _id: req.params.resumeId, user: req.user._id },
      'atsScore atsHistory title'
    );
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });
    res.status(200).json({ success: true, atsScore: resume.atsScore, history: resume.atsHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};