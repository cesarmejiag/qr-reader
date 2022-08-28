const fs = require("fs");
const PDFDocument = require("pdfkit");
const sizes = require("./../node_modules/image-to-pdf/sizes.json");
const { getId, resolvePath } = require("./utils");

const generatePDF = (imagePath, filesPath) =>
  new Promise((res, rej) => {
    const size = "A4";
    try {
      const id = getId();
      const pdfPath = resolvePath(filesPath, `${id}-file.pdf`);
      const ws = fs.createWriteStream(pdfPath);
      const doc = new PDFDocument({ margin: 0, size });
      doc.image(imagePath, 0, 0, {
        fit: sizes[size],
        align: "left",
        valign: "top",
      });
      doc.end();
      doc.pipe(ws);

      ws.on("finish", () => {
        res([doc, pdfPath]);
      });
    } catch (err) {
      rej(err);
    }
  });

module.exports = generatePDF;
