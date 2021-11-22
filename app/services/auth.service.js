const httpStatus = require('http-status');
const userService = require('./user.service');
const Token = require('../model/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../../config/tokens');

const register = async (userBody) => {
	try {
		return await userService.createUser(userBody);
	} catch (err) {
		return {
			code: httpStatus.BAD_REQUEST,
			status: 'false',
			message: err,
		};
	};
};

const login = async (userEmail, userPassword) => {
	try {
		const user = await userService.getUserByEmail(userEmail);
		if (!user || !(await user.isPasswordMatch(userPassword))) {
			return {
				code: httpStatus.UNAUTHORIZED,
				status: 'false',
				message: 'Incorrect email or password.',
				data: []
			};
		};
		return {
			code: httpStatus.OK,
			status: 'true',
			message: 'User Found.',
			data: user
		};
	} catch (err) {
		return {
			code: httpStatus.UNAUTHORIZED,
			status: 'false',
			message: err,
		};
	};
};

const forgot = async (userEmail, userMobile) => {
	try {
		const user = await userService.getUserByEmailOrMobile(userEmail, userMobile);
		if (!user) {
			return {
				code: httpStatus.NOT_FOUND,
				status: 'false',
				message: 'No users found with this email or phone.',
			};
		};
		return {
			code: httpStatus.OK,
			status: 'true',
			userID: user.userID,
			userMobile: user.userMobile,
			userEmail: user.userEmail
		};
	} catch (err) {
		return {
			code: httpStatus.UNAUTHORIZED,
			status: 'false',
			message: err,
		};
	};
};

const verify = async (userID, userOTP) => {
	try {
		const user = await userService.getUserByuserID(userID);
		if (userOTP !== '1234') {
			return {
				code: httpStatus.BAD_REQUEST,
				status: 'false',
				message: 'Invalid OTP.',
			};
		};
		return {
			code: httpStatus.OK,
			status: 'true',
			message: 'OTP verify successfully.',
			data: user
		};
	} catch (err) {
		return {
			code: httpStatus.UNAUTHORIZED,
			status: 'false',
			message: err,
		};
	};
};

const resetPassword = async (userID, userNewPassword) => {
	try {
		const user = await userService.getUserByuserID(userID);
		if (!user) {
			return {
				code: httpStatus.NOT_FOUND,
				status: 'false',
				message: 'No users found.',
			};
		};
		Object.assign(user, {
			userPassword: userNewPassword
		});
		await user.save();
		return {
			code: httpStatus.OK,
			status: 'true',
			message: 'Password Reset successfully.',
			data: user
		};
	} catch (err) {
		return {
			code: httpStatus.UNAUTHORIZED,
			status: 'false',
			message: err,
		};
	};
};

const get_users = async (req_body) => {
	try {
		const users = await userService.get_users(req_body);
		return {
			code: httpStatus.OK,
			status: 'true',
			message: 'Users found success.',
			data: users.users
		};
	} catch (err) {
		return {
			code: httpStatus.UNAUTHORIZED,
			status: 'false',
			message: err,
		};
	};
};

const logout = async (refreshToken) => {
	const refreshTokenDoc = await Token.findOne({
		token: refreshToken,
		type: tokenTypes.REFRESH,
		blacklisted: false
	});
	if (!refreshTokenDoc) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
	}
	await refreshTokenDoc.remove();
};

module.exports = {
	register,
	login,
	get_users,
	forgot,
	logout,
	verify,
	resetPassword,
};