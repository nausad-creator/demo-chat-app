import { authValidator } from '../validations/auth.validation';
import { Router } from 'express';
import { version } from '../../config/appConfig';
import { forgotPassword, login, refreshAuth, register, resetPassword, users, verification } from '../controllers/usersController';
import { validate } from '../middleware/validate';

export const routeAuth = (app: Router) => {
	app.post(`${version}/auth/signup`, validate(authValidator.register), register);
	app.post(`${version}/auth/login`, validate(authValidator.login), login);
	app.post(`${version}/auth/otp-verification`, validate(authValidator.verification), verification);
	app.post(`${version}/auth/forgot-password`, validate(authValidator.forgotPassword), forgotPassword);
	app.post(`${version}/auth/reset-password`, validate(authValidator.resetPassword), resetPassword);
	app.post(`${version}/auth/refresh-token`, validate(authValidator.refreshTokens), refreshAuth);
	app.post(`${version}/get/users`, validate(authValidator.users), users);
}