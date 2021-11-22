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
	body: Joi.alternatives().try(
		Joi.object().keys({
			userEmail: Joi.string().allow(''),
			userMobile: Joi.string(),
		}),
		Joi.object().keys({
			userEmail: Joi.string(),
			userMobile: Joi.string().allow(''),
		})
	)
};

const verification = {
	body: Joi.object().keys({
		userID: Joi.string().required(),
		userOTP: Joi.string().required(),
	}),
};

const users = {
	body: Joi.object().keys({
		userID: Joi.string().required(),
		searchword: Joi.string().required().allow(''),
		sortBy: Joi.string().required().allow(''),
		pagesize: Joi.string().required(),
		page: Joi.string().required(),
	}),
};

const resetPassword = {
	body: Joi.object().keys({
		userID: Joi.string().required(),
		userPassword: Joi.string().required().custom(password),
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
	users,
	refreshTokens,
	forgotPassword,
	verification,
	resetPassword,
	verifyEmail,
};
