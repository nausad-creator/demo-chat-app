const catchAsync = require('../utils/catchAsync');
const { authService, tokenService } = require('../services');

const register = catchAsync(async (req, res) => {
	const user = await authService.register(req.body);
	res.send([user]);
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
	const data = await authService.verify(userID, userOTP);
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
});

const resetPassword = catchAsync(async (req, res) => {
	const { userID, userPassword } = req.body;
	const data = await authService.resetPassword(userID, userPassword);
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
});

const get_users = catchAsync(async (req, res) => {
	const data = await authService.get_users(req.body);
	if (data?.status === 'true') {
		res.send([{
			message: data?.message,
			status: data?.status,
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
});

const resend_otp = () => { };

const logout = () => { };

module.exports = {
	register,
	login,
	forgotPassword,
	get_users,
	verification,
	resetPassword,
	resend_otp: resend_otp,
	logout: logout
}

