const User   = require('../models/User.model');
const Resume = require('../models/Resume.model');

// ── @route   GET /api/dashboard/stats ───────────────────────────
// User's own stats
exports.getUserStats = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }, 'title template atsScore atsHistory createdAt updatedAt');

    const stats = {
      totalResumes:    resumes.length,
      avgAtsScore:     0,
      bestAtsScore:    0,
      templateUsage:   {},
      atsHistory:      [],
      recentResumes:   resumes.slice(0, 5),
    };

    if (resumes.length > 0) {
      const scored       = resumes.filter(r => r.atsScore !== null);
      stats.avgAtsScore  = scored.length
        ? Math.round(scored.reduce((a, r) => a + r.atsScore, 0) / scored.length)
        : 0;
      stats.bestAtsScore = scored.length ? Math.max(...scored.map(r => r.atsScore)) : 0;

      resumes.forEach(r => {
        stats.templateUsage[r.template] = (stats.templateUsage[r.template] || 0) + 1;
      });

      stats.atsHistory = resumes
        .flatMap(r => r.atsHistory.map(h => ({ ...h.toObject(), resumeTitle: r.title })))
        .sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))
        .slice(0, 20);
    }

    res.status(200).json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   GET /api/dashboard/admin ───────────────────────────
// Admin-only: platform-wide stats
exports.getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalResumes, templateAgg] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      Resume.aggregate([{ $group: { _id: '$template', count: { $sum: 1 } } }]),
    ]);

    const templateUsage = {};
    templateAgg.forEach(t => { templateUsage[t._id] = t.count; });

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10).select('name email createdAt');

    res.status(200).json({
      success: true,
      stats: { totalUsers, totalResumes, templateUsage, recentUsers },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};