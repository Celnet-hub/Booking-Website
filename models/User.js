/**
 * A Mongoose schema defines the structure of the document, default values, validators, etc., whereas a Mongoose model provides an interface to the database for creating, querying, updating, deleting records, etc.
 */
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const Userschema = new mongoose.Schema({
	//defining the structure of the database.
	name: {
		type: String,
		required: true,
		unique:true
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	phone: {
		type: Number,
		required: true,
		unique:true
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	date: {
		type: Date,
		default: Date.now,
	},
});

Userschema.plugin(passportLocalMongoose);

//create a model
const User = mongoose.model("User", Userschema);

//export to users.js
module.exports = User;
