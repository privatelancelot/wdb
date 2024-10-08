var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//COMMENTS NEW
router.get("/new", isLoggedIn, (req, res) => {
    // find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});
//COMMENTS CREATE
router.post("/", (req, res) => {
   //lookup campground using ID
   Campground.findById(req.params.id, (err, campground) => {
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, (err, comment) => {
           if(err){
               console.log(err);
           } else {
			   //add username and id to comment
			   comment.author.id = req.user._id;
			   comment.author.username = req.user.username;
			   //save comment
			   comment.save();
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

//MIDDLEWARE
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;