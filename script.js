lucide.createIcons();

let activeBox = null;
document.querySelectorAll('.notes-box').forEach(box => {
  box.addEventListener('click', () => { activeBox = box; });
});

function format(cmd, val = null) {
  if (activeBox) {
    document.execCommand(cmd, false, val);
  }
}

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // Font gömme
  doc.addFileToVFS("NotoSans.ttf", NOTO_SANS_BASE64);
  doc.addFont("NotoSans.ttf", "NotoSans", "normal");
  doc.setFont("NotoSans");

  const keyTerms = document.querySelector(".key-terms").innerText.replace("Key Terms", "").trim();
  const mainNotes = document.querySelector(".main-notes").innerText.replace("Main Notes", "").trim();
  const summary = document.querySelector(".summary").innerText.replace("Summary", "").trim();

  let y = 60;
  y = addSection(doc, "Key Terms:", keyTerms, y);
  y = addSection(doc, "Main Notes:", mainNotes, y);
  addSection(doc, "Summary:", summary, y);

  doc.save("notes.pdf");
}

function addSection(doc, title, text, startY) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const lineHeight = 18;
  const maxWidth = pageWidth - margin * 2;

  let y = startY;
  doc.setFontSize(14);
  doc.text(title, margin, y);
  y += 25;

  doc.setFontSize(12);
  const lines = doc.splitTextToSize(text, maxWidth);

  lines.forEach(line => {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });

  return y + 20;
}

// 🔠 Şimdilik boş string — buraya NotoSans Base64 gömülecek
const NOTO_SANS_BASE64 = `
AAEAAAASAQAABAAgR0RFRrRCsIIAAjWsAAACYkdQT1O9H94kAAIxjAAAOE5jbWFwA...
...çok uzun base64 burada olacak...
`;
