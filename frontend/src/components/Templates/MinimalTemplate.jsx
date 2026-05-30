export default function MinimalTemplate({ resume }) {
  const { personal, education, experience, skills, projects, certifications } = resume;

  const s = (val) => val || "";

  return (
    <div id="resume-template" style={{
      fontFamily: "'DM Sans', 'Helvetica', sans-serif",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "40px 48px",
      color: "#1e293b",
      background: "#ffffff",
      minHeight: "1056px",
      fontSize: "13px",
      lineHeight: "1.6",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "24px", borderBottom: "2px solid #6366f1", paddingBottom: "16px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
          {s(personal.name) || "Your Name"}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", color: "#64748b", fontSize: "12px" }}>
          {personal.email && <span>✉ {personal.email}</span>}
          {personal.phone && <span>📱 {personal.phone}</span>}
          {personal.location && <span>📍 {personal.location}</span>}
          {personal.linkedin && <span>💼 {personal.linkedin}</span>}
          {personal.github && <span>💻 {personal.github}</span>}
          {personal.portfolio && <span>🌐 {personal.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <Section title="Professional Summary">
          <p style={{ color: "#475569" }}>{personal.summary}</p>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Work Experience">
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontWeight: "600", color: "#1e293b" }}>{exp.role}</span>
                  <span style={{ color: "#6366f1", marginLeft: "8px" }}>{exp.company}</span>
                </div>
                <span style={{ color: "#94a3b8", fontSize: "11px", flexShrink: 0 }}>
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.location && <div style={{ color: "#94a3b8", fontSize: "11px" }}>{exp.location}</div>}
              {exp.description && (
                <div style={{ color: "#475569", marginTop: "4px", whiteSpace: "pre-line" }}>{exp.description}</div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "600", color: "#1e293b" }}>{edu.school}</span>
                <span style={{ color: "#94a3b8", fontSize: "11px" }}>{edu.startYear} – {edu.endYear || "Present"}</span>
              </div>
              <div style={{ color: "#475569" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</div>
              {edu.gpa && <div style={{ color: "#94a3b8", fontSize: "11px" }}>GPA: {edu.gpa}</div>}
              {edu.activities && <div style={{ color: "#94a3b8", fontSize: "11px" }}>{edu.activities}</div>}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {(skills.technical?.length > 0 || skills.tools?.length > 0 || skills.soft?.length > 0) && (
        <Section title="Skills">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            {skills.technical?.length > 0 && (
              <SkillRow label="Technical" items={skills.technical} color="#e0eaff" textColor="#4f46e5" />
            )}
            {skills.tools?.length > 0 && (
              <SkillRow label="Tools" items={skills.tools} color="#dcfce7" textColor="#16a34a" />
            )}
            {skills.soft?.length > 0 && (
              <SkillRow label="Soft Skills" items={skills.soft} color="#fff7ed" textColor="#c2410c" />
            )}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "600", color: "#1e293b" }}>{proj.title}</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  {proj.github && <a href={proj.github} style={{ color: "#6366f1", fontSize: "11px" }}>GitHub</a>}
                  {proj.link && <a href={proj.link} style={{ color: "#6366f1", fontSize: "11px" }}>Live</a>}
                </div>
              </div>
              {proj.tech && <div style={{ color: "#94a3b8", fontSize: "11px", marginTop: "2px" }}>{proj.tech}</div>}
              {proj.description && <div style={{ color: "#475569", marginTop: "4px", whiteSpace: "pre-line" }}>{proj.description}</div>}
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="Certifications">
          {certifications.map((cert) => (
            <div key={cert.id} style={{ marginBottom: "8px" }}>
              <span style={{ fontWeight: "600", color: "#1e293b" }}>{cert.name}</span>
              {cert.issuer && <span style={{ color: "#64748b" }}> · {cert.issuer}</span>}
              {cert.year && <span style={{ color: "#94a3b8", fontSize: "11px" }}> ({cert.year})</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2 style={{
        fontSize: "12px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "1px",
        color: "#6366f1",
        marginBottom: "8px",
        borderBottom: "1px solid #e0eaff",
        paddingBottom: "4px",
      }}>{title}</h2>
      {children}
    </div>
  );
}

function SkillRow({ label, items, color, textColor }) {
  return (
    <div>
      <div style={{ color: "#64748b", fontSize: "11px", fontWeight: "600", marginBottom: "4px" }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {items.map(skill => (
          <span key={skill} style={{
            background: color, color: textColor,
            padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "500"
          }}>{skill}</span>
        ))}
      </div>
    </div>
  );
}