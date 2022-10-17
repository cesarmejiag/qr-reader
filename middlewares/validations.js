const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");
const { validate: validateUuid } = require("uuid");

const fileExist = (name, ext = "pdf") => {
  const filePath = path.resolve("/tmp/", `${name}.${ext}`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does't exist`);
  }
  return true;
};

const isValidImage = (req, res, next) => {
  const file = req?.files?.file;
  const allowed = ["jpg", "jpeg", "png"];
  if (!file) {
    return res.status(400).json({ success: false, message: "No file given." });
  }

  const ext = path.extname(file.name).replace(/^\./, "");
  if (!allowed.includes(ext)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid file extensión." });
  }

  next();
};

const isValidUuid = (uuid = "") => {
  if (!validateUuid(uuid)) {
    throw new Error(`Invalid uuid.`);
  }
  return true;
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Can't process the request, fix all errors.",
      errors,
    });
  }
  next();
};

module.exports = {
  fileExist,
  isValidImage,
  isValidUuid,
  validate,
};
