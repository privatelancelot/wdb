var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")

//INDEX - show all campgrounds
router.get("/", (req, res) => {
	
    // Get all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", isLoggedIn, (req, res) => {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
    var newCampground = {name: name, image: image, description: desc, author: author}
    // Create a new campground and save to DB
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", isLoggedIn, (req, res) => {
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT - edit form to edit campground
router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE - post to update campground
router.put("/:id", checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err){
            console.log(err);
			res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
	});
});

//DESTROY - delete campground
router.delete("/:id", checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, removingCampground) => {
		if (err) {
			console.log(err)
			res.redirect("/campgrounds");
		} else {
			removingCampground.deleteOne();
			res.redirect("/campgrounds");
		}
	});
})

//MIDDLEWARE
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
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

module.exports = router;