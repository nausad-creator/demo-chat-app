import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import shortid from 'shortid';
import { pick } from '../utils/pick';
import { Chat } from './../model/chat.model';
import { ChatInterface } from '../interface';

export const createChats = async (userBody: { fromUserId: string; toUserId: string; senderName: string; receiverName: string; message: string; date: string; time: string; time_in_ms: number; chatCreatedOn: string; }) => {
	try {
		const chat: ChatInterface = await Chat.create({
			chatID: shortid.generate(),
			fromUserId: userBody.fromUserId,
			toUserId: userBody.toUserId,
			senderName: `${userBody.senderName}`,
			receiverName: `${userBody.receiverName}`,
			message: userBody.message,
			date: userBody.date,
			time: userBody.time,
			time_in_ms: userBody.time_in_ms,
			chatCreatedOn: userBody.chatCreatedOn
		});
		return {
			code: httpStatus.CREATED,
			status: 'true',
			message: 'Chat created successfully.',
			data: [chat]
		}
	} catch (err) {
		return {
			code: httpStatus.UNAUTHORIZED,
			status: 'false',
			message: err,
		};
	};
};

export const getChat = async (reqbody: { userID: string; receiverUserID: string; searchword: string; }) => {
	try {
		const options = pick(reqbody, ['sortBy', 'pagesize', 'page']);
		const filter = {
			'$or': [
				{
					'$and': [
						{
							'toUserId': reqbody.userID
						}, {
							'fromUserId': reqbody.receiverUserID
						}
					]
				}, {
					'$and': [
						{
							'toUserId': reqbody.receiverUserID
						}, {
							'fromUserId': reqbody.userID
						}
					]
				},
			],
			message: {
				$regex: reqbody.searchword.trim(), // search query
				$options: "i" // for case-censetive
			}
		};
		let sort = '';
		if (options.sortBy) { // @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
			const sortingCriteria: string[] = [];
			options.sortBy.split(',').forEach((sortOption: any) => {
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

		const countPromise = Chat.countDocuments(filter).exec(); // @param {Object} [filter] - Mongo filter
		const docsPromise = Chat.find(filter).sort(sort).skip(skip).limit(limit).exec();

		return Promise.all([countPromise, docsPromise]).then((values) => {
			const [totalResults, results] = values;
			const totalPages = Math.ceil(totalResults / limit);
			const result = {
				results, // * @property {Document[]} results - Results found
				page, // @property {number} page - current page
				limit, // @property {number} limit - Maximum number of results per page
				totalPages, // @property {number} totalPages - Total number of pages
				totalResults, // @property {number} totalResults - Total number of documents
			};
			return Promise.resolve(result);
		});
	} catch (err) {
		return {
			code: httpStatus.NOT_FOUND,
			status: 'false',
			message: err,
		};
	};
};

export const readChat = async (reqbody: { userID: string; receiverUserID: string; }) => {
	try {
		// query
		const filter = {
			$and: [
				{
					'toUserId': reqbody.userID
				}, {
					'fromUserId': reqbody.receiverUserID
				}
			]
		};
		// update
		const update = {
			$set: { 'isRead': true }
		};
		// options
		const option = {
			"multi": true,  // update only one document
			"upsert": false  // insert a new document, if no existing document match the query
		}
		const updated = await Chat.updateMany(filter, update, option).exec();
		return {
			code: httpStatus.OK,
			status: 'true',
			message: 'Chat updated',
			data: updated
		};
	} catch (err) {
		return {
			code: httpStatus.NOT_FOUND,
			status: 'false',
			message: err,
		};
	};
};

export const deleteChat = async (userID: string) => {
	const user = await Chat.findOne({ 'userID': userID });
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	await user.remove();
	return user;
};