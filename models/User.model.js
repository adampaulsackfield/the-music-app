const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;

const userSchema = new Schema({
	//id: Number, Mongoose automatically creates ID?
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true, select: false },
	email: { type: String, required: true, unique: true },
	displayName: String,
	//friends: [{usernames: String}], //don't know if this is right
	//playlists: [{playlists: String}] // probably have to make a specific class/ objectID?
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema); // I'm trying
