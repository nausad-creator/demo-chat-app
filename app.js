const express = require('express');
const app = express();
const helmet = require('helmet');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const logger = require('./config/logger');
const mongoose = require('mongoose');
const http = require('http');
const config = require('./config/appConfig');
const { jwtStrategy } = require('./config/passport');
const globalMiddleware = require('./app/middleware/errorHandler');
const socketLib = require('./app/library/socketLib')
const fs = require('fs');
const server = http.createServer(app);

// set security HTTP headers
app.use(helmet());
app.use(express.static(path.join(__dirname, 'client')));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

//including routes
const routePath = './app/route'
fs.readdirSync(routePath).forEach(function (file) {
	if (~file.indexOf('.js')) {
		logger.info(`Route ${file}`);
		const route = require(routePath + '/' + file);
		route.router(app);
	}
});

// send back a 404 error for any unknown api request
app.use(globalMiddleware.notFoundHandler);

// connecting to socket-io;
socketLib.socketSet(server);

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
	logger.info('Connected to MongoDB');
	server.listen(config.port, () => {
		logger.info(`Listening to port ${config.port}`);
	});
});

const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info('Server closed');
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error) => {
	logger.error(error);
	exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
	logger.info('SIGTERM received');
	if (server) {
		server.close();
	}
});

module.exports = app;