global.$ = require("jquery");
global.skindb = {
	parameters: () => {
		var raw = window.location.search.substr(1).replace("?","").split("&");
		
		var parameters = {};
		raw.forEach((obj)=>{
			var tmp = obj.split("=");
			parameters[tmp[0]] = tmp[1];
		})
		return parameters;
	},
	arrayContains: (g_Array,g_Object) => {
		var x;
		for (x in g_Array) 
		{
			if (g_Array.hasOwnProperty(x) && g_Array[x] === g_Object) 
			{
				return true;
			}
		}
		return false;
	},
	isURL: (InputString) =>
	{
		var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
		var regex = new RegExp(expression);

		return InputString.match(regex);
	},
	remote: require("./remoteConnections"),
	backendServer: "http://skindb.jyles.club/api/v2/skindb",
	usercache: {},
	dropsheet:
	{
		hide: ()=>{
			$("div.dropsheet").fadeOut("fast");
		},
		show: ()=>{
			$("div.dropsheet").fadeIn("fast");
		},
		title: (NewTitle)=>{
			$("div.dropsheet h1").html(NewTitle);
		},
	}
}

global.skindb.backendServer = skindb.isURL(localStorage.custom_backendLocation) ? localStorage.custom_backendLocation : "http://skindb.jyles.club/api/v2/skindb";

if (localStorage.oauth_access_token !== undefined && (localStorage.oauth_expire_timestamp || 0) - Math.round(Date.now()/1000) > 1) {
	localStorage.oauth_cache_valid = "unknown";
	skindb.dropsheet.title("Validating Account");
	global.skindb.validateCallback = skindb.remote.osu.validateKey();
	skindb.validateCallback.then((status)=>{
		setTimeout(()=>{
			localStorage.oauth_cache_valid = JSON.stringify(status);
			skindb.dropsheet.hide();
			$("div.navigationbar li[action=link] a[action=oauth]").parent().hide();
		},200)
	});
	skindb.validateCallback.catch((error)=>{
		skindb.dropsheet.title("An Error Occurred.");
		console.log(error);
	})
} else if (localStorage.oauth_access_token != undefined && (localStorage.oauth_expire_timestamp || 0) - Math.round(Date.now()/1000) < 1) {
	// Send user to reconnect their account
	skindb.dropsheet.title("Redirecting to re-connect account");
	setTimeout(()=>{
		window.location.replace("oauth.html");
	},2000);
} else {
	$("div.navigationbar li[action=link] a[action=account]").parent().hide()
	$("div.navigationbar li[action=link] a[action=upload]").parent().hide()
	skindb.dropsheet.hide();
}

var validPages = [
	"home",
	"account",
	"skins",
	"elements",
	"search",
	"upload"
];
var selectedPage = "home";

// Check page
Object.entries(skindb.parameters()).forEach((parameter)=>{
	if (skindb.arrayContains(validPages,parameter[0])) {
		selectedPage = parameter[0];
	}
})

console.log("Current Page -> '"+selectedPage+"'");

if (global.skindb.validateCallback != undefined)
{	// Only do page if it's a valid login
	global.skindb.validateCallback.then(d => require(`./${selectedPage}.js`).listen(d));
	$("div.container").html(require(`./${selectedPage}.js`).html());
}