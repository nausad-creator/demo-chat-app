import Joi from 'joi';
import { password, objectId } from './custom.validation';

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

export const getUserValidate = {
	params: Joi.object().keys({
		userId: Joi.string().custom(objectId),
	}),
};

export const updateUserValidate = {
	params: Joi.object().keys({
		userId: Joi.required().custom(objectId),
	}),
	body: Joi.object()
		.keys({
			email: Joi.string().email(),
			password: Joi.string().custom(password),
			name: Joi.string(),
		})
		.min(1),
};

export const deleteUserValidate = {
	params: Joi.object().keys({
		userId: Joi.string().custom(objectId),
	}),
};

export const userValidator = {
	createChatValidate,
	getChatsValidate,
	getUserValidate,
	updateUserValidate,
	deleteUserValidate
}