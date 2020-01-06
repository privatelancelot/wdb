var Campground  	= require("./models/campground"),
	Comment     	= require("./models/comment"),
	LocalStrategy 	= require("passport-local"),
	User			= require("./models/user"),
	bodyParser  	= require("body-parser"),
	mongoose    	= require("mongoose"),
	passport		= require("passport"),
	express     	= require("express"),
	seedDB      	= require("./seeds");

var app         	= express();

mongoose.connect("mongodb://localhost/yelp_camp_v4", {
	useNewUrlParser: true,
	useCreateIndex : true,
	useUnifiedTopology: true
}).then(() => {
	console.log("Connected to DB");
}, err => {
	console.log("Cannot connect to DB");	
	});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Authentication is quite easy with ready-made modules",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});


// ====================
// ROUTES BEGIN HERE
// ====================

app.get("/", (req, res) => {
    res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
	
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
app.post("/campgrounds", (req, res) => {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
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
app.get("/campgrounds/new", (req, res) => {
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


// ====================
// COMMENTS ROUTES
// ====================

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    // find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

app.post("/campgrounds/:id/comments", (req, res) => {
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

// ====================
// AUTH ROUTES
// ====================

//show register form
app.get("/register", (req, res) => {
	res.render("register");
});

//handle signup logic
app.post("/register", (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.render("register");
		}
		
		passport.authenticate("local")(req, res, () => {
			res.redirect("/campgrounds");
		})
	});
});

//show login form
app.get("/login", (req, res) => {
	res.render("login");
});

//handle login logic
app.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirecT: "/login"
}), (req, res) => {

});

// logout route
app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, () => {
   console.log("The YelpCamp Server Has Started!");
});