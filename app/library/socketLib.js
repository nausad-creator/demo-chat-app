const mongoose = require('mongoose');
const logger = require('../../config/logger');
const event = require('events').EventEmitter;
const { tokenService } = require('../services');
const { tokenTypes } = require('../../config/tokens');
const io = require('socket.io');

const socketSet = (server) => {
	const users = [];
	socket = io.listen(server);
	my_io = socket.of('/chat');
	socket.on('connection', (socket) => {
		logger.info('Connected to Socket-IO');
		socket.emit('verifyUser');
		socket.on('setUser', async (authToken) => {
			const user = await tokenService.verifyToken(authToken, tokenTypes.ACCESS);
			socket.room = 'edChat';
			socket.join('edChat')
			socket.userID = user.user.userID;
			socket.userName = `${user.user.userFirstName} ${user.user.userLastName}`;
			logger.info(`${user.user.userFirstName} ${user.user.userLastName} is online.`);
			users.push({ userID: user.user.userID, userName: socket.userName })
			socket.broadcast.to('edChat').emit('came_online', socket.userName);
			socket.to('edChat').broadcast.emit('online_users', users);
		});
		socket.on('message', (msg) => {
			my_io.emit(msg.receiverId, msg)
		});
		socket.on('disconnect', () => {
			socket.to('edChat').broadcast.emit('leave', socket.userName);
			users.splice(users.map(function (user) { return user.userID; }).indexOf(socket.userID), 1);
			socket.to('edChat').broadcast.emit('online_users', users);
			socket.leave('edChat');
		});
	});
}


module.exports = { socketSet }