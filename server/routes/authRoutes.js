const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getMe,
    getUserProfilData,
    changePassword,
    getAllUsers
} = require("../controlers/usersController");

const { isAuthorised } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", isAuthorised, getMe);
router.get("/userProfile", isAuthorised, getUserProfilData);
router.post("/change-password", isAuthorised, changePassword);
router.get("/users", isAuthorised, getAllUsers);

module.exports = router;