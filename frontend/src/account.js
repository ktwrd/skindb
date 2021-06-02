module.exports.html = () => {
	return `
<div class="page_Account BasicInformationCard">
	<ul>
		<li data="avatar_url" action="dynamic"  type="profileImage" data="avatar_url">
			<img src="https://via.placeholder.com/300" class="ProfilePicture" />
		</li>
		<li class="CenterAlign" action="dynamic"  type="profileLink" data="username" link="id">
			
		</li>
		<li class="CenterAlign" action="dynamic" data="statistics.pp" type="bigNumber" suffix="pp">
			
		</li>
		<li class="ProfileInformation">
			<table>
				<tr>
					<th>Playtime</th>
					<td action="dynamic" type="hourminFormat" data="statistics.play_time"></td>
				</tr>
				<tr>
					<th>Country Rank</th>
					<td action="dynamic" type="bigNumber" data="statistics.country_rank" prefix="#"></td>
				</tr>
				<tr>
					<th>Global Rank</th>
					<td action="dynamic" type="bigNumber" data="statistics.global_rank" prefix="#"></td>
				</tr>
				<tr>
					<th>Ranked Score</th>
					<td action="dynamic" type="bigNumber" data="statistics.ranked_score"></td>
				</tr>
				<tr>
					<th>Accuracy</th>
					<td action="dynamic" type="percentage" data="statistics.hit_accuracy"></td>
				</tr>
				<tr>
					<th>Play Count</th>
					<td action="dynamic" type="bigNumber" data="statistics.play_count"></td>
				</tr>
				<tr>
					<th>Total Score</th>
					<td action="dynamic" type="bigNumber" data="statistics.total_score"></td>
				</tr>
				<tr>
					<th>Highest Combo</th>
					<td action="dynamic" type="bigNumber" data="statistics.maximum_combo"></td>
				</tr>
			</table>
		</li>
	</ul>
</div>`;
}

module.exports.listen = () => {
	skindb.validateCallback.then((status)=>{
		module.exports.SetDynamicValues(status);
		console.log(`[page -> account -> listen] Hello!`);
	})
}
function reverse(s){
    return s.split("").reverse().join("");
}
function splitEveryNth(str)
{
	return reverse(reverse(str).match(/.{1,3}/g).join(','));
}
module.exports.SetDynamicValues = (AccountData) =>
{
	$("div.page_Account.BasicInformationCard [action=dynamic]").toArray().forEach((DynamicObject) =>
	{
		let Type = DynamicObject.attributes.type == undefined ? "text" : DynamicObject.attributes.type.value;
		let Data = DynamicObject.attributes.data == undefined ? "DONOTPROCESS": DynamicObject.attributes.data.value;
		let Prefix = DynamicObject.attributes.prefix == undefined ? "": DynamicObject.attributes.prefix.value;
		let Suffix = DynamicObject.attributes.suffix == undefined ? "": DynamicObject.attributes.suffix.value;
		let Link   = DynamicObject.attributes.link == undefined   ? "": DynamicObject.attributes.link.value;
		if (Data === "DONOTPROCESS") return;
		console.log(Type,Data,Prefix,Suffix);
		switch (Type.toLowerCase())
		{
			case "text":
				var Content = Prefix+eval(`AccountData.${Data}`).toString()+Suffix;
				console.log(Content);
				DynamicObject.innerHTML = Content;
				break;
			case "bignumber":
				var Content = Prefix+(splitEveryNth(parseFloat(eval(`AccountData.${Data}`)).toFixed(0).toString()))+Suffix;
				console.log(Content);
				DynamicObject.innerHTML = Content;
				break;
			case "percentage":
				var Content = Prefix+(parseFloat(eval(`AccountData.${Data}`)).toFixed(2).toString())+"%"+Suffix;
				console.log(Content);
				DynamicObject.innerHTML = Content;
				break;
			case "hourminformat":
				var totalSeconds = eval(`AccountData.${Data}`);
				let hours = Math.floor(totalSeconds / 3600);
				totalSeconds %= 3600;
				let minutes = Math.floor(totalSeconds / 60);
				var Content = `${Prefix}${hours}hr ${minutes}m${Suffix}`;
				console.log(Content);
				DynamicObject.innerHTML = Content;
				break;
			case "profileimage":
				var Content = `${Prefix}${eval("AccountData."+Data)}${Suffix}`;
				console.log(Content);
				DynamicObject.firstElementChild.src = Content; 
				break;
			case "profilelink":
				if (Link != "" && Link == "id")
				{
					var Content = `<a href="https://osu.ppy.sh/users/${eval("AccountData."+Link)}">${eval("AccountData."+Data)}</a>`;
					console.log(Content);
					DynamicObject.innerHTML = Content;
				}
				break;
		}
	})
}