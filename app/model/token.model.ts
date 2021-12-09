import mongoose from 'mongoose';
import { tokenTypes } from '../../config/tokens';

const tokenSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true,
		index: true,
	},
	user: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'User',
		required: true,
	},
	type: {
		type: String,
		enum: [tokenTypes.REFRESH, tokenTypes.ACCESS],
		required: true,
	},
	expires: {
		type: Date,
		required: true,
	}
},
	{
		timestamps: true,
	});

/**
 * @typedef Token
 */
export const Token = mongoose.model('Token', tokenSchema);
