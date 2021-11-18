const express = require('express');
const helmet = require('helmet');
const logger = require('./config/logger');
const globalMiddleware = require('./app/middleware/errorHandler');
const fs = require('fs')
const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

//including routes
const routePath = './app/route'
fs.readdirSync(routePath).forEach(function (file) {
	if (~file.indexOf('.js')) {
		logger.info(`Route ${file}`);
		const route = require(routePath + '/' + file)
		route.router(app)
	}
});
// send back a 404 error for any unknown api request
app.use(globalMiddleware.notFoundHandler)

module.exports = app;