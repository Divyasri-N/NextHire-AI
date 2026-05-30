const ai = require('../utils/ai.helper');

// ── @route   POST /api/ai/generate ──────────────────────────────
exports.generate = async (req, res) => {
  try {
    const { prompt, system } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: 'Prompt is required.' });
    const result = await ai.generate({ prompt, system });
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service error: ' + err.message });
  }
};

// ── @route   POST /api/ai/summary ────────────────────────────────
exports.generateSummary = async (req, res) => {
  try {
    const { role, skills, experience } = req.body;
    if (!role || !skills) return res.status(400).json({ success: false, message: 'Role and skills are required.' });
    const summary = await ai.generateSummary({ role, skills, experience: experience || 1 });
    res.status(200).json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service error: ' + err.message });
  }
};

// ── @route   POST /api/ai/skills ─────────────────────────────────
exports.suggestSkills = async (req, res) => {
  try {
    const { role, currentSkills = [] } = req.body;
    if (!role) return res.status(400).json({ success: false, message: 'Role is required.' });
    const skills = await ai.suggestSkills({ role, currentSkills });
    res.status(200).json({ success: true, skills });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service error: ' + err.message });
  }
};

// ── @route   POST /api/ai/project-description ────────────────────
exports.generateProjectDescription = async (req, res) => {
  try {
    const { title, techStack } = req.body;
    if (!title || !techStack) return res.status(400).json({ success: false, message: 'Project title and tech stack are required.' });
    const description = await ai.generateProjectDescription({ title, techStack });
    res.status(200).json({ success: true, description });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service error: ' + err.message });
  }
};

// ── @route   POST /api/ai/enhance ────────────────────────────────
exports.enhanceBullet = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text is required.' });
    const enhanced = await ai.enhanceBullet({ text });
    res.status(200).json({ success: true, enhanced });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service error: ' + err.message });
  }
};

// ── @route   POST /api/ai/cover-letter ───────────────────────────
exports.generateCoverLetter = async (req, res) => {
  try {
    const { name, role, company, skills, experience } = req.body;
    if (!role || !company) return res.status(400).json({ success: false, message: 'Role and company are required.' });
    const coverLetter = await ai.generateCoverLetter({ name, role, company, skills: skills || [], experience: experience || 1 });
    res.status(200).json({ success: true, coverLetter });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service error: ' + err.message });
  }
};