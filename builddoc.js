const fs = require('fs');

// Read JSON file
const data = fs.readFileSync('./Music App.postman_collection.json');

// Parse JSON data
const jsonData = JSON.parse(data);

// Initialize Markdown content
let mdContent = '# API Endpoints\n';

// Extract data from each endpoint and add to Markdown content
jsonData.item.forEach((endpoint) => {
	mdContent += `\n## ${endpoint.name}\n\n`;
	endpoint.item.forEach((subEndpoint) => {
		mdContent += `### ${subEndpoint.name}\n\n`;
		mdContent += `**Method:** \`${subEndpoint.request.method}\`\n\n`;
		mdContent += `**URL:** \`${subEndpoint.request.url.raw}\`\n\n`;
		if (subEndpoint.request.body && subEndpoint.request.body.raw) {
			mdContent += `**Body:**\n\n\`\`\`\n${subEndpoint.request.body.raw}\n\`\`\`\n\n`;
		}
		if (subEndpoint.request.header && subEndpoint.request.header.length > 0) {
			mdContent += `**Headers:**\n\n`;
			subEndpoint.request.header.forEach((header) => {
				mdContent += `- ${header.key}: ${header.value}\n`;
			});
			mdContent += '\n';
		}
		if (subEndpoint.request.auth && subEndpoint.request.auth.bearer) {
			mdContent += `**Bearer Token:**\n\n\`\`\`\n${subEndpoint.request.auth.bearer[0].value}\n\`\`\`\n\n`;
		}
	});
});

// Write Markdown content to file
fs.writeFileSync('endpoints.md', mdContent);
