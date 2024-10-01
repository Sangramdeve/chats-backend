const express = require("express");

const router = express.Router();

//Registers a new user by saving user details like username, password (hashed),
router.route("/register").post();

//Logs in a user by validating credentials and returning a JWT token.
router.route("/login").get().post();

//Retrieves the profile of a specific user by their user ID.
//Updates the profile of a specific user, like changing username or profile picture.
router.route("/").get().post();

//Searches for users based on username
router.route("/search?query=username").get();

module.exports = router;
