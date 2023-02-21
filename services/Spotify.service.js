// const SpotifyWebApi = require('spotify-web-api-node');

// const spotifyApi = new SpotifyWebApi({
// 	clientId: `${process.env.CLIENT_ID}`,
// 	clientSecret: `${process.env.CLIENT_SECRET}`,
// 	redirectUri: 'http://localhost:5550/token',
// });

// // Returns Access Token
// // spotifyApi
// // 	.clientCredentialsGrant()
// // 	.then((result) => {
// // 		console.log('Success: ' + result.body.access_token);

// // 		spotifyApi.setAccessToken(result.body.access_token);

// // 		spotifyApi.getArtistAlbums(
// // 			'43ZHCT0cAZBISjO8DG9PnE',
// // 			{ limit: 10, offset: 20 },
// // 			function (err, data) {
// // 				if (err) {
// // 					console.error('Something went wrong!');
// // 				} else {
// // 					console.log(data.body);
// // 				}
// // 			}
// // 		);
// // 	})
// // 	.catch((err) => {
// // 		console.log(
// // 			'If this is printed, it probably means that you used invalid ' +
// // 				'clientId and clientSecret values. Please check!'
// // 		);
// // 		console.log('Hint: ');
// // 		console.log(err);
// // 	});

// // spotifyApi.getArtistAlbums(
// // 	'43ZHCT0cAZBISjO8DG9PnE',
// // 	{ limit: 10, offset: 20 },
// // 	function (err, data) {
// // 		if (err) {
// // 			console.error('Something went wrong!');
// // 		} else {
// // 			console.log(data.body);
// // 		}
// // 	}
// // );

// module.exports = spotifyApi;
