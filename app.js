// App.js

const express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User = require("./model/User"),
	app = express(),
	methodOverride = require('method-override')


mongoose.connect("mongodb://127.0.0.1:27017/learners");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
	secret: "Rusty is a dog",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=====================
// ROUTES
//=====================

// Showing login page
app.get("/", function (req, res) {
	res.render("login");
});

// Showing index page
app.get("/index", isLoggedIn, function (req, res) {
	res.render("index.ejs");
});

// Showing register form
app.get("/register", function (req, res) {
	res.render("register.ejs");
});

// Handling user signup
app.post("/register", async (req, res) => {
	const password = req.body.password
	const cpassword = req.body.passwordConfirm
	const user = await User.create({
	username: req.body.username,
	email: req.body.email,
	password: req.body.password,
	cpassword: req.body.passwordConfirm
	});
	if (password === cpassword){


	res.render("login.ejs")}
	else{
		res.render('index', function (err, html) {
			res.send("<p> plz </p>")
		  })
	}
});

//Showing login form
app.get("/login", function (req, res) {
	res.render("login.ejs");
});

//Handling user login
app.post("/login", async function(req, res){
	try {
		// check if the user exists
		const user = await User.findOne({ email: req.body.email });
		if (user) {
		//check if password matches
		const result = req.body.password === user.password;
		if (result) {
			res.render("index.ejs");
		} else {
			res.render("loginerror.ejs");
		}
		} else {
		res.status(400).json({ error: "User doesn't exist" });
		}
	} catch (error) {
		res.status(400).json({ error });
	}
});

//Handling user logout
app.get("/logout", function (req, res) {
	req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
});



function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/login.ejs");
}

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Server Has Started!");
});
