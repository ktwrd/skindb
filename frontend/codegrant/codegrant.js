/* 
		https://osu.ppy.sh/oauth/authorize?client_id=6112&scope=identify&response_type=code&redirect_uri=http://skindb.jyles.club/codegrant
*/
setTimeout(()=>{
	function getAllParameters() {
		var raw = window.location.search.substr(1).split("&")
		
		var parameters = {};
		
		raw.forEach((obj)=>{
			var tmp = obj.split("=");
			parameters[tmp[0]] = tmp[1];
		})
		
		return parameters;
	}
	
	var parameters = getAllParameters();
	
	var uri = `http://skindb.jyles.club/api/v2/skindb/codegrant?code=${parameters.code}`
	//var uri = `http://10.17.127.70:38084/codegrant?code=${parameters.code}`;
	axios({url:uri,method:"GET",cache:'no-cache',headers:{"Accept":"application/json"}}).then(d => d.data).then((data)=>{
		if (data.error != undefined) {
			document.getElementById("statusText").innerHTML = "Darn!";
			switch (data.error) {
				case "The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.":
					document.getElementById("statusDescription").innerHTML = `Looks like this code is already used or you are a cheeky lad.<br><a href="http://skindb.jyles.club/oauth.html">Try Again</a>`
					break;
				default:
					document.getElementById("statusDescription").innerHTML = `An error occoured<br><code>${JSON.stringify(data,null,"<br><span style='padding-left: 16px;'></span>")}`
			}
		} else {
			document.getElementById("statusText").innerHTML = "Done!"
			document.getElementById("statusDescription").innerHTML = "Logged into osk!db through osu!oauth";
			Object.entries(data).forEach((dEntry)=>{
				if (dEntry[0] == "expires_in") {
					localStorage.oauth_expire_timestamp = Math.round(Date.now()/1000 + dEntry[1]);
				} else {
					dEntry[0] = "oauth_"+dEntry[0];
					localStorage[dEntry[0]] = dEntry[1];
				}
			})
	
			setTimeout(()=>{
				document.getElementById("statusText").innerHTML = "Redirecting to Homepage";
				setTimeout(()=>{
					window.location = "http://skindb.jyles.club";
				},2500)
			},1000)
		}
	})
},1500)