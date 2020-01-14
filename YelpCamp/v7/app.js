var Campground  	= require("./models/campground"),
	Comment     	= require("./models/comment"),
	LocalStrategy 	= require("passport-local"),
	User			= require("./models/user"),
	bodyParser  	= require("body-parser"),
	mongoose    	= require("mongoose"),
	passport		= require("passport"),
	express     	= require("express"),
	seedDB      	= require("./seeds"),
	//requiring routes
	campgroundRoutes 	= require("./routes/campgrounds"),
	commentRoutes		= require("./routes/comments"),
	indexRoutes			= require("./routes/index");

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

// ROUTES

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(3000, () => {
   console.log("The YelpCamp Server Has Started!");
});