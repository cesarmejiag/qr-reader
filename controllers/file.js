const fs = require("fs");
const path = require("path");
const { response } = require("express");
const { v4: uuid } = require("uuid");
const PDFDocument = require("pdfkit");
const sizes = require("./../node_modules/image-to-pdf/sizes.json");

const deleteImage = (req, res) => {
  const { id } = req.params;
  const filePath = path.resolve("/tmp/", `${id}.pdf`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  res.json({ success: true });
};

const getImage = (req, res) => {
  const { id } = req.params;
  const filePath = path.resolve("/tmp/", `${id}.pdf`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(500).json({ success: false, message: "No file found" });
  }
};

const imageToPdf = (req, res = response) => {
  const { file } = req.files;
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
    res.json({
      success: true,
      data: { id },
    });
  });

  ws.on("error", (err) => {
    res.status(500).json({ success: false, message: err });
  });
};

module.exports = {
  deleteImage,
  getImage,
  imageToPdf,
};
