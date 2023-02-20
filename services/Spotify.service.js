const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
	clientId: `${process.env.CLIENT_ID}`,
	clientSecret: `${process.env.CLIENT_SECRET}`,
	redirectUri: 'http://localhost:5550/callback',
});

spotifyApi.getArtistAlbums(
	'43ZHCT0cAZBISjO8DG9PnE',
	{ limit: 10, offset: 20 },
	function (err, data) {
		if (err) {
			console.error('Something went wrong!');
		} else {
			console.log(data.body);
		}
	}
);

module.exports = spotifyApi;
