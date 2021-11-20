const config = require('../../config/appConfig');
const controller = require('../controllers/usersController');
const validate = require('../middleware/validate');
const authValidation = require('../validations/auth.validation');

function route(app) {
	app.post(`${config.version}/auth/signup`, validate(authValidation.register), controller.register)
	app.post(`${config.version}/auth/login`, validate(authValidation.login), controller.login)
	app.post(`${config.version}/auth/otp-verification`, validate(authValidation.verification), controller.verification)
	app.post(`${config.version}/auth/forgot-password`, validate(authValidation.forgotPassword), controller.forgotPassword)
	app.post(`${config.version}/auth/reset-password`, validate(authValidation.resetPassword), controller.resetPassword)
	app.post(`${config.version}/auth/resend-otp`, controller.resend_otp)
	app.post(`${config.version}/auth/logout`, controller.logout)
}

module.exports = {
	router: route
}