const ai = require('../utils/ai.helper');

// ── @route   POST /api/interview/questions ───────────────────────
exports.generateQuestions = async (req, res) => {
  try {
    const { role, type = 'technical' } = req.body;
    if (!role) return res.status(400).json({ success: false, message: 'Role is required.' });

    const questions = await ai.generateInterviewQuestions({ role, type });
    res.status(200).json({ success: true, questions, role, type });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service error: ' + err.message });
  }
};

// ── @route   POST /api/interview/all ─────────────────────────────
// Generate all 3 types at once
exports.generateAllQuestions = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ success: false, message: 'Role is required.' });

    const [technical, hr, projectBased] = await Promise.all([
      ai.generateInterviewQuestions({ role, type: 'technical' }),
      ai.generateInterviewQuestions({ role, type: 'HR' }),
      ai.generateInterviewQuestions({ role, type: 'project-based' }),
    ]);

    res.status(200).json({ success: true, role, questions: { technical, hr, projectBased } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service error: ' + err.message });
  }
};