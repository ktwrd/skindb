const fetch = require('node-fetch');
module.exports.handle = async (request,response) => {
	const urlParams = new URLSearchParams(request.url.replace(module.exports.manifest.location,""));
	if (urlParams.get("token") == undefined || urlParams.get("token") == null || urlParams.get("token").length < 700) {
		// Invalid Code
		response.writeHead(403,{'Content-Type': 'text/html'});
		response.write("TokenInvalid");
		response.end();
		return;
	}

	var responseData = await module.exports.isValid(urlParams.get("token"));

	if (responseData.avatar_url == undefined) {
		await response.writeHead(201,{"Content-Type":"text/html"});
		response.write("false");
		response.end();
	} else {
		var headers = {};
		headers["Access-Control-Allow-Origin"] = "*"
		headers["Content-Type"] = "application/javascript"
		await response.writeHead(200,headers);
		await response.write(JSON.stringify(responseData,null,'\t'));
		response.end();
	}
	return;
}

module.exports.isValid = async (gToken) => {
	var fetchResponse = await fetch("https://osu.ppy.sh/api/v2/me/osu",{
		method: "get",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": `Bearer ${gToken}`
		}
	})
	return fetchResponse.json()
}

module.exports.manifest = {
	isEndpoint: true,
	method: "GET",
	location: "/validate"
}