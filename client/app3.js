const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6InNoOFk5Q2ltIiwiaWF0IjoxNTc2NTE1MjkzMDE5LCJleHAiOjE1NzY2MDE2OTMsInN1YiI6ImF1dGhUb2tlbiIsImlzcyI6InRvZG9BcHAiLCJkYXRhIjp7InVzZXJJZCI6IjRZb0xpOE5DIiwiZmlyc3ROYW1lIjoiUmFodWwiLCJsYXN0TmFtZSI6Ikt1bWFyIiwibW9iaWxlTnVtYmVyIjo4Nzk3NzY3MDc2LCJlbWFpbCI6Im5hdXNhZDE4ODhAZ21haWwuY28ifX0.1b6BCJan16zInIzlr7LVRaYkMkfgihbM1-cwLpsBVjk"
const secretKey = "mySecretKeyThatNoOneKnowsInHisWildDream"
const userId = '4YoLi8NC'
const socket = io('http://localhost:8080')

let clientJs = () => {

	let userInfo = {
		senderId: userId,
		senderName: 'Rahul Kumar',
		receiverName: 'Nausad',
		receiverId: '3ulavQsv',
	}

	let chatMessage = {
		senderId: userId,
		senderName: 'Rahul Kumar',
		receiverName: 'Nausad',
		receiverId: '3ulavQsv',
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

	socket.on('all-onlineUsersList', (list) => {
		console.log('users list updated')
		console.log(list)
	})

	socket.on('come', (fullname) => {
		console.log(fullname + '  came online')
	})

	socket.on('leave', (fullname) => {
		console.log(fullname + '  go offline')
	})

	socket.on('message', (data) => {
		console.log(data.senderName + '  says: ' + data.groupMessage)
	})

	socket.on('notify', (data) => {
		console.log(data + "  is clicked a button on his side")
	})

	$("#send1").on('click', function () {

		let messageText = $("#messageToSend").val()
		chatMessage.message = messageText;
		socket.emit("chat-msg", chatMessage)

	})

	$("#send3").on('click', function () {

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