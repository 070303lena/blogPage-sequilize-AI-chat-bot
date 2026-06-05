const express = require("express");
const router = express.Router();

const { isAuthorised } = require("../middleware/auth");

const { addCartItem, getCart, deleteItem, updateItem } = require("../controlers/cartController");

router.post("/add", isAuthorised, addCartItem);
router.get("/", isAuthorised, getCart);
router.delete("/:itemId", isAuthorised, deleteItem);
router.patch("/:itemId", isAuthorised, updateItem);

module.exports = router;
