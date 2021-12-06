const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const shortid = require('shortid');
const pick = require('../utils/pick');
const userService = require('./user.service');
const Chat = require('./../model/chat.model');

const create_chat = async (userBody) => {
	try {
		const sender = await userService.getUserByuserID(userBody.fromUserId);
		const receiver = await userService.getUserByuserID(userBody.toUserId);
		const chat = await Chat.create({
			chatID: shortid.generate(),
			fromUserId: userBody.fromUserId,
			toUserId: userBody.toUserId,
			senderName: `${userBody.senderName}`,
			receiverName: `${userBody.receiverName}`,
			message: userBody.message,
			date: userBody.date,
			time: userBody.time,
			chatCreatedOn: userBody.chatCreatedOn
		});
		sender.chats = chat;
		receiver.chats = chat;
		await sender.save();
		await receiver.save();
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
			'$or': [
				{
					'$and': [
						{
							'toUserId': req_body.userID
						}, {
							'fromUserId': req_body.receiverUserID
						}
					]
				}, {
					'$and': [
						{
							'toUserId': req_body.receiverUserID
						}, {
							'fromUserId': req_body.userID
						}
					]
				},
			],
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