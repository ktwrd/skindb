const fetch = require('node-fetch');
module.exports.handle = async (request,response) => {
	const urlParams = new URLSearchParams(request.url.replace(module.exports.manifest.location,""));
	if (urlParams.get("token") === undefined || urlParams.get("token").length < 700) {
		// Invalid Code
		response.writeHead(403,{'Content-Type': 'text/html'});
		response.write("TokenInvalid");
		response.end();
		return;
	}

	var fetchResponse = await fetch("https://osu.ppy.sh/api/v2/me/osu",{
		method: "get",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": `Bearer ${urlParams.get("token")}`
		}
	})
	var responseData = await fetchResponse.json();
	var headers = {};
	await fetchResponse.headers.forEach((headerData,headerName)=>{
		if (headerName == "content-encoding") return;
		headers[headerName] = headerData;
	})
	headers["Access-Control-Allow-Origin"] = "*"
	await response.writeHead(200,headers);
	await response.write(JSON.stringify(responseData,null,'\t'));
	response.end();
	return;
}

module.exports.manifest = {
	isEndpoint: true,
	method: "GET",
	location: "/user"
}