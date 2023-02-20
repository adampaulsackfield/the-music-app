const fs = require('fs');
const { request } = require('http');

const endpoints = fs.readFileSync('./Music App.postman_collection.json');

const json = JSON.parse(endpoints);

const result = json.item[0].item.forEach((endpoint) => {
	console.log('Name: ', endpoint.name);
	console.log('Method: ', endpoint.request.method);
	console.log('Headers: ', endpoint.request.header);

	if (endpoint.request.body.raw !== '') {
		const jsonObject = {
			...endpoint.request.body,
			raw: JSON.parse(endpoint.request.body.raw),
		};

		console.log('Body: ', jsonObject);
		console.log('URL: ', endpoint.request.url);
	}
});
