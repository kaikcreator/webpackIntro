//  webpack.config.js

var webpack = require('webpack');

module.exports = {
	entry: './app/index.js',
	output: {
		filename: 'bundle.js',
		path: __dirname
	},
	devtool: 'eval-source-map',
	module: {
		loaders: [
			{test:/\.js$/, loader:'babel-loader', exclude: /node_modules/, query: { presets: ['es2015'] } },
			{test:/\.scss$/, loader:'style-loader!css-loader!sass-loader', exclude: /node_modules/}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin()
	]
};