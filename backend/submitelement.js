const toolbox = require("tinytoolbox")
module.exports.handle = async (request,response) => {
	const urlParams = new URLSearchParams(request.url.replace(module.exports.manifest.location,""));
	if (urlParams.get("token") === undefined || urlParams.get("token").length < 700) {
		// Invalid Code
		response.writeHead(403,{'Content-Type': 'text/html'});
		response.write("TokenInvalid");
		response.end();
		return;
	}

	
	if (!require("./validate.js").isValid(urlParams.get("token"))) {
		response.writeHead(403,{'Content-Type': 'text/html'});
		response.write("TokenInvalid");
		response.end();
		return;
	}

	var bodyData = ''
	req.on('data',chunk=>bodyData+=chunk)
	req.on('end',async ()=>{
		bodyData = await JSON.parse(bodyData);

		var submitData = await require("./formatElement.js").parse(bodyData);

		var refrenceID = await toolbox.stringGen(32);

		// Add element to database
		await skindbStorage.db.collection(`elements_${submitData.category}`).doc(refrenceID).set(submitData);

		submitData.refrenceID = refrenceID;

		await response.writeHead(200,{"Content-Type":"application/javascript"})
		await response.write(JSON.stringify(submitData))
		response.end();
		return;
	})
}

module.exports.manifest = {
	isEndpoint: true,
	method: "POST",
	location: "/submit/element"
}