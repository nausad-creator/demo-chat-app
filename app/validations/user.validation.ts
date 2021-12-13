import Joi from 'joi';

export const createChatValidate = {
	body: Joi.object().keys({
		userID: Joi.string().required(),
		receiverUserID: Joi.string().required(),
		message: Joi.string().required()
	}),
};

export const getChatsValidate = {
	body: Joi.object().keys({
		userID: Joi.string().required(),
		receiverUserID: Joi.string().required(),
		searchword: Joi.string().required().allow(''),
		sortBy: Joi.string().required().allow(''),
		pagesize: Joi.string().required(),
		page: Joi.string().required(),
	})
};

export const readChatValidate = {
	body: Joi.object().keys({
		userID: Joi.string().required(),
		receiverUserID: Joi.string().required()
	})
};

export const userValidator = {
	createChatValidate,
	getChatsValidate,
	readChatValidate
}