const express = require('express');
const followRouter = express.Router();
const {
    addFollow
} = require('../controllers/Follow.controller');

const protectedRoute = require('../middleware/auth.middleware');

followRouter.route("/:id").get(protectedRoute, addFollow);

module.exports = followRouter;