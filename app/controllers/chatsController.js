const catchAsync = require('../utils/catchAsync');
const { chatService } = require('../services');

const create_chat = catchAsync(async (req, res) => {
	const chat = await chatService.create_chat(req.body);
	res.send([chat]);
});

const get_chats = catchAsync(async (req, res) => {
	const chats = await chatService.get_chats(req.body);
	res.send([{
		message: 'Query users chats',
		status: 'true',
		code: 200,
		data: [chats]
	}]);
});

module.exports = {
	create_chat,
	get_chats
}

