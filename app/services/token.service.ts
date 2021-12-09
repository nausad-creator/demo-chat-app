import { jwtConfig } from '../../config/appConfig';
import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import { tokenTypes } from '../../config/tokens';
import { Token } from './../model/token.model';
import { UserI } from '../interface';

const generateToken = (userId: string, expires: Moment, type: string, user: UserI, secret = jwtConfig.secret) => {
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

const saveToken = async (token: string, userId: string, expires: Moment, type: string) => {
	const tokenDoc = await Token.create({
		token,
		user: userId,
		expires: expires.toDate(),
		type,
	});
	return tokenDoc;
};

export const verifyToken = async (token: string, type: string) => {
	try {
		const payload = jwt.verify(token, jwtConfig.secret);
		const tokenDoc = await Token.findOne({ token, type, user: payload.sub }, 'user').lean().populate('user').exec();
		if (!tokenDoc) {
			return {
				code: 404,
				message: 'Not found',
				user: null
			}
		}
		return {
			code: 200,
			message: 'Token verified',
			user: tokenDoc
		}
	} catch (error) {
		return {
			code: 401,
			message: 'Unauthorized',
			user: null
		}
	}
};

export const generateAuthTokens = async (user: UserI) => {
	const accessTokenExpires = moment().add(jwtConfig.accessExpirationMinutes, 'minutes');
	const accessToken = generateToken(user._id.toString(), accessTokenExpires, tokenTypes.ACCESS, user);
	await saveToken(accessToken, user._id.toString(), accessTokenExpires, tokenTypes.ACCESS);
	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		}
	};
};
