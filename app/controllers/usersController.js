const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');

const register = catchAsync(async (req, res) => {
	const user = await userService.createUser(req.body);
	res.status(httpStatus.CREATED).send([{
		message: 'User created successfully.',
		status: 'true',
		data: [user]
	}]);
});

const login = catchAsync(async (req, res) => {
	const { userEmail, userPassword } = req.body;
	const user = await authService.login(userEmail, userPassword);
	if (user?.status === 'true') {
		const tokens = await tokenService.generateAuthTokens(user.data);
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
});

const forgotPassword = catchAsync(async (req, res) => {
	const { userEmail, userMobile } = req.body;
	const data = await authService.forgot(userEmail, userMobile);
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
});

const verification = catchAsync(async (req, res) => {
	const { userID, userOTP } = req.body;
	const user = await authService.verify(userID, userOTP);
	res.send([{
		message: 'OTP verify successfully.',
		status: 'true',
		data: [user]
	}]);
});

const resetPassword = catchAsync(async (req, res) => {
	const user = await authService.resetPassword(req.body.userID, req.body.userPassword);
	res.send([{
		message: 'Password Reset successfully.',
		status: 'true',
		data: [user]
	}]);
});

const resend_otp = () => { };

const logout = () => { };

module.exports = {
	register,
	login,
	forgotPassword,
	verification,
	resetPassword,
	resend_otp: resend_otp,
	logout: logout
}

