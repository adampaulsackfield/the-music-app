const express = require("express");
const spotifyRouter = express.Router();

const {
  authorizeUser,
  saveAccessToken,
  getProfile,
} = require("../controllers/Spotify.controller");
const protectedRoute = require("../middleware/auth.middleware");

// TODO - Add protected after dev
spotifyRouter.route("/auth").get(protectedRoute, authorizeUser);
spotifyRouter.route("/token").get(protectedRoute, saveAccessToken);
spotifyRouter.route("/profile").get(protectedRoute, getProfile);
module.exports = spotifyRouter;
