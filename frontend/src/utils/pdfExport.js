/**
 * Export resume preview to PDF using html2pdf.js
 * Call this after the preview is rendered in the DOM
 */
export async function exportToPDF(resume) {
  // Dynamically load html2pdf to avoid SSR issues
  const html2pdf = (await import("html2pdf.js")).default;

  const element = document.getElementById("resume-template");
  if (!element) {
    console.error("Resume template element not found");
    return;
  }

  const name = resume?.personal?.name || "Resume";
  const filename = `${name.replace(/\s+/g, "_")}_Resume.pdf`;

  const options = {
    margin: [0, 0, 0, 0],
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  await html2pdf().set(options).from(element).save();
}