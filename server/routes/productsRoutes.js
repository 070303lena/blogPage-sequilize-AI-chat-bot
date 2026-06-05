const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");
const { isAuthorised } = require("../middleware/auth");

const {
    addCategory,
    getCategories,
    addProduct,
    getProducts
} = require("../controlers/productsController");

router.post("/category", isAuthorised, addCategory);
router.get("/category", getCategories);

router.post("/", isAuthorised, upload.single("image"), addProduct);
router.get("/", getProducts);

module.exports = router;