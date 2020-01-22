var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");
var User = require("./models/user");

var data = [
    {
        name: "Cloud's Rest",
		price: 20.99,
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa",
		price: 15.99,
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor",
		price: 16.99,
        image: "https://images.unsplash.com/photo-1479244209311-71e35c910f59?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Camp Chilli",
		price: 9.99,
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB(){
   //Remove all campgrounds
	Campground.deleteMany({}, (err) => {
		if (err) {
			console.log("Could not remove campgrounds from DB");
			console.log(err);
		} else {
			console.log("\nRemoved campgrounds!\n");
			Comment.deleteMany({}, (err) => {
				if (err) {
					console.log("Could not remove comments from DB");
					console.log(err);
				} else {
					data.forEach((seed) => {
						Campground.create(seed, (err, campground) => {
							if(err){
								console.log(err)
							} else {
								console.log("Added a campground: " + campground.name);
								// Add an existing User as author for Campground and Comment
								User.findOne({}, (err, user) => {
									if (err) {
										console.log("Could not find a user from DB (seed)");
										console.log(err);
									} else {
										var author = {
											id: user._id,
											username: user.username
										};
										// Create a comment
										Comment.create(
											{
												text: "This place is great, but I wish there was internet",
												author: author
											}, (err, comment) => {
												if(err){
													console.log("Could not create a comment (seed)")
													console.log(err);
												} else {
													campground.comments.push(comment);
													campground.author = author;
													campground.save()
													console.log("Added a comment for " + campground.name);
												}
										});
									}
								});
							}
						});
					});
				}
			});
		}
	});
}

module.exports = seedDB;
