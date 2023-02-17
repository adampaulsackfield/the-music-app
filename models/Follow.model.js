const mongoose = require('mongoose');
const { Schema } = mongoose;

const followerSchema = new Schema({
    requester: {type: Schema.Types.ObjectId, ref: "Users"},
    requestee: {type: Schema.Types.ObjectId, ref: "Users"},
});

module.exports = mongoose.model('Followers', followerSchema); 