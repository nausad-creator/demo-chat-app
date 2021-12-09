import { tokenTypes } from '../../config/tokens';
import shortid from 'shortid';
import { Chat } from './../model/chat.model';
import EventEmitter from 'events';
import { logger } from '../../config/logger';
import { Server } from 'socket.io';
import { verifyToken } from '../services/token.service';
const nodeEvent = new EventEmitter().setMaxListeners(15);

export const socketSet = (io: Server) => {

	const users: { userID: string; userName: string; }[] = [];

	const myio = io.of('/chat');

	myio.on('connection', (socket) => {

		logger.info('Connected to Socket-IO');

		setTimeout(() => {
			socket.emit('verifyUser', 'verify user by token!!!');
		}, 1000);

		socket.on('setUser', async (authToken) => {
			const user = await verifyToken(authToken, tokenTypes.ACCESS);
			if (user.code === 200) {
				socket.data.room = 'edChat';
				socket.join('edChat')
				socket.data.userID = user.user.user.userID;
				socket.data.userName = `${user.user.user.userFirstName} ${user.user.user.userLastName}`;
				logger.info(`${user.user.user.userFirstName} ${user.user.user.userLastName} is online.`);
				users.push({ userID: user.user.user.userID, userName: socket.data.userName })
				socket.broadcast.to('edChat').emit('came_online', socket.data.userName); // fired event accept me
				io.of('/chat').emit('online_users', users); // sending to all clients in namespace '/chat', include sender
			}
			if (user.code !== 200) {
				// The socket was forcefully disconnected with socket.disconnect
				socket.disconnect(true);
			}
		});

		socket.on('typing...$', (info) => {
			myio.emit(`${JSON.parse(info).toUserId} is typing...$`, info);
		});

		socket.on('message', (msg) => {
			myio.emit(JSON.parse(msg).toUserId, msg);
			setTimeout(() => {
				nodeEvent.emit('save', JSON.parse(msg));
			});
		});

		socket.on("logout", () => {
			// The socket was forcefully disconnected with socket.disconnect
			socket.disconnect(true);
		});

		// called when browser closed or enternet connection disables!!!
		socket.on('disconnect', (reason) => {
			// if (reason === "io server disconnect") {
			// 	// the disconnection was initiated by the server, you need to reconnect manually
			// 	socket.connect();
			// }
			socket.broadcast.to('edChat').emit('leave', socket.data.userName);
			users.splice(users.map((user) => user.userID).indexOf(socket.data.userID), 1);
			io.of('/chat').emit('online_users', users); // sending to all clients in namespace '/chat', include sender
			socket.leave('edChat');
		});
	});

	// async saving messages
	nodeEvent.on('save', async (userBody) => {
		await Chat.create({
			chatID: shortid.generate(),
			fromUserId: userBody.fromUserId,
			toUserId: userBody.toUserId,
			senderName: `${userBody.senderName}`,
			receiverName: `${userBody.receiverName}`,
			message: userBody.message,
			date: userBody.date,
			time: userBody.time,
			time_in_ms: userBody.time_in_ms,
			chatCreatedOn: userBody.chatCreatedOn
		});
	});
};