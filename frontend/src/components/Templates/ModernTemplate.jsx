export default function ModernTemplate({ resume }) {
  const { personal, education, experience, skills, projects, certifications } = resume;

  return (
    <div id="resume-template" style={{
      fontFamily: "'DM Sans', 'Helvetica', sans-serif",
      maxWidth: "800px", margin: "0 auto",
      background: "#0f172a", color: "#e2e8f0",
      minHeight: "1056px", fontSize: "12.5px", lineHeight: "1.7",
      display: "grid", gridTemplateColumns: "220px 1fr",
    }}>
      {/* Left sidebar */}
      <div style={{ background: "#1e293b", padding: "32px 24px" }}>
        {/* Avatar */}
        <div style={{ width: "72px", height: "72px", background: "#6366f1", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "700", color: "#fff", marginBottom: "16px" }}>
          {(personal.name || "?")[0].toUpperCase()}
        </div>
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#f1f5f9", marginBottom: "4px", lineHeight: "1.2" }}>{personal.name || "Your Name"}</h1>

        <div style={{ marginTop: "20px" }}>
          <SideLabel>Contact</SideLabel>
          {personal.email && <SideInfo icon="✉" val={personal.email} />}
          {personal.phone && <SideInfo icon="📱" val={personal.phone} />}
          {personal.location && <SideInfo icon="📍" val={personal.location} />}
          {personal.linkedin && <SideInfo icon="💼" val={personal.linkedin} />}
          {personal.github && <SideInfo icon="💻" val={personal.github} />}
        </div>

        {(skills.technical?.length > 0) && (
          <div style={{ marginTop: "20px" }}>
            <SideLabel>Technical</SideLabel>
            {skills.technical.map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <div style={{ width: "6px", height: "6px", background: "#6366f1", borderRadius: "50%" }} />
                <span style={{ color: "#94a3b8", fontSize: "11.5px" }}>{s}</span>
              </div>
            ))}
          </div>
        )}

        {(skills.tools?.length > 0) && (
          <div style={{ marginTop: "16px" }}>
            <SideLabel>Tools</SideLabel>
            {skills.tools.map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <div style={{ width: "6px", height: "6px", background: "#22d3ee", borderRadius: "50%" }} />
                <span style={{ color: "#94a3b8", fontSize: "11.5px" }}>{s}</span>
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <SideLabel>Education</SideLabel>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: "10px" }}>
                <div style={{ color: "#f1f5f9", fontSize: "11.5px", fontWeight: "600" }}>{edu.school}</div>
                <div style={{ color: "#94a3b8", fontSize: "11px" }}>{edu.degree}</div>
                {edu.field && <div style={{ color: "#94a3b8", fontSize: "11px" }}>{edu.field}</div>}
                <div style={{ color: "#6366f1", fontSize: "10px" }}>{edu.startYear} – {edu.endYear}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ padding: "32px 32px 32px 28px" }}>
        {personal.summary && (
          <div style={{ marginBottom: "24px", padding: "12px 16px", background: "rgba(99,102,241,0.15)", borderLeft: "3px solid #6366f1", borderRadius: "0 8px 8px 0" }}>
            <p style={{ color: "#cbd5e1", fontSize: "12.5px", fontStyle: "italic" }}>{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <ModSection title="Experience">
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: "18px", paddingLeft: "12px", borderLeft: "2px solid #334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ color: "#f1f5f9", fontWeight: "700" }}>{exp.role}</div>
                  <div style={{ color: "#6366f1", fontSize: "11px" }}>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</div>
                </div>
                <div style={{ color: "#6366f1", fontSize: "12px" }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
                {exp.description && <div style={{ color: "#94a3b8", marginTop: "4px", whiteSpace: "pre-line" }}>{exp.description}</div>}
              </div>
            ))}
          </ModSection>
        )}

        {projects.length > 0 && (
          <ModSection title="Projects">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {projects.map(proj => (
                <div key={proj.id} style={{ background: "#1e293b", borderRadius: "10px", padding: "12px", border: "1px solid #334155" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "12.5px" }}>{proj.title}</span>
                    {proj.github && <a href={proj.github} style={{ color: "#6366f1", fontSize: "11px" }}>↗</a>}
                  </div>
                  {proj.tech && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", margin: "5px 0" }}>
                      {proj.tech.split(",").map(t => (
                        <span key={t} style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", padding: "1px 6px", borderRadius: "4px", fontSize: "10px" }}>{t.trim()}</span>
                      ))}
                    </div>
                  )}
                  {proj.description && <p style={{ color: "#64748b", fontSize: "11px", marginTop: "4px" }}>{proj.description.substring(0, 120)}{proj.description.length > 120 ? "…" : ""}</p>}
                </div>
              ))}
            </div>
          </ModSection>
        )}

        {certifications.length > 0 && (
          <ModSection title="Certifications">
            {certifications.map(cert => (
              <div key={cert.id} style={{ marginBottom: "6px" }}>
                <span style={{ color: "#f1f5f9", fontWeight: "600" }}>{cert.name}</span>
                {cert.issuer && <span style={{ color: "#64748b" }}> · {cert.issuer}</span>}
                {cert.year && <span style={{ color: "#6366f1", fontSize: "11px" }}> ({cert.year})</span>}
              </div>
            ))}
          </ModSection>
        )}
      </div>
    </div>
  );
}

function SideLabel({ children }) {
  return (
    <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#6366f1", fontWeight: "700", marginBottom: "8px" }}>{children}</div>
  );
}

function SideInfo({ icon, val }) {
  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "5px", alignItems: "flex-start" }}>
      <span style={{ fontSize: "11px" }}>{icon}</span>
      <span style={{ color: "#94a3b8", fontSize: "11px", wordBreak: "break-all" }}>{val}</span>
    </div>
  );
}

function ModSection({ title, children }) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <h2 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#6366f1", marginBottom: "12px" }}>{title}</h2>
      {children}
    </div>
  );
}