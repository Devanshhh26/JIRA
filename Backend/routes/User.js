const express = require("express"); 
const router = express.Router();
const { signup, login, deleteAccount, logout, profile } = require("../controllers/Auth");
const { authenticate } = require("../middleware/auth");

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signup);

//Route for logout
router.post("/logout",logout);

//Route to delete the account
router.delete("/deleteAccount", authenticate, deleteAccount); 

//Route to get profile
router.get("/profile",authenticate,profile);

module.exports = router;
