//  webpack.config.js 
module.exports = {
	entry: './app/index.js',
	output: {
		filename: 'bundle.js',
		path: __dirname
	},
	module: {
		loaders: [
			{test:/\.scss$/, loader:'style!css!sass', exclude: /node_modules/}
		]
	}
};