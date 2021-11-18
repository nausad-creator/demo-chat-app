const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
	body: Joi.object().keys({
		userFirstName: Joi.string().required(),
		userLastName: Joi.string().required(),
		userEmail: Joi.string().required().email(),
		userPassword: Joi.string().required().custom(password),
		userCountryCode: Joi.string().required(),
		userMobile: Joi.string().required(),
		userProfilePicture: Joi.string().required(),
		userDeviceType: Joi.string().required(),
		userDeviceID: Joi.string().required(),
		apiType: Joi.string().required(),
		apiVersion: Joi.string().required()
	}),
};

const login = {
	body: Joi.object().keys({
		userEmail: Joi.string().required(),
		userPassword: Joi.string().required(),
	}),
};

const logout = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required(),
	}),
};

const refreshTokens = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required(),
	}),
};

const forgotPassword = {
	body: Joi.object().keys({
		userEmail: Joi.string().email().required(),
	}),
};

const verification = {
	body: Joi.object().keys({
		userID: Joi.string().required(),
		userOTP: Joi.string().required(),
	}),
};

const resetPassword = {
	query: Joi.object().keys({
		token: Joi.string().required(),
	}),
	body: Joi.object().keys({
		password: Joi.string().required().custom(password),
	}),
};

const verifyEmail = {
	query: Joi.object().keys({
		token: Joi.string().required(),
	}),
};

module.exports = {
	register,
	login,
	logout,
	refreshTokens,
	forgotPassword,
	verification,
	resetPassword,
	verifyEmail,
};
