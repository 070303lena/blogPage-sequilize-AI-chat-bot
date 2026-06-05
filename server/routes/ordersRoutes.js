const express = require("express");
const router = express.Router();

const { isAuthorised } = require("../middleware/auth");

const { getOrdersList } = require("../controlers/ordersController");

router.get("/", isAuthorised, getOrdersList);

module.exports = router;