var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//LANDING - root
router.get("/", (req, res) => {
    res.render("landing");
});

// ====================
// AUTH ROUTES
// ====================

//show register form
router.get("/register", (req, res) => {
	res.render("register");
});

//handle signup logic
router.post("/register", (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			return res.render("register");
		}
		
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to YelpCamp " + user.username)
			res.redirect("/campgrounds");
		})
	});
});

//show login form
router.get("/login", (req, res) => {
	res.render("login");
});

//handle login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), (req, res) => {

});

// logout route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Sign out successful");
	res.redirect("/campgrounds");
});

module.exports = router;