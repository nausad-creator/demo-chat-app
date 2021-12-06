const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createChat = {
	body: Joi.object().keys({
		userID: Joi.string().required(),
		receiverUserID: Joi.string().required(),
		message: Joi.string().required()
	}),
};

const getChats = {
	body: Joi.object().keys({
		userID: Joi.string().required(),
		receiverUserID: Joi.string().required(),
		searchword: Joi.string().required().allow(''),
		sortBy: Joi.string().required().allow(''),
		pagesize: Joi.string().required(),
		page: Joi.string().required(),
	})
};

const getUser = {
	params: Joi.object().keys({
		userId: Joi.string().custom(objectId),
	}),
};

const updateUser = {
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

const deleteUser = {
	params: Joi.object().keys({
		userId: Joi.string().custom(objectId),
	}),
};

module.exports = {
	createChat,
	getChats,
	getUser,
	updateUser,
	deleteUser,
};
