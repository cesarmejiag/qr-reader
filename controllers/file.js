const fs = require("fs");
const path = require("path");
const { response } = require("express");
const createPdf = require("../utils/createPdf");

const deleteImage = (req, res) => {
  const { id } = req.params;
  const filePath = path.resolve("/tmp/", `${id}.pdf`);
  fs.unlinkSync(filePath);
  console.log(`[Controller] File deleted (${filePath})`);
  res.json({ success: true });
};

const getImage = (req, res) => {
  const { id } = req.params;
  const filePath = path.resolve("/tmp/", `${id}.pdf`);
  console.log(`[Controller] File served (${filePath})`);
  res.sendFile(filePath);
};

const imageToPdf = async (req, res = response) => {
  const { file } = req.files;
  const { name } = file;
  try {
    const { id } = await createPdf(file);
    console.log(`[Controller] Pdf generated with uuid ${id}`);
    res.json({
      success: true,
      data: { id },
    });
  } catch (err) {
    console.log(
      `[Controller] Can't convert image to pdf (${name}) (${err.message})`
    );
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  deleteImage,
  getImage,
  imageToPdf,
};
