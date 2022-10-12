const { response } = require("express");

const greetings = (req, res = response) => {
  res.json({ success: true });
};

module.exports = {
  greetings,
};
