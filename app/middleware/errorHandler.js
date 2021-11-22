const logger = require('../../config/logger');

const errorHandler = (err, _req, res, _next) => {
	logger.info(`Error ${err}`);
	res.send([{
		message: 'Global Error Handler Called.',
		status: 'true',
		data: null
	}])
}

const notFoundHandler = (_req, res, _next) => {
	logger.info('Global Not Found Handler Called!');
	res.send([{
		message: 'Route not found in the application.',
		status: 'true',
		data: null
	}]);
}

module.exports = {
	errorHandler: errorHandler,
	notFoundHandler: notFoundHandler
}