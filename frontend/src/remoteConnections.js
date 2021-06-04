const axios = require("axios")
module.exports = {
	osu: {
		validateKey: (gToken) => {
			gToken = gToken || localStorage.oauth_access_token;
			return new Promise((resolve,reject)=>{
				console.log(`[remoteConnections -> osu.validateKey] Sent request to backend.`)
				axios({
					url: `${skindb.backendServer}/validate?token=${gToken}`,
					method: "get",
					headers:{
						"Accept": "application/json"
					}
				}).then((res)=>{
					if (res.status === 200) {	
						global.skindb.usercache = res.data;
					}
					console.log("[remoteConnection -> osu.validateKey] Recieved Data",res.data);
					resolve(res.data);
				}).catch(reject)
			})
		}
	},
	api: {
		element: {
			submit: (gB64,gFILENAME,gANIMGROUP,gSOURCE) => {
				return new Promise((resolve,reject)=>{
					var submitData = {
						b64: gB64,
						filename: gFILENAME,
						animgroup: gANIMGROUP,
						source: gSOURCE,
						userid: skindb.usercache.id
					}
					console.log(`[remoteConnections -> api.element.submit] Submitting Element with data of`,submitData);
					axios({
						url: `${skindb.backendServer}/submit/element?token=${localStorage.oauth_access_token}`,
						method: "POST",
						headers: {
							"Accept": "application/json",
							"Content-Type": "application/json"
						},
						body: JSON.stringify(submitData),
					}).then(resolve).catch(reject);
				})
			}
		}
	}
}