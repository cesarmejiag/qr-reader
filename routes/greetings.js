const { Router } = require("express");
const { greetings } = require("../controllers/greetings");
const router = Router();

router.get("/", greetings);

module.exports = router;
