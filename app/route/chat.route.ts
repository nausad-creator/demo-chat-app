import { validate } from '../middleware/validate';
import { Router } from 'express';
import { version } from '../../config/appConfig';
import { createChat, getChats, readChats } from '../controllers/chatsController';
import { userValidator } from '../validations/user.validation';

export const routeChat = (app: Router) => {
	app.post(`${version}/chat/create-chat`, validate(userValidator.createChatValidate), createChat);
	app.post(`${version}/chat/update-read`, validate(userValidator.readChatValidate), readChats);
	app.post(`${version}/chat/get-chat`, validate(userValidator.getChatsValidate), getChats);
}
