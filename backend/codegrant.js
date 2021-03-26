const fetch = require('node-fetch');
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
		"redirect_uri": `http://api.dxcdn.net/osu/skindb/codegrant`,
	}
	var fetchResponse = await fetch("https://osu.ppy.sh/oauth/token",{
		//url: "https://osu.ppy.sh/oauth/token",
		method: "post",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
		body: await JSON.stringify(sendData),
		//data: sendData,
	})
	var headers = {};
	await fetchResponse.headers.forEach((headerData,headerName)=>{
		if (headerName == "content-encoding") return;
		headers[headerName] = headerData;
	})
	await response.writeHead(fetchResponse.status || 200,headers);
	var responseData = await fetchResponse.json()
	await response.write(JSON.stringify(responseData,null,'\t'));
	response.end();
	return;
}

module.exports.manifest = {
	isEndpoint: true,
	method: "GET",
	location: "/codegrant"
}