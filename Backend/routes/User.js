const express = require("express"); 
const router = express.Router();
const { signup, login, deleteAccount, logout, profile, updateUser, getAvailableUsers } = require("../controllers/Auth");
const { authenticate } = require("../middleware/auth");
const { getAllProjects } = require("../controllers/Project");

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

//Route to update the User
router.put("/updateUser",authenticate,updateUser);

//router to get aal available users
router.get('/available-users', getAvailableUsers);

module.exports = router;
