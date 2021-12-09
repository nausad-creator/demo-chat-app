import express from 'express';
const app = express();
import helmet from 'helmet';
import path from 'path';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import mongoose from 'mongoose';
import http from 'http';
import { jwtStrategy } from './config/passport';
import { Server } from 'socket.io';
import { mongooseConfig, port } from './config/appConfig';
import { logger } from './config/logger';
import { routeAuth } from './app/route/user.route';
import { routeChat } from './app/route/chat.route';
import { socketSet } from './app/library/socketLib';
import { errorHandler, notFoundHandler } from './app/middleware/errorHandler';
const server = http.createServer(app);
const io = new Server(server);

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
app.options('*');

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// including routes
routeAuth(app);
routeChat(app);

// send back a 404 error for any unknown api request
app.use(notFoundHandler, errorHandler);

mongoose.connect(mongooseConfig.url, mongooseConfig.options).then(() => {
	logger.info('Connected to MongoDB');
	server.listen(port, () => {
		// connecting to socket-io;
		socketSet(io);
		logger.info(`Listening to port ${port}`);
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

const unexpectedErrorHandler = (error: any) => {
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

export = app;