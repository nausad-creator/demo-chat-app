import { logger } from "../../config/logger";
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

export const errorHandler = (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
	logger.info(`Error ${err}`);
	res.send([{
		message: 'Global Error Handler Called.',
		status: 'true',
		data: null
	}])
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
	logger.info('Global Not Found Handler Called!');
	res.send([{
		message: 'Route not found in the application.',
		status: 'true',
		data: null
	}]);
}