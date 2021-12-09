class ApiError extends Error {
	statusCode: number;
	isOperational: boolean;
	constructor(statusCode: any, message: string, isOperational = true, stack = '') {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export = ApiError;
