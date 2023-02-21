const SpotifyWebApi = require('spotify-web-api-node');
const User = require('../models/User.model');

const spotifyApi = new SpotifyWebApi({
  clientId: `${process.env.CLIENT_ID}`,
  clientSecret: `${process.env.CLIENT_SECRET}`,
  redirectUri: 'http://localhost:5550/api/spotify/token',
});

const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify',
];

const authorizeUser = (req, res, next) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
};

const saveAccessToken = (req, res, next) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      const user = User.findByIdAndUpdate(req.user.id, {
        accessToken: access_token,
      });

      if (!user) {
        console.log('no user');
      }

      console.log('access_token:', access_token);
      console.log('refresh_token:', refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.send('Success! You can now close the window. ' + access_token);

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];

        console.log('The access token has been refreshed!');
        console.log('access_token:', access_token);
        spotifyApi.setAccessToken(access_token);
      }, (expires_in / 2) * 1000);
    })
    .catch((error) => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
};

const getProfile = (req, res, next) => {
  spotifyApi.getUser('spongebob1123').then(
    function (data) {
      console.log('Some information about this user', data.body);
    },
    function (err) {
      console.log('Something went wrong!', err);
    }
  );
};

module.exports = { authorizeUser, saveAccessToken, getProfile };
