export default function CorporateTemplate({ resume }) {
  const { personal, education, experience, skills, projects, certifications } = resume;

  return (
    <div id="resume-template" style={{
      fontFamily: "'Georgia', serif",
      maxWidth: "800px",
      margin: "0 auto",
      background: "#ffffff",
      minHeight: "1056px",
      fontSize: "13px",
      lineHeight: "1.6",
      color: "#212121",
    }}>
      {/* Header band */}
      <div style={{ background: "#1e3a5f", color: "#ffffff", padding: "36px 48px 28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", letterSpacing: "1px", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
          {personal.name || "Your Name"}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "12px", color: "#cbd5e1" }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </div>

      <div style={{ padding: "32px 48px" }}>
        {/* Summary */}
        {personal.summary && (
          <div style={{ marginBottom: "20px", padding: "14px 16px", background: "#f0f4ff", borderLeft: "4px solid #1e3a5f", borderRadius: "0 8px 8px 0" }}>
            <p style={{ color: "#374151", fontStyle: "italic" }}>{personal.summary}</p>
          </div>
        )}

        {/* Two column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
          {/* Left */}
          <div>
            {experience.length > 0 && (
              <CorpSection title="Professional Experience">
                {experience.map(exp => (
                  <div key={exp.id} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px dotted #d1d5db", paddingBottom: "4px", marginBottom: "4px" }}>
                      <div>
                        <div style={{ fontWeight: "700", color: "#1e3a5f" }}>{exp.role}</div>
                        <div style={{ color: "#374151" }}>{exp.company}{exp.location ? ` | ${exp.location}` : ""}</div>
                      </div>
                      <div style={{ color: "#9ca3af", fontSize: "11px", flexShrink: 0 }}>
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </div>
                    </div>
                    {exp.description && <div style={{ color: "#4b5563", whiteSpace: "pre-line" }}>{exp.description}</div>}
                  </div>
                ))}
              </CorpSection>
            )}

            {projects.length > 0 && (
              <CorpSection title="Key Projects">
                {projects.map(proj => (
                  <div key={proj.id} style={{ marginBottom: "12px" }}>
                    <div style={{ fontWeight: "700", color: "#1e3a5f" }}>{proj.title} {proj.tech && <span style={{ fontWeight: "400", color: "#9ca3af" }}>({proj.tech})</span>}</div>
                    {proj.description && <div style={{ color: "#4b5563", whiteSpace: "pre-line" }}>{proj.description}</div>}
                  </div>
                ))}
              </CorpSection>
            )}
          </div>

          {/* Right */}
          <div>
            {education.length > 0 && (
              <CorpSection title="Education">
                {education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: "10px" }}>
                    <div style={{ fontWeight: "700", color: "#1e3a5f" }}>{edu.school}</div>
                    <div style={{ color: "#4b5563" }}>{edu.degree}{edu.field ? `, ${edu.field}` : ""}</div>
                    <div style={{ color: "#9ca3af", fontSize: "11px" }}>{edu.startYear} – {edu.endYear}</div>
                    {edu.gpa && <div style={{ color: "#9ca3af", fontSize: "11px" }}>GPA: {edu.gpa}</div>}
                  </div>
                ))}
              </CorpSection>
            )}

            {(skills.technical?.length > 0) && (
              <CorpSection title="Technical Skills">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {skills.technical.map(s => (
                    <span key={s} style={{ background: "#e8edf5", color: "#1e3a5f", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>{s}</span>
                  ))}
                </div>
              </CorpSection>
            )}

            {certifications.length > 0 && (
              <CorpSection title="Certifications">
                {certifications.map(cert => (
                  <div key={cert.id} style={{ marginBottom: "6px" }}>
                    <div style={{ fontWeight: "600", color: "#1e3a5f", fontSize: "12px" }}>{cert.name}</div>
                    {cert.issuer && <div style={{ color: "#9ca3af", fontSize: "11px" }}>{cert.issuer} {cert.year && `· ${cert.year}`}</div>}
                  </div>
                ))}
              </CorpSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CorpSection({ title, children }) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <h2 style={{
        fontSize: "13px", fontWeight: "700", textTransform: "uppercase",
        letterSpacing: "1.5px", color: "#1e3a5f", borderBottom: "2px solid #1e3a5f",
        paddingBottom: "4px", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif"
      }}>{title}</h2>
      {children}
    </div>
  );
}