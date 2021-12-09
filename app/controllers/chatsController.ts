import { catchAsync } from '../utils/catchAsync';
import { Request, Response } from 'express';
import { createChats, getChat } from '../services/chat.service';

export const createChat = catchAsync(async (req: Request, res: Response) => {
	const chat = await createChats(req.body);
	res.send([chat]);
});

export const getChats = catchAsync(async (req: Request, res: Response) => {
	const chats = await getChat(req.body);
	res.send([{
		message: 'Query users chats',
		status: 'true',
		code: 200,
		data: [chats]
	}]);
});