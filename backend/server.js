const fs = require("fs");
const http = require("http");
const toolbox = require("tinytoolbox");
const config = require("./config.js");

var handleEndpoints = {};

const admin = require('firebase-admin');
const serviceAccount = require("./../secret.json").firebase;
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

global.skindbStorage = {
	db: admin.firestore()
}

fs.readdirSync(".").forEach((file)=>{
	if (file.endsWith(".js")) {
		try {
			var tempRequire = require(`./${file}`);
			if (tempRequire.manifest === undefined) return;
			if (!tempRequire.manifest.isEndpoint) return;
			if (!tempRequire.manifest.method) return;
			if (!tempRequire.manifest.location) return;
			handleEndpoints[file.split('.')[file.split('.').length - 2]] = tempRequire;
		} catch (e) {
			console.error("Invalid Javascript File",e);
			process.exit(1);
		}
	}
})

http.createServer(async (request,response)=>{
	var endpoint = {};
	await toolbox.async.forEach(toolbox.JSON.toArray(handleEndpoints),(tEndpoint)=>{
		if (tEndpoint[1].manifest == undefined || tEndpoint[1].manifest.location == undefined) return;
		if (request.url.split("?")[0] == tEndpoint[1].manifest.location && request.method == tEndpoint[1].manifest.method) {
			endpoint = tEndpoint[1];
		}
	})
	if (endpoint.handle === undefined) return response.end();
	console.log(request.url)
	endpoint.handle(request,response);
}).listen(config.port);

console.log(`Server Started on port :${config.port}`)

console.log(`https://osu.ppy.sh/oauth/authorize?client_id=${config.secret.client_id}&scope=identify&response_type=code&redirect_uri=${config.secret.application_callback_url}`)