const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");

const { isAuthorised } = require("../middleware/auth");
const { checkout, subscription } = require("../controlers/stripeController");

const { webhook } = require("../services/stripeService");

router.post(
    "/webhook",
    bodyParser.raw({ type: "application/json" }),
    webhook
);

router.post("/checkout", isAuthorised, checkout);
router.post("/subscribe", isAuthorised, subscription);

module.exports = router;
