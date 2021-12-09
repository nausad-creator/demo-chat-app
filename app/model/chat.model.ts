import mongoose from 'mongoose';
import moment from 'moment';
import { version } from '../../config/appConfig';

const chatSchema = new mongoose.Schema({
	chatID: {
		type: String,
		index: true,
		unique: true
	},
	toUserId: {
		type: String,
		index: true,
		required: true,
		trim: true,
	},
	fromUserId: {
		type: String,
		index: true,
		required: true,
		trim: true,
	},
	senderName: {
		type: String,
		required: true,
		trim: true,
	},
	receiverName: {
		type: String,
		required: true,
		trim: true,
	},
	message: {
		type: String,
		required: true,
		trim: true,
	},
	isRead: {
		type: Boolean,
		default: false,
		trim: true,
	},
	date: {
		type: String,
		default: moment().format('YYYY-MM-DD'),
		required: true,
		trim: true
	},
	time: {
		type: String,
		default: moment().format('HH:mm:ss'),
		required: true,
		trim: true
	},
	time_in_ms: {
		type: Number,
		default: new Date().getTime(),
		required: true,
		trim: true
	},
	apiType: {
		type: String,
		required: true,
		default: 'web',
		trim: true,
	},
	apiVersion: {
		type: String,
		required: true,
		default: version,
		trim: true,
	},
	chatCreatedOn: {
		type: Date,
		default: Date.now()
	}
},
	{
		timestamps: true,
	});

export const Chat = mongoose.model('Chat', chatSchema);
