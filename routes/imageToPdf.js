const { Router } = require("express");
const { imageToPdf } = require("../controllers/imageToPdf");

const router = Router();

router.get("/", imageToPdf);

module.exports = router;
