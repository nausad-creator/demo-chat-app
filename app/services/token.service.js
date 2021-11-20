const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../../config/appConfig');
require('../model/token.model')
const mongoose = require('mongoose');
const { tokenTypes } = require('../../config/tokens');
const Token = mongoose.model('Token');

const generateToken = (userId, expires, type, user, secret = config.jwt.secret) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix(),
		iss: 'chat-app',
		type,
		data: user
	};
	return jwt.sign(payload, secret)
};

const saveToken = async (token, userId, expires, type) => {
	const tokenDoc = await Token.create({
		token,
		user: userId,
		expires: expires.toDate(),
		type,
	});
	return tokenDoc;
};

const verifyToken = async (token, type) => {
	const payload = jwt.verify(token, config.jwt.secret);
	const tokenDoc = await Token.findOne({ token, type, user: payload.sub }, 'user').lean().populate('user').exec();
	if (!tokenDoc) {
		throw new Error('Token not found.');
	}
	return tokenDoc;
};

const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
	const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS, user);
	await saveToken(accessToken, user.id, accessTokenExpires, tokenTypes.ACCESS);
	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		}
	};
};

module.exports = {
	generateToken,
	saveToken,
	verifyToken,
	generateAuthTokens,
};
