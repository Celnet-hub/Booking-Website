const express = require("express");
const router = express.Router();
const { ensureAuthorizedUser } = require("../config/authorize");

//create a route to homepage.
router.get("/", (req, res) => res.render("welcome.ejs"));
//route to dashboard
router.get("/dashboard", ensureAuthorizedUser, (req, res) =>
	res.render("index.ejs", {
		username: req.user.name,//identifies my user. 
		userID: req.user.id //request user ID from the database. 
	})
);

//user profile
router.get('/:id', (req,res) => res.render('userProfile', {
	UserName: req.user.name,
	Email: req.user.email,
	Phone: req.user.phone
}));

router.get('/:id/edit', (req,res) => {
	res.send('Edit User ' + req.user.id);
})

//exporting the module.
module.exports = router;
