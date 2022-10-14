const { Router } = require("express");
const { deleteImage, getImage, imageToPdf } = require("../controllers/file");

const router = Router();

router.get("/:id", getImage);
router.post("/image-to-pdf", imageToPdf);
router.delete("/:id", deleteImage);

module.exports = router;
