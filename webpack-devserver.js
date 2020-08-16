'use strict';

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');
const open = require('open');

const compiler = Webpack(webpackConfig);
const port = 8080;

const server = new WebpackDevServer(compiler, {
	contentBase: 'demo',
	port
});

server.listen(port, '127.0.0.1', () => {
	const address = `http://localhost${port}`;
	console.log(`Server starts on ${address}`);
	open(address);
});
