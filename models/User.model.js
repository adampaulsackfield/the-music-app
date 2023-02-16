const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;

const userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	displayName: { type: String, required: true },
	password: { type: String, required: true, select: false },
});

userSchema.plugin(uniqueValidator);

// TODO - Add min max to password, username
module.exports = mongoose.model('User', userSchema); // I'm trying
