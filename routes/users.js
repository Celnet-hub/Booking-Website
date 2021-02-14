const express = require("express");
const User = require("../models/User.js");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

//create a route to Login page.
router.get("/login", (req, res) => res.render("login_page.ejs"));

//create a route to Registration page.
router.get("/register", (req, res) => res.render("register_page.ejs"));

//registration handler
router.post("/register", (req, res) => {
	const { name, email, phone, password, password2 } = req.body;
	let errors = [];
	//check required field
	if (!name || !email || !phone || !password || !password2) {
		errors.push({ msg: "Please fill all fields" });
	}

	//Match passwords
	if (password !== password2) {
		errors.push({ msg: "Ooops!!! Make sure Passwords match" });
	}

	//Check password length
	if (password.length < 5) {
		errors.push({ msg: "Password should be at least 6 characters" });
	}

	if (errors.length > 0) {
		res.render("register_page.ejs", {
			errors,
			name,
			email,
			phone,
			password,
			password2,
		});
	} else {
		//validation passed
		User.findOne({ email: email }).then((user) => {
			if (user) {
				//if user exists
				errors.push({ msg: "Email already exist." });
				res.render("register_page.ejs", {
					errors,
					name,
					email,
					phone,
					password,
					password2,
				});
			} else {
				const newUser = new User({
					name,
					email,
					phone,
					password,
				});
				//Hash Password
				bcrypt.genSalt(10, (err, salt) =>
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						//hashing password
						newUser.password = hash;

						//Save user to database
						newUser.save().then((user) => {
							req.flash(
								"success_msg",
								"You are now registered!!! Kindly login",
							);
							res.redirect("/users/login");
						});
					}),
				);
			}
		});
	}
	// TODO Work on clearing the errors array
	// ! errors.clear();
});

//login Handler
router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/dashboard", //redirect to dashboard
		failureRedirect: "/users/login",
		failureFlash: true,
	})(req, res, next);
});

//logout Handler
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success_msg", "You are now logged out");
	res.redirect("/users/login");
});

// forgot password Handler
router.get("/forgotpassword", (req, res) => res.render("forgotpassword"));

router.post("/forgotpassword", function (req, res, next) {
	async.waterfall(
		[
			function (done) {
				crypto.randomBytes(32, function (err, buffer) {
					let token = buffer.toString("hex");
					done(err, token);
				});
			},
			function (token, done) {
				User.findOne({ email: req.body.email }, function (err, user) {
					if (!user) {
						req.flash(
							"error_msg",
							"No account with that email address exists.",
						);
						return res.redirect("/users/forgotpassword");
					}

					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

					user.save(function (err) {
						done(err, token, user);
					});
				});
			},
			function (token, user, done) {
				var smtpTransport = nodemailer.createTransport({
					service: "Gmail",
					auth: {
						user: "nwabuisichiemelia@gmail.com",
						pass: process.env.GMAILPW,
					},
				});
				var mailOptions = {
					to: user.email,
					from: "nwabuisichiemelia@gmail.com",
					subject: "Node.js Password Reset",
					text:
						"You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
						"Please click on the following link, or paste this into your browser to complete the process:\n\n" +
						"http://" +
						req.headers.host +
						"/users/resetpassword/" +
						token +
						"\n\n" +
						"If you did not request this, please ignore this email and your password will remain unchanged.\n",
				};
				smtpTransport.sendMail(mailOptions, function (err) {
					console.log("mail sent");
					req.flash(
						"success_msg",
						"An e-mail has been sent to " +
							user.email +
							" with further instructions.",
					);
					done(err, "done");
				});
			},
		],
		function (err) {
			if (err) return next(err);
			res.redirect("/users/forgotpassword");
		},
	);
});

//reset password
router.get("/resetpassword/:token", function (req, res) {
	User.findOne(
		{
			resetPasswordToken: req.user.token,
			resetPasswordExpires: { $gt: Date.now() },
		},
		function (err, user) {
			if (!user || err) {
				req.flash(
					"error_msg",
					"Password reset token is invalid or has expired.",
				);
				return res.redirect("/users/forgotpassword");
			}
			res.render("resetpassword", { token: req.user.token });
		},
	);
});

router.post("/resetpassword/:token", function (req, res) {
	async.waterfall(
		[
			function (done) {
				User.findOne(
					{
						resetPasswordToken: req.user.token,
						resetPasswordExpires: { $gt: Date.now() },
					},
					function (err, user) {
						if (!user) {
							req.flash(
								"error_msg",
								"Password reset token is invalid or has expired.",
							);
							return res.redirect("/users/forgotpassword");
						}
						if (req.body.password === req.body.confirm) {
							user.setPassword(req.body.password, function (err) {
								user.resetPasswordToken = undefined;
								user.resetPasswordExpires = undefined;

								user.save(function (err) {
									req.logIn(user, function (err) {
										done(err, user);
									});
								});
							});
						} else {
							req.flash("error_msg", "Passwords do not match.");
							return res.redirect("back");
						}
					},
				);
			},
			function (user, done) {
				var smtpTransport = nodemailer.createTransport({
					service: "Gmail",
					auth: {
						user: "nwabuisichiemelia@gmail.com",
						pass: process.env.GMAILPW,
					},
				});
				var mailOptions = {
					to: user.email,
					from: "nwabuisichiemelia@gmail.com",
					subject: "Your password has been changed",
					text:
						"Hello,\n\n" +
						"This is a confirmation that the password for your account " +
						user.email +
						" has just been changed.\n",
				};
				smtpTransport.sendMail(mailOptions, function (err) {
					req.flash("success_msg", "Success! Your password has been changed.");
					done(err);
				});
			},
		],
		function (err) {
			if (err) {
				res.send(err);
			}
			res.redirect("/users/login");
		},
	);
});

//user profile
// ? Unable to retrive user information from the database
// TODO read on how to render information to the webpage.
router.get("/userprofile/:id", (req,res) => {
	let id = req.params.id;
	User.findById(id, (err,data) => {
		if (err){
			throw err;
		}
		res.render('userProfile', {
			UserName: data.name,
			Email: data.email,
			Phone: data.phone,
			userID: req.params.id
		});
	});
});

router.get("/edit/:id", (req, res) => {
	let id = req.params.id;
	User.findById(id, (err,data) => {
		if (err){
			throw err;
		}
		res.render('updateUserProfile', {
			UserName: data.name,
			Email: data.email,
			Phone: data.phone,
			userID: req.params.id
		});
	});
});

router.put("/save/:id", (req, res) => {
	res.send("user profile has been updated");
});

//exporting the module.
module.exports = router;
