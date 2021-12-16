import { catchAsync } from '../utils/catchAsync';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { registerUser, loginUser, forgot, getUsers, resetPasswordUser, verify, refreshAuthToken } from '../services/user.service';
import { generateAuthTokens } from '../services/token.service';

export const register = catchAsync(async (req: Request, res: Response) => {
	try {
		const user = await registerUser(req.body);
		res.send([user]);
	} catch (err) {
		res.send([{
			code: httpStatus.BAD_REQUEST,
			status: 'false',
			message: err,
		}]);
	};
});

export const login = catchAsync(async (req: Request, res: Response) => {
	try {
		const { userEmail, userPassword } = req.body;
		const user = await loginUser(userEmail, userPassword);
		if (user?.status === 'true') {
			const tokens = await generateAuthTokens(user.data);
			res.send([{
				message: 'User logged successfully.',
				status: 'true',
				code: user?.code,
				data: [user?.data],
				tokens
			}]);
		}
		if (user?.status === 'false') {
			res.send([{
				message: user?.message,
				status: user?.status,
				code: user?.code,
				data: user?.data
			}]);
		}
	} catch (err) {
		res.send([{
			code: httpStatus.BAD_REQUEST,
			status: 'false',
			message: err,
		}]);
	};
});

export const refreshAuth = catchAsync(async (req: Request, res: Response) => {
	try {
		const token = await refreshAuthToken(req.body.refreshToken);
		res.send([{
			token
		}]);
	} catch (err) {
		res.send([{
			code: httpStatus.BAD_REQUEST,
			status: 'false',
			message: err,
		}]);
	};
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
	try {
		const { userEmail, userMobile } = req.body;
		const data = await forgot(userEmail, userMobile);
		if (data?.status === 'true') {
			res.send([{
				message: 'OTP send successfully.',
				status: 'true',
				code: data?.code,
				data: [{
					userID: data?.userID,
					userMobile: data?.userMobile,
					userEmail: data?.userEmail
				}]
			}]);
		};
		if (data?.status === 'false') {
			res.send([{
				message: data?.message,
				status: data?.status,
				code: data?.code
			}]);
		};
	} catch (err) {
		res.send([{
			code: httpStatus.BAD_REQUEST,
			status: 'false',
			message: err,
		}]);
	};
});

export const verification = catchAsync(async (req: Request, res: Response) => {
	try {
		const { userID, userOTP } = req.body;
		const data = await verify(userID, userOTP);
		if (data?.status === 'true') {
			res.send([{
				message: 'OTP send successfully.',
				status: 'true',
				code: data?.code,
				data: [data.data]
			}]);
		};
		if (data?.status === 'false') {
			res.send([{
				message: data?.message,
				status: data?.status,
				code: data?.code
			}]);
		};
	} catch (err) {
		res.send([{
			code: httpStatus.BAD_REQUEST,
			status: 'false',
			message: err,
		}]);
	};
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
	try {
		const { userID, userPassword } = req.body;
		const data = await resetPasswordUser(userID, userPassword);
		if (data?.status === 'true') {
			res.send([{
				message: 'Password Reset successfully.',
				status: 'true',
				code: data?.code,
				data: [data.data]
			}]);
		};
		if (data?.status === 'false') {
			res.send([{
				message: data?.message,
				status: data?.status,
				code: data?.code
			}]);
		};
	} catch (err) {
		res.send([{
			code: httpStatus.BAD_REQUEST,
			status: 'false',
			message: err,
		}]);
	};
});

export const users = catchAsync(async (req: Request, res: Response) => {
	try {
		const data = await getUsers(req.body);
		if (data) {
			res.send([{
				message: 'Users found sucess.',
				status: 'true',
				code: 200,
				data: [data.result]
			}]);
		};
		if (!data) {
			res.send([{
				message: 'No users found.',
				status: 'false',
				code: 404
			}]);
		};
	} catch (err) {
		res.send([{
			code: httpStatus.BAD_REQUEST,
			status: 'false',
			message: err,
		}]);
	};
});

