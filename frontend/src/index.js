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

if (localStorage.oauth_access_token !== undefined && localStorage.oauth_expire_timestamp - Math.round(Date.now()/1000) > 1) {
	localStorage.oauth_cache_valid = "unknown";
	skindb.dropsheet.title("Validating Account");
	global.skindb.validateCallback = skindb.remote.osu.validateKey();
	skindb.validateCallback.then((status)=>{
		localStorage.oauth_cache_valid = JSON.stringify(status);
		skindb.dropsheet.hide();
	});
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

$("div.container").html(require(`./${selectedPage}.js`).html())
setTimeout(()=>{
	require(`./${selectedPage}.js`).listen()
},1500)