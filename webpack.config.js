const path = require('path');

module.exports = {
	mode: 'production', //development
	entry: './src/index.tsx',
	module: {
		rules: [
			{
				test: /.tsx?$/,
				exclude: /node_modules/,
				use: 'ts-loader',
			},
			{
				test: /.css?$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'index.js',
	},
};
