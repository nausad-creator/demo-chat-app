const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTk2OWEyYTEwZDkzN2QwOWM5MzgxMTAiLCJpYXQiOjE2MzczOTk3NDksImV4cCI6MTYzNzQwMzM0OSwiaXNzIjoiY2hhdC1hcHAiLCJ0eXBlIjoiYWNjZXNzIiwiZGF0YSI6eyJ1c2VySUQiOiJ0UExwRklWMjQiLCJ1c2VyRmlyc3ROYW1lIjoiTmF1c2FkIiwidXNlckxhc3ROYW1lIjoiQW5zYXJpIiwidXNlckNvdW50cnlDb2RlIjoiKzkxIiwidXNlck1vYmlsZSI6Ijk4NDYyNjQ3MjQiLCJ1c2VyRW1haWwiOiJuYXVzYWQzQGdtYWlsLmNvbSIsInVzZXJQcm9maWxlUGljdHVyZSI6ImEucG5nIiwidXNlckRldmljZVR5cGUiOiJ3ZWIiLCJ1c2VyRGV2aWNlSUQiOiJ4eXoiLCJhcGlUeXBlIjoid2ViIiwiYXBpVmVyc2lvbiI6IjEuMCIsImlzRW1haWxWZXJpZmllZCI6ImZhbHNlIiwiaXNNb2JpbGVWZXJpZmllZCI6ImZhbHNlIiwidXNlckNyZWF0ZWRPbiI6IjIwMjEtMTEtMThUMTg6MjI6NTEuODY0WiIsImlkIjoiNjE5NjlhMmExMGQ5MzdkMDljOTM4MTEwIn19.NDjF2OfOjIra7iGVR9eyqfI_5URQYUFsdo_mDm-3y48"
const secretKey = "mySecretKeyThatNoOneKnowsInHisWildDream"
const userId = 'tPLpFIV24'
const socket = io('http://localhost:8080/chat')

let clientJs = () => {

	let userInfo = {
		senderId: userId,
		senderName: 'Ansari alex',
		receiverName: 'Nausad',
		receiverId: 'l_3ekpg8C',
	}

	let chatMessage = {
		senderId: userId,
		senderName: 'Ansari alex',
		receiverName: 'Nausad',
		receiverId: 'l_3ekpg8C',
		createdOn: Date.now()
	}


	socket.on('verifyUser', (data) => {

		console.log('Server wants to verify the user')

		//sending authtoken to setUser event
		socket.emit('setUser', (authToken))
	})

	socket.on(userId, (data) => {
		//console.log(data)
		console.log("You have received a message from  " + data.senderName)
		console.log(data.message)
	})

	socket.on(userInfo.senderName, (userInfo) => {
		//console.log(userInfo)
		console.log(userInfo.senderName + '  is typing...')
	})

	socket.on('auth-error', (data) => {
		console.log(data)
	})

	socket.on('online_users', (list) => {
		console.log('users list updated')
		console.log(list)
	})

	socket.on('came_online', (fullname) => {
		console.log(fullname + '  came online')
	})

	socket.on('leave', (fullname) => {
		console.log(fullname + '  go offline')
	})

	socket.on('messages', (data) => {
		console.log(data.senderName + '  says: ' + data.groupMessage)
	})

	socket.on('notify', (data) => {
		console.log(data + "  is clicked a button on his side")
	})

	$("#send1").on('click', function () {

		let messageText = $("#messageToSend").val()
		chatMessage.message = messageText;
		console.log(chatMessage);
		socket.emit("message", chatMessage)

	})

	$("#send2").on('click', function () {

		let groupMessageText = $("#groupChat").val()
		chatMessage.groupMessage = groupMessageText;
		socket.emit("group-chat", chatMessage)

	})

	$("#messageToSend").keypress(function () {

		socket.emit("typing", userInfo)

	})
}

//calling clientJs function
clientJs();