module.exports.html = () => {
	return `
<div class="uploadStuff">
	<div class="uploadSkin">
		<h3>Upload Skin</h3>
		<fieldset>
			<legend>Description</legend>
			<textarea name="description"></textarea>
		</fieldset>
	</div>
	<div class="uploadElement">
		<h3>Upload Element</h3>
		<fieldset>
			<legend>Metadata *</legend>
				<label for="animationGroup">Animation Group</label>
			<input type="text" name="animationGroup">
			<label for="skinSource">Skin Source</label>
			<input type="text" name="skinSource"><br>
		</fieldset>
		<fieldset>
			<legend>Upload</legend>
			<input type="file" name="targetFile">
		</fieldset>
		<button action="uploadElement">Submit Element for Moderation</button>
	</div>
</div>`;
}

module.exports.listen = () => {

}