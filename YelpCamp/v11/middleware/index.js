var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	if (req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground) => {
			if(err){
				console.log(err);
			} else {
				if (foundCampground.author.id.equals(req.user._id)) {
					return next();
				}
			}
			res.redirect("back");
		});
	} else {
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
	if (req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err){
				console.log(err);
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					return next();
				}
			}
			res.redirect("back");
		});
	} else {
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = middlewareObj;