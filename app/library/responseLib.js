
const generateResponse = (message, status, data, token) => {
	let response = {
		message: message,
		status: status,
		data: data,
		token: token
	}
	return response
}

module.exports = {
	generateRes: generateResponse
}