// ENVIRONMENT VARIABLES
require('dotenv').config();

// IMPORTS
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./database/connection');

// ROUTES
const userRouter = require('./routes/User.routes');
const spotifyRouter = require('./routes/Spotify.routes');

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// DATABASE
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Barn Door

// ROUTING USER
app.use('/api/users', userRouter);
app.use('/api/spotify', spotifyRouter);

app.get('/healthcheck', (req, res) => {
  res.send('API IS RUNNING');
});

// Error Handler
app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ success: false, data: err.message });
  } else {
    next(err);
  }
});

module.exports = app;
