module.exports = {
	ensureAuthorizedUser: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}

		req.flash("error_msg", "Please Login to Account");
		res.redirect("/users/login");
	},
};
