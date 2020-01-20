var passportLocalMongoose = require("passport-local-mongoose"),
	mongoose = require("mongoose");

module.exports = mongoose.model("User", new mongoose.Schema({
	username: String,
	password: String
}).plugin(passportLocalMongoose));