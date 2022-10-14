const { response } = require("express");

const imageToPdf = (req, res = response) => {
  res.json({ success: true });
};

module.exports = {
  imageToPdf,
};
