const express = require("express");
const router = express.Router();
const { ensureAuthorizedUser } = require("../config/authorize");

//create a route to homepage.
router.get("/", (req, res) => res.render("HomePage.ejs"));
//route to dashboard
router.get("/dashboard", ensureAuthorizedUser, (req, res) =>
	res.render("index.ejs", {
		username: req.user.name,//identifies my user. 
		userID: req.user.id //request user ID from the database. 
	})
);





//exporting the module.
module.exports = router;
