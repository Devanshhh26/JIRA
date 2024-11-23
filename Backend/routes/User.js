const express = require("express"); 
const router = express.Router();
const { signup, login, deleteAccount, logout } = require("../controllers/Auth");
const { authenticate } = require("../middleware/auth");

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signup);

//Route for logout
router.post("/logout",logout);

//Route to delete the account
router.delete("/deleteAccount", authenticate, deleteAccount); 
module.exports = router;
