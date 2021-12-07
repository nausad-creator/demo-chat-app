const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const config = require('../../config/appConfig');
const moment = require('moment');

const chatSchema = mongoose.Schema(
	{
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
			default: config.version,
			trim: true,
		},
		chatCreatedOn: {
			type: Date,
			default: Date.now()
		}
	},
	{
		timestamps: true,
	}
);
// add plugin that converts mongoose to json
chatSchema.plugin(toJSON);

chatSchema.statics.query_chats = async function (filter, options) {
	let sort = '';
	if (options.sortBy) { // @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
		const sortingCriteria = [];
		options.sortBy.split(',').forEach((sortOption) => {
			const [key, order] = sortOption.split(':');
			sortingCriteria.push((order.trim() === 'desc' ? '-' : '') + key.trim());
		});
		sort = sortingCriteria.join(' ');
	} else {
		sort = '-createdAt'; // default sortBy decs order
	}

	const limit = options.pagesize && parseInt(options.pagesize, 10) > 0 ? parseInt(options.pagesize, 10) : 10; // @param {number} [options.limit] - Maximum number of results per page (default = 10)
	const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1; // @param {number} [options.page] - Current page (default = 1)
	const skip = (page - 1) * limit;

	const countPromise = this.countDocuments(filter).exec(); // @param {Object} [filter] - Mongo filter
	let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

	docsPromise = docsPromise.exec();

	return Promise.all([countPromise, docsPromise]).then((values) => {
		const [totalResults, results] = values;
		const totalPages = Math.ceil(totalResults / limit);
		const result = {
			results, //* @property {Document[]} results - Results found
			page, // @property {number} page - current page
			limit, // @property {number} limit - Maximum number of results per page
			totalPages, // @property {number} totalPages - Total number of pages
			totalResults, // @property {number} totalResults - Total number of documents
		};
		return Promise.resolve(result);
	});
};

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
