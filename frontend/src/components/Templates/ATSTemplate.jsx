export default function ATSTemplate({ resume }) {
  const { personal, education, experience, skills, projects, certifications } = resume;

  const s = (val) => val || "";

  return (
    <div id="resume-template" style={{
      fontFamily: "'Arial', 'Helvetica', sans-serif",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "40px 48px",
      color: "#000000",
      background: "#ffffff",
      minHeight: "1056px",
      fontSize: "13px",
      lineHeight: "1.5",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "16px", borderBottom: "2px solid #000000", paddingBottom: "12px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
          {s(personal.name) || "Your Name"}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", color: "#333333", fontSize: "12px" }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>| {personal.phone}</span>}
          {personal.location && <span>| {personal.location}</span>}
          {personal.linkedin && <span>| {personal.linkedin}</span>}
          {personal.github && <span>| {personal.github}</span>}
          {personal.portfolio && <span>| {personal.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <ATSSection title="PROFESSIONAL SUMMARY">
          <p style={{ color: "#000000", margin: 0 }}>{personal.summary}</p>
        </ATSSection>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <ATSSection title="WORK EXPERIENCE">
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontWeight: "700", color: "#000000" }}>{exp.role}</span>
                  {exp.company && <span style={{ fontWeight: "400", color: "#000000" }}>, {exp.company}</span>}
                  {exp.location && <span style={{ color: "#333333" }}>, {exp.location}</span>}
                </div>
                <span style={{ color: "#333333", fontSize: "12px", flexShrink: 0 }}>
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.description && (
                <div style={{ color: "#000000", marginTop: "4px", whiteSpace: "pre-line" }}>{exp.description}</div>
              )}
            </div>
          ))}
        </ATSSection>
      )}

      {/* Education */}
      {education.length > 0 && (
        <ATSSection title="EDUCATION">
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "700", color: "#000000" }}>{edu.school}</span>
                <span style={{ color: "#333333", fontSize: "12px" }}>{edu.startYear} – {edu.endYear || "Present"}</span>
              </div>
              <div style={{ color: "#000000" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</div>
              {edu.gpa && <div style={{ color: "#333333", fontSize: "12px" }}>GPA: {edu.gpa}</div>}
              {edu.activities && <div style={{ color: "#333333", fontSize: "12px" }}>{edu.activities}</div>}
            </div>
          ))}
        </ATSSection>
      )}

      {/* Skills */}
      {(skills.technical?.length > 0 || skills.tools?.length > 0 || skills.soft?.length > 0) && (
        <ATSSection title="SKILLS">
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {skills.technical?.length > 0 && (
              <div style={{ color: "#000000" }}>
                <span style={{ fontWeight: "700" }}>Technical: </span>
                {skills.technical.join(", ")}
              </div>
            )}
            {skills.tools?.length > 0 && (
              <div style={{ color: "#000000" }}>
                <span style={{ fontWeight: "700" }}>Tools: </span>
                {skills.tools.join(", ")}
              </div>
            )}
            {skills.soft?.length > 0 && (
              <div style={{ color: "#000000" }}>
                <span style={{ fontWeight: "700" }}>Soft Skills: </span>
                {skills.soft.join(", ")}
              </div>
            )}
          </div>
        </ATSSection>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <ATSSection title="PROJECTS">
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "700", color: "#000000" }}>{proj.title}</span>
                <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "#333333" }}>
                  {proj.github && <span>{proj.github}</span>}
                  {proj.link && <span>{proj.link}</span>}
                </div>
              </div>
              {proj.tech && <div style={{ color: "#333333", fontSize: "12px", marginTop: "2px" }}>Tech: {proj.tech}</div>}
              {proj.description && <div style={{ color: "#000000", marginTop: "4px", whiteSpace: "pre-line" }}>{proj.description}</div>}
            </div>
          ))}
        </ATSSection>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <ATSSection title="CERTIFICATIONS">
          {certifications.map((cert) => (
            <div key={cert.id} style={{ marginBottom: "6px" }}>
              <span style={{ fontWeight: "700", color: "#000000" }}>{cert.name}</span>
              {cert.issuer && <span style={{ color: "#333333" }}> — {cert.issuer}</span>}
              {cert.year && <span style={{ color: "#333333", fontSize: "12px" }}> ({cert.year})</span>}
            </div>
          ))}
        </ATSSection>
      )}
    </div>
  );
}

function ATSSection({ title, children }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <h2 style={{
        fontSize: "12px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "1px",
        color: "#000000",
        marginBottom: "6px",
        borderBottom: "1px solid #000000",
        paddingBottom: "3px",
      }}>{title}</h2>
      {children}
    </div>
  );
}