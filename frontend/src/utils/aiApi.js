import axios from "axios";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function callAI(prompt, systemPrompt = "") {
  const res = await axios.post(
    GROQ_URL,
    {
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt || "You are an expert resume writer and career coach. Provide concise, professional, ATS-optimized content." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data.choices[0].message.content.trim();
}

export async function generateSummary({ name, role, skills, experience }) {
  return callAI(
    `Write a compelling professional resume summary (3-4 sentences) for:
    Name: ${name}
    Target Role: ${role}
    Skills: ${skills.join(", ")}
    Experience: ${experience.map(e => `${e.role} at ${e.company}`).join(", ")}
    Requirements: ATS-friendly, action-oriented, quantified where possible, 50-80 words.`
  );
}

export async function suggestSkills(currentSkills, targetRole) {
  return callAI(
    `For a ${targetRole} role, suggest 10 technical skills to complement: ${currentSkills.join(", ")}
    Return ONLY a comma-separated list of skill names, nothing else.`
  );
}

export async function improveDescription(role, company, currentDesc) {
  return callAI(
    `Rewrite this experience description to be more impactful:
    Role: ${role} at ${company}
    Current: ${currentDesc}
    Requirements:
    - Use strong action verbs (Led, Built, Improved, Scaled, etc.)
    - Add metrics and quantifications
    - Make it ATS-optimized
    - Return 3-5 bullet points starting with •`
  );
}

export async function generateProjectDesc(title, tech) {
  return callAI(
    `Write 3 professional resume bullet points for this project:
    Title: ${title}
    Tech Stack: ${tech}
    Start each with • and use past tense. Focus on technical complexity, scale, and business impact.`
  );
}

export async function generateCoverLetter({ resume, jobTitle, company, jobDescription }) {
  return callAI(
    `Write a professional cover letter for:
    Applicant: ${resume.personal.name}
    Target Role: ${jobTitle} at ${company}
    Skills: ${resume.skills.technical?.join(", ")}
    Experience: ${resume.experience.map(e => `${e.role} at ${e.company}`).join(", ")}
    Job Description: ${jobDescription}
    Keep it 3 paragraphs, professional, enthusiastic, and tailored to the role.`
  );
}