//  webpack.config.js 
module.exports = {
	entry: './app/index.js',
	output: {
		filename: 'bundle.js',
		path: __dirname
	},
	devtool: 'eval-source-map',
	module: {
		loaders: [
			{test:/\.js$/, loader:'babel', exclude: /node_modules/, query: { presets: ['es2015'] } },
			{test:/\.scss$/, loader:'style!css!sass', exclude: /node_modules/}
		]
	}
};