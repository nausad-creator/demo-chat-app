const logger = require('../../config/logger');
const { tokenService } = require('../services');
const { tokenTypes } = require('../../config/tokens');
const shortid = require('shortid');
const Chat = require('./../model/chat.model');
const EventEmitter = require('events');
const node_event = new EventEmitter().setMaxListeners(15);

const socketSet = (io) => {

	const users = [];

	my_io = io.of('/chat');

	my_io.on('connection', (socket) => {

		logger.info('Connected to Socket-IO');

		setTimeout(() => {
			socket.emit('verifyUser', 'verify user by token!!!');
		}, 1000);

		socket.on('setUser', async (authToken) => {
			const user = await tokenService.verifyToken(authToken, tokenTypes.ACCESS);
			if (user.code === 200) {
				socket.room = 'edChat';
				socket.join('edChat')
				socket.userID = user.user.user.userID;
				socket.userName = `${user.user.user.userFirstName} ${user.user.user.userLastName}`;
				logger.info(`${user.user.user.userFirstName} ${user.user.user.userLastName} is online.`);
				users.push({ userID: user.user.user.userID, userName: socket.userName })
				socket.broadcast.to('edChat').emit('came_online', socket.userName); // fired event accept me
				io.of('/chat').emit('online_users', users); // sending to all clients in namespace '/chat', include sender
			}
		});

		socket.on('typing', (userInfo) => {
			my_io.emit(userInfo.receiverName, userInfo);
		});

		socket.on('message', (msg) => {
			my_io.emit(JSON.parse(msg).toUserId, msg);
			setTimeout(() => {
				node_event.emit('save', JSON.parse(msg));
			});
		});

		socket.on("logout", () => {
			// The socket was forcefully disconnected with socket.disconnect
			socket.disconnect(true);
		});

		// called when browser closed or enternet connection disables!!!
		socket.on('disconnect', (reason) => {
			if (reason === "io server disconnect") {
				// the disconnection was initiated by the server, you need to reconnect manually
				socket.connect();
			}
			socket.broadcast.to('edChat').emit('leave', socket.userName);
			users.splice(users.map(function (user) { return user.userID; }).indexOf(socket.userID), 1);
			io.of('/chat').emit('online_users', users); // sending to all clients in namespace '/chat', include sender
			socket.leave('edChat');
		});
	});

	// async saving messages
	node_event.on('save', async (userBody) => {
		await Chat.create({
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
	});
}


module.exports = { socketSet }