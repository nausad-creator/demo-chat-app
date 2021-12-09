import Joi from 'joi';
import { password } from './custom.validation';

export const register = {
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

export const login = {
	body: Joi.object().keys({
		userEmail: Joi.string().required(),
		userPassword: Joi.string().required(),
	}),
};

export const logout = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required(),
	}),
};

export const refreshTokens = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required(),
	}),
};

export const forgotPassword = {
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

export const verification = {
	body: Joi.object().keys({
		userID: Joi.string().required(),
		userOTP: Joi.string().required(),
	}),
};

export const users = {
	body: Joi.object().keys({
		userID: Joi.string().required(),
		searchword: Joi.string().required().allow(''),
		sortBy: Joi.string().required().allow(''),
		pagesize: Joi.string().required(),
		page: Joi.string().required(),
	}),
};

export const resetPassword = {
	body: Joi.object().keys({
		userID: Joi.string().required(),
		userPassword: Joi.string().required().custom(password),
	}),
};

export const verifyEmail = {
	query: Joi.object().keys({
		token: Joi.string().required(),
	}),
};

export const authValidator = {
	register,
	login,
	forgotPassword,
	resetPassword,
	verification,
	users,
	verifyEmail,
	logout
}