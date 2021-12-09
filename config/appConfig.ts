export const env = 'development';
export const port = 8080;
export const version = '/api/v1';
export const mongooseConfig = {
	url: 'mongodb://127.0.0.1:27017/demo-chat-app',
	options: {
		autoIndex: false, // Don't build indexes
		maxPoolSize: 10, // Maintain up to 10 socket connections
		serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
		socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
		family: 4 // Use IPv4, skip trying IPv6
	},
};
export const jwtConfig = {
	secret: 'some_random_jwt_token',
	accessExpirationMinutes: 1800,
	refreshExpirationDays: '2d',
	resetPasswordExpirationMinutes: 30,
	verifyEmailExpirationMinutes: 30,
};
export const email = {
	smtp: {
		host: '@host',
		port: '@port',
		auth: {
			user: '@username',
			pass: '@password',
		},
	},
	from: '@from',
};
