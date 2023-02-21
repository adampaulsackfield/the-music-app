const express = require('express');
const spotifyRouter = express.Router();

const {
	authorizeUser,
	saveAccessToken,
	getProfile,
} = require('../controllers/Spotify.controller');
const protectedRoute = require('../middleware/auth.middleware');

// TODO - Add protected after dev
spotifyRouter.route('/auth').get(authorizeUser);
spotifyRouter.route('/token').get(saveAccessToken);
spotifyRouter.route('/profile').get(getProfile);
module.exports = spotifyRouter;
