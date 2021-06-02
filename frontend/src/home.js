module.exports.html = () => {
	var namestring = ""
	return `
		<h1 class="title">welcome to osk!db</h1>
	`;
}
module.exports.listen = () => {
	console.log(`[home -> listen] called!`)
	$("h1.title").html(`welcome to osk!db ${global.skindb.usercache.username||""}`)
}