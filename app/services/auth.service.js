const httpStatus = require('http-status');
const userService = require('./user.service');
const Token = require('../model/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../../config/tokens');

const login = async (userEmail, userPassword) => {
	const user = await userService.getUserByEmail(userEmail);
	if (!user || !(await user.isPasswordMatch(userPassword))) {
		return {
			code: httpStatus.UNAUTHORIZED,
			status: 'false',
			message: 'Incorrect email or password.',
			data: []
		}
	}
	return {
		code: httpStatus.OK,
		status: 'true',
		message: 'User Found.',
		data: user
	};
};

const forgot = async (userEmail, userMobile) => {
	const user = await userService.getUserByEmailOrMobile(userEmail, userMobile);
	if (!user) {
		return {
			code: httpStatus.NOT_FOUND,
			status: 'false',
			message: 'No users found with this email or phone.',
		}
	}
	return {
		code: httpStatus.OK,
		status: 'true',
		userID: user.userID,
		userMobile: user.userMobile,
		userEmail: user.userEmail
	};
};

const verify = async (userID, userOTP) => {
	const user = await userService.getUserByuserID(userID);
	if (userOTP !== '1234') {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP.');
	}
	return user;
};

const resetPassword = async (userID, userPassword) => {
	try {
		return await userService.updateUserById(userID, userPassword);
	} catch (error) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed.');
	}
};

const logout = async (refreshToken) => {
	const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
	if (!refreshTokenDoc) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
	}
	await refreshTokenDoc.remove();
};

module.exports = {
	login,
	forgot,
	logout,
	verify,
	resetPassword,
};
