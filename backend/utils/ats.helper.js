// ── Industry keyword bank ────────────────────────────────────────
const KEYWORD_BANK = {
  frontend:  ['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Redux', 'REST API'],
  backend:   ['Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'REST', 'GraphQL', 'Microservices', 'JWT', 'SQL'],
  fullstack: ['React', 'Node.js', 'MongoDB', 'Express', 'REST API', 'Docker', 'Git', 'CI/CD', 'TypeScript', 'PostgreSQL'],
  devops:    ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Jenkins', 'Linux', 'Bash', 'Monitoring', 'Git'],
  data:      ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'SQL', 'TensorFlow', 'Data Analysis', 'Matplotlib', 'Jupyter', 'Scikit-learn'],
  general:   ['Communication', 'Teamwork', 'Problem Solving', 'Agile', 'Scrum', 'Git', 'Leadership', 'Time Management'],
};

// ── Compute ATS score ────────────────────────────────────────────
const computeATSScore = (resumeData, jobDescription = '') => {
  const results = {
    score:           0,
    breakdown:       {},
    missingKeywords: [],
    suggestions:     [],
  };

  let totalScore = 0;

  // 1. Contact info completeness (15 pts)
  const { personal = {} } = resumeData;
  const contactFields = ['fullName', 'email', 'phone', 'location', 'linkedin'];
  const filledContact = contactFields.filter(f => personal[f]?.trim()).length;
  const contactScore  = Math.round((filledContact / contactFields.length) * 15);
  results.breakdown.contactInfo = contactScore;
  totalScore += contactScore;

  // 2. Summary presence (10 pts)
  const summaryScore = personal.summary?.trim().length > 50 ? 10 : personal.summary?.trim().length > 0 ? 5 : 0;
  results.breakdown.summary = summaryScore;
  totalScore += summaryScore;

  // 3. Experience section (20 pts)
  const expScore = Math.min(resumeData.experience?.length * 5, 20);
  results.breakdown.experience = expScore;
  totalScore += expScore;

  // 4. Skills count (20 pts)
  const skillCount  = resumeData.skills?.length || 0;
  const skillsScore = skillCount >= 10 ? 20 : skillCount >= 6 ? 14 : skillCount >= 3 ? 8 : 0;
  results.breakdown.skills = skillsScore;
  totalScore += skillsScore;

  // 5. Education section (10 pts)
  const eduScore = (resumeData.education?.length || 0) > 0 ? 10 : 0;
  results.breakdown.education = eduScore;
  totalScore += eduScore;

  // 6. Projects section (10 pts)
  const projScore = Math.min((resumeData.projects?.length || 0) * 3, 10);
  results.breakdown.projects = projScore;
  totalScore += projScore;

  // 7. Job description keyword match (15 pts)
  if (jobDescription.trim()) {
    const resumeText   = JSON.stringify(resumeData).toLowerCase();
    const jdWords      = jobDescription.toLowerCase().match(/\b[a-zA-Z.#+]{2,}\b/g) || [];
    const uniqueJDWords= [...new Set(jdWords)];
    const matched      = uniqueJDWords.filter(w => resumeText.includes(w));
    const matchRatio   = matched.length / Math.max(uniqueJDWords.length, 1);
    const jdScore      = Math.round(matchRatio * 15);
    results.breakdown.jobDescriptionMatch = jdScore;
    totalScore += jdScore;

    // Missing keywords from JD
    results.missingKeywords = uniqueJDWords
      .filter(w => !resumeText.includes(w) && w.length > 4)
      .slice(0, 10);
  } else {
    results.breakdown.jobDescriptionMatch = 0;
  }

  results.score = Math.min(totalScore, 100);

  // ── Suggestions ──────────────────────────────────────────────
  if (!personal.summary) results.suggestions.push('Add a professional summary to increase visibility.');
  if (skillCount < 8)    results.suggestions.push('Add more relevant skills (aim for 8–12).');
  if (!resumeData.projects?.length) results.suggestions.push('Include at least 2–3 projects to showcase your work.');
  if (!personal.linkedin) results.suggestions.push('Add your LinkedIn URL to improve recruiter reach.');
  if (!resumeData.certifications?.length) results.suggestions.push('Add certifications to stand out in ATS filtering.');

  return results;
};

module.exports = { computeATSScore, KEYWORD_BANK };