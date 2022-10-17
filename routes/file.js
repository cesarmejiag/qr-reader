const { Router } = require("express");
const { body, check } = require("express-validator");
const { deleteImage, getImage, imageToPdf } = require("../controllers/file");
const {
  fileExist,
  isValidUuid,
  validate,
  isValidImage,
} = require("../middlewares/validations");

const router = Router();

router.get(
  "/:id",
  [
    check("id").custom(isValidUuid),
    check("id").custom((id) => fileExist(id)),
    validate,
  ],
  getImage
);

router.delete(
  "/:id",
  [
    check("id").custom(isValidUuid),
    check("id").custom((id) => fileExist(id)),
    validate,
  ],
  deleteImage
);

router.post("/image-to-pdf", [isValidImage], imageToPdf);

module.exports = router;
