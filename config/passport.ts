import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { tokenTypes } from './tokens';
import { User } from '../app/model/user.model';
import { jwtConfig } from './appConfig';

const jwtOptions = {
	secretOrKey: jwtConfig.secret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: { type: string; sub: any; }, done: (arg0: any, arg1: boolean) => void) => {
	try {
		if (payload.type !== tokenTypes.ACCESS) {
			throw new Error('Invalid token type');
		}
		const user = await User.findById(payload.sub);
		if (!user) {
			return done(null, false);
		}
		done(null, user);
	} catch (error) {
		done(error, false);
	}
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
