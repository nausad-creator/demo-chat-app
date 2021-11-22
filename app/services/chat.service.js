const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const shortid = require('shortid');
const pick = require('../utils/pick');
const userService = require('./user.service');
require('../model/chat.model');
const mongoose = require('mongoose');
const Chat = mongoose.model('Chat');

const create_chat = async (userBody) => {
	try {
		const user = await userService.getUserByuserID(userBody.userID);
		const chat = await Chat.create({
			chatID: shortid.generate(),
			user: user._id,
			userID: userBody.userID,
			userName: userBody.userName,
			receiverUserID: userBody.receiverUserID,
			receiverName: userBody.receiverName,
			message: userBody.message,
			apiType: userBody.apiType,
			apiVersion: userBody.apiVersion,
		});
		user.chats = user.chats.concat(chat);
		await user.save();
		return {
			code: httpStatus.CREATED,
			status: 'true',
			message: 'Chat created successfully.',
			data: [chat]
		}
	} catch (err) {
		return {
			code: httpStatus.UNAUTHORIZED,
			status: 'false',
			message: err,
		};
	};
};

const get_chats = async (req_body) => {
	try {
		const options = pick(req_body, ['sortBy', 'pagesize', 'page']);
		const filter = {
			userID: req_body.userID, receiverUserID: req_body.receiverUserID,
			chatID: {
				$ne: '0' // $ne is the not-equal to 0 (zero) chatID data that we are fetching.
			},
			message: {
				$regex: req_body.searchword.trim(), // search query
				$options: "i" // for case-censetive
			}
		};
		const chats = await Chat.query_chats(filter, options);
		return chats;
	} catch (err) {
		return {
			code: httpStatus.NOT_FOUND,
			status: 'false',
			message: err,
		};
	};
};

const getChatByuserID = async (userID) => {
	return Chat.findOne({ 'userID': userID });
};

const delete_chat = async (userId) => {
	const user = await getChatByuserID(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	await user.remove();
	return user;
};

module.exports = {
	create_chat,
	get_chats,
	delete_chat
};