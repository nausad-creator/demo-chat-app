const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTk2OTY3ZmY4MWRlNGJmMjFhODM2MmEiLCJpYXQiOjE2Mzc0MDA3NzUsImV4cCI6MTYzNzQwNDM3NSwiaXNzIjoiY2hhdC1hcHAiLCJ0eXBlIjoiYWNjZXNzIiwiZGF0YSI6eyJ1c2VySUQiOiJsXzNla3BnOEMiLCJ1c2VyRmlyc3ROYW1lIjoiTmF1c2FkIiwidXNlckxhc3ROYW1lIjoiQW5zYXJpIiwidXNlckNvdW50cnlDb2RlIjoiKzkxIiwidXNlck1vYmlsZSI6Ijk4NDY2NjQ3NDUiLCJ1c2VyRW1haWwiOiJuYXVzYWQxMkBnbWFpbC5jb20iLCJ1c2VyUHJvZmlsZVBpY3R1cmUiOiJhLnBuZyIsInVzZXJEZXZpY2VUeXBlIjoid2ViIiwidXNlckRldmljZUlEIjoieHl6IiwiYXBpVHlwZSI6IndlYiIsImFwaVZlcnNpb24iOiIxLjAiLCJpc0VtYWlsVmVyaWZpZWQiOiJmYWxzZSIsImlzTW9iaWxlVmVyaWZpZWQiOiJmYWxzZSIsInVzZXJDcmVhdGVkT24iOiIyMDIxLTExLTE4VDE4OjA3OjEwLjQzNloiLCJpZCI6IjYxOTY5NjdmZjgxZGU0YmYyMWE4MzYyYSJ9fQ.Kt5Em5lOeFVaie5URI7wo-Bq2A04AjY6mgt_yEjZIn0"
const secretKey = "mySecretKeyThatNoOneKnowsInHisWildDream"
const userId = 'l_3ekpg8C'
const socket = io('http://localhost:8080/chat')

let clientJs = () => {

	let chatMessage = {
		senderId: userId,
		senderName: 'Nausad',
		receiverName: 'Ansari alex',
		receiverId: 'tPLpFIV24',
		createdOn: Date.now()
	}

	let userInfo = {
		senderId: userId,
		senderName: 'Nausad',
		receiverName: 'Ansari alex',
		receiverId: 'tPLpFIV24',
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

	$("#send1").on('click', function () {

		let messageText = $("#messageToSend").val()
		chatMessage.message = messageText;
		console.log(chatMessage);
		socket.emit("message", chatMessage)

	})

	socket.on('notify', (data) => {
		console.log(data + "  is clicked a button on his side")
	})

	$("#send2").on('click', function () {

		let groupMessageText = $("#groupChat").val()
		chatMessage.groupMessage = groupMessageText;
		socket.emit("group-chat", chatMessage)

	})

	$("#messageToSend").keypress(function () {

		socket.emit("typing", userInfo)

	})

	$("#send0").click(function () {

		socket.emit("click", chatMessage.senderName)

	})
}

//calling clientJs function
clientJs();