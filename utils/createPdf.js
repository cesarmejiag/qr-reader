const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const PDFDocument = require("pdfkit");
const sizes = require("./../node_modules/image-to-pdf/sizes.json");

const createPdf = (file) =>
  new Promise((res, rej) => {
    const size = "A4";
    const id = uuid();
    const destPath = path.resolve("/tmp/", `${id}.pdf`);
    const ws = fs.createWriteStream(destPath);
    const doc = new PDFDocument({ margin: 0, size });
    doc.image(file.tempFilePath, 0, 0, {
      fit: sizes[size],
      align: "left",
      valign: "top",
    });
    doc.end();
    doc.pipe(ws);

    ws.on("finish", () => {
      res({ file: doc, id });
    });

    ws.on("error", (err) => {
      rej(err);
    });
  });

module.exports = createPdf;
