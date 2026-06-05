const express = require("express");
const router = express.Router();

const { isAuthorised } = require("../middleware/auth");

const { subscription } = require("../controlers/subscribtionController");

router.get("/", isAuthorised, subscription);

module.exports = router;