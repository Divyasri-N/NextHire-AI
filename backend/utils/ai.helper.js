const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── Shared call wrapper ──────────────────────────────────────────
const askAI = async (prompt, systemPrompt = '') => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt || 'You are an expert resume writer and career coach. Provide concise, professional, ATS-optimized content.',
  });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

// ── General AI generate (used by frontend aiApi.js) ──────────────
const generate = async ({ prompt, system }) => {
  return await askAI(prompt, system || 'You are an expert resume writer and career coach.');
};

// ── Generate professional summary ────────────────────────────────
const generateSummary = async ({ role, skills, experience }) => {
  const system = 'You are a professional resume writer. Generate concise, ATS-friendly resume summaries in 3-4 sentences.';
  const prompt = `Role: ${role}\nSkills: ${skills.join(', ')}\nExperience: ${experience} years\n\nWrite a professional summary for this resume.`;
  return await askAI(prompt, system);
};

// ── Suggest skills for a role ────────────────────────────────────
const suggestSkills = async ({ role, currentSkills }) => {
  const system = 'You are a tech career advisor. Return ONLY a JSON array of skill strings, no explanation, no markdown.';
  const prompt = `Role: ${role}\nCurrent skills: ${currentSkills.join(', ')}\n\nSuggest 10 additional relevant skills.`;
  const raw = await askAI(prompt, system);
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return raw.split(',').map(s => s.trim().replace(/["[\]]/g, ''));
  }
};

// ── Generate project description ─────────────────────────────────
const generateProjectDescription = async ({ title, techStack }) => {
  const system = 'You are a resume expert. Write impactful, ATS-friendly project descriptions in 2-3 bullet points using strong action verbs.';
  const prompt = `Project: ${title}\nTech Stack: ${techStack.join(', ')}\n\nWrite a resume project description.`;
  return await askAI(prompt, system);
};

// ── Enhance/rewrite a resume bullet ──────────────────────────────
const enhanceBullet = async ({ text }) => {
  const system = 'You are a resume coach. Rewrite weak resume statements into strong, quantified, ATS-friendly bullet points using action verbs.';
  const prompt = `Rewrite this resume statement:\n"${text}"`;
  return await askAI(prompt, system);
};

// ── Generate interview questions ──────────────────────────────────
const generateInterviewQuestions = async ({ role, type = 'technical' }) => {
  const system = 'You are an interview coach. Return ONLY a JSON array of question strings. No extra text, no markdown.';
  const prompt = `Role: ${role}\nType: ${type}\n\nGenerate 10 interview questions.`;
  const raw = await askAI(prompt, system);
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return raw.split('\n').filter(Boolean).map(q => q.replace(/^[\d\-\.\*]+\s*/, ''));
  }
};

// ── Generate cover letter ─────────────────────────────────────────
const generateCoverLetter = async ({ name, role, company, skills, experience }) => {
  const system = 'You are a professional cover letter writer. Write formal, compelling cover letters.';
  const prompt = `Name: ${name}\nApplying for: ${role} at ${company}\nSkills: ${skills.join(', ')}\nExperience: ${experience} years\n\nWrite a professional cover letter.`;
  return await askAI(prompt, system);
};

module.exports = {
  generate,
  generateSummary,
  suggestSkills,
  generateProjectDescription,
  enhanceBullet,
  generateInterviewQuestions,
  generateCoverLetter,
};