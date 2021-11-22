const config = require('../../config/appConfig');
const controller = require('../controllers/chatsController');
const validate = require('../middleware/validate');
const userValidation = require('../validations/user.validation');

function route(app) {
	app.post(`${config.version}/chat/create-chat`, validate(userValidation.createChat), controller.create_chat);
	app.post(`${config.version}/chat/update`, validate(userValidation.updateUser));
	app.post(`${config.version}/chat/get-chat`, validate(userValidation.getChats), controller.get_chats);
}

module.exports = {
	router: route
}