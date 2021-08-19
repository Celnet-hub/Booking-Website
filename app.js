//imported modules
const express = require("express");
const router = express.Router();
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
require('dotenv').config()


//creating express server
const app = express();

// passport config
require("./config/passport.js")(passport);

//connect to Database
let password = process.env.PASSWORD
const dataBase = `mongodb+srv://DCN:${password}@cluster0.0qick.mongodb.net/Cluster0?retryWrites=true&w=majority`;
// console.log(dataBase);
mongoose
	.connect(dataBase, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log("MongoDB Atlas Connected...."))
	.catch((err) => console.log(err));

//EJS
app.use(expressLayout);
app.use(express.static(__dirname + "/pages"));
app.set("views", __dirname + "/pages");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

//Bodyparser: to act as a middleware to collect data from Registration form
app.use(express.urlencoded({ extended: false }));

// Express session
let secret = process.env.KEY 
app.use(
	session({
		secret: secret,
		resave: true,
		saveUninitialized: true,
	}),
);

//methodOverride Middleware
app.use(methodOverride("_HttpMethod"));
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Global variables for connect flash
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
// app.use("/.netlify/functions/server", router); // path must route to lambda

// //config app for serverless http
// module.exports.handler = serverless(app);

//create a port where the application would run on.
const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Your Server has started on port ${PORT}`));
