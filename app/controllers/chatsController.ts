import { catchAsync } from '../utils/catchAsync';
import { Request, Response } from 'express';
import { createChats, getChat, readChat } from '../services/chat.service';

export const createChat = catchAsync(async (req: Request, res: Response) => {
	try {
		const chat = await createChats(req.body);
		res.send([{
			message: chat?.message,
			status: chat?.status,
			code: chat?.code,
			data: chat?.data,
		}]);
	} catch (error) {
		res.send([{
			message: 'Opps, someting went wrong.',
			status: 'true',
			code: 500,
			error
		}]);
	}
});

export const getChats = catchAsync(async (req: Request, res: Response) => {
	try {
		const chats = await getChat(req.body);
		res.send([{
			message: 'Query users chats',
			status: 'true',
			code: 200,
			data: [chats]
		}]);
	} catch (error) {
		res.send([{
			message: 'Opps, someting went wrong.',
			status: 'true',
			code: 500,
			error
		}]);
	}
});

export const readChats = catchAsync(async (req: Request, res: Response) => {
	try {
		const chats = await readChat(req.body);
		res.send([{
			message: chats?.message,
			status: chats?.status,
			code: chats?.code,
			data: chats?.data,
		}]);
	} catch (error) {
		res.send([{
			message: 'Opps, someting went wrong.',
			status: 'true',
			code: 500,
			error
		}]);
	}
});