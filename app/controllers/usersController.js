const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const response = require('../library/responseLib');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
	const user = await userService.createUser(req.body);
	res.status(httpStatus.CREATED).send([response.generateRes('User created successfully.', 'true', [user], '')]);
});

const login = catchAsync(async (req, res) => {
	const { userEmail, userPassword } = req.body;
	const user = await authService.login(userEmail, userPassword);
	const tokens = await tokenService.generateAuthTokens(user);
	res.send([response.generateRes('User logged successfully.', 'true', [user], tokens)]);
});

const forgotPassword = catchAsync(async (req, res) => {
	const data = await tokenService.generateResetPasswordToken(req.body.userEmail);
	// await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
	res.send([response.generateRes('OTP send successfully.', 'true', [data]), '']);
});

const verification = catchAsync(async (req, res) => {
	const { userID, userOTP } = req.body;
	const user = await authService.verify(userID, userOTP);
	res.send([response.generateRes('OTP verify successfully.', 'true', [user]), '']);
});

const resend_otp = (req, res) => { };

const reset_password = (req, res) => { };

const logout = (req, res) => { };

module.exports = {
	register,
	login: login,
	forgotPassword,
	verification: verification,
	resend_otp: resend_otp,
	reset_password: reset_password,
	logout: logout
}

