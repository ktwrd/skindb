const path = require('path');

module.exports = {
	mode: "development",
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname),
		filename: "bundle.js",
	},
	performance: {
		hints: "warning", // enum
		maxAssetSize: 1024288, // int (in bytes),
		maxEntrypointSize: 4097152, // int (in bytes)
		assetFilter: function(assetFilename) {
			// Function predicate that provides asset filenames
			return assetFilename.endsWith('.js');
		}
	},
}