const mongoose =  require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    //id: Number, Mongoose automatically creates ID?
    username: {type: String, required: true},
    password: String,
    email: String,
    displayName: String,
    //friends: [{usernames: String}], //don't know if this is right
    //playlists: [{playlists: String}] // probably have to make a specific class/ objectID?
});

module.exports = mongoose.model('User', userSchema); // I'm trying



