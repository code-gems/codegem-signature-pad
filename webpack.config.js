const path = require('path');

module.exports = {
	entry: './src/codegems-signature-pad.ts',
	devtool: 'inline-source-map',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				include: [path.resolve(__dirname, 'src')],
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	output: {
		filename: 'codegems-signature-pad-bundle.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'umd'
	},
	devServer: {
		contentBase: 'demo',
		open: true
		// contentBase: path.join(__dirname, "demo"),
		// compress: true,
		// port: 8089
	}
};
