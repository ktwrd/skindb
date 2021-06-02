const fetch = require('node-fetch');
const toolbox = require("tinytoolbox")
var serverSecrets = require("./../secret.json");

// http://api.dxcdn.net/osu/skindb/codegrant?code={{code}}
module.exports.handle = async (request,response) => {


	const urlParams = new URLSearchParams(request.url.replace("/codegrant",""));
	if (urlParams.get("code") === undefined || urlParams.get("code").length < 700) {
		// Invalid Code
		response.writeHead(400,{'Content-Type': 'text/html'});
		response.write("CodeInvalid");
		response.end();
		return;
	}

	// Get token
	var sendData = {
		"grant_type": "authorization_code",
		"client_id": serverSecrets.client_id,
		"client_secret": serverSecrets.client_secret,
		"code": urlParams.get("code"),
		"redirect_uri": `http://skindb.jyles.club/codegrant`,
	}

	sendData = await JSON.stringify(sendData);
	var fetchResponse = await fetch("https://osu.ppy.sh/oauth/token",{
		method: "post",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
		body: sendData,
	})
	var headers = {};
	await toolbox.async.forEach(fetchResponse.headers,(headerData,headerName)=>{
		if (headerName != "content-encoding" || headerName != "access-control-allow-origin") {
			headers[headerName] = headerData;
		}
	})
	headers["Access-Control-Allow-Origin"] = "*"
	headers["Content-Type"] = headers["content-type"] || "application/json"
	await response.writeHead(200,headers);
	var responseData = await fetchResponse.json();
	await response.write(JSON.stringify(responseData));
	setTimeout(()=>{
		response.end();
	},500)
	return;
}

module.exports.manifest = {
	isEndpoint: true,
	method: "GET",
	location: "/codegrant"
}