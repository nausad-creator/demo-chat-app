const logger = require('../../config/logger');
const response = require('../library/responseLib')

const errorHandler = (err, _req, res, _next) => {
	logger.info(`Error ${err}`);
	res.send(response.generateRes(true, 'Global Error Handler Called', 500, null))
}

const notFoundHandler = (_req, res, _next) => {
	logger.info('Global Not Found Handler Called!');
	res.send(response.generateRes(true, 'Route not found in the application', 404, null));
}

module.exports = {
	errorHandler: errorHandler,
	notFoundHandler: notFoundHandler
}