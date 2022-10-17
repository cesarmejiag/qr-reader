const fs = require("fs");
const path = require("path");
const { response } = require("express");
const createPdf = require("../utils/createPdf");

const deleteImage = (req, res) => {
  const { id } = req.params;
  fs.unlinkSync(path.resolve("/tmp/", `${id}.pdf`));
  res.json({ success: true });
};

const getImage = (req, res) => {
  const { id } = req.params;
  res.sendFile(path.resolve("/tmp/", `${id}.pdf`));
};

const imageToPdf = async (req, res = response) => {
  try {
    const { id } = await createPdf(req.files.file);
    res.json({
      success: true,
      data: { id },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  deleteImage,
  getImage,
  imageToPdf,
};
