import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import shortid from 'shortid';
import { pick } from '../utils/pick';
import bcrypt from 'bcrypt';
import { User } from './../model/user.model';
import { Token } from '../model/token.model';
import { tokenTypes } from '../../config/tokens';

export const registerUser = async (userBody: { userEmail: string; userMobile: string; userFirstName: string; userLastName: string; userCountryCode: string; userPassword: string; userProfilePicture: string; userDeviceType: string; userDeviceID: string; apiType: string; apiVersion: string; }) => {
	if (!!await User.findOne({ "userEmail": userBody.userEmail })) {
		return {
			code: httpStatus.BAD_REQUEST,
			status: 'false',
			message: 'Email already exist.'
		};
	}
	if (!!await User.findOne({ "userMobile": userBody.userMobile })) {
		return {
			code: httpStatus.BAD_REQUEST,
			status: 'false',
			message: 'Mobile already exist.'
		};
	}
	return {
		code: httpStatus.CREATED,
		status: 'true',
		message: 'User created successfully.',
		data: [await User.create({
			userID: shortid.generate(),
			userFirstName: userBody.userFirstName,
			userLastName: userBody.userLastName,
			userEmail: userBody.userEmail,
			userCountryCode: userBody.userCountryCode,
			userMobile: userBody.userMobile,
			userPassword: userBody.userPassword,
			userProfilePicture: userBody.userProfilePicture,
			userDeviceType: userBody.userDeviceType,
			userDeviceID: userBody.userDeviceID,
			apiType: userBody.apiType,
			apiVersion: userBody.apiVersion,
		})]
	}
};

export const loginUser = async (userEmail: string, userPassword: string) => {
	try {
		const user = await User.findOne({ 'userEmail': userEmail });
		if (!user || !(await bcrypt.compare(userPassword, user.userPassword))) {
			return {
				code: httpStatus.UNAUTHORIZED,
				status: 'false',
				message: 'Incorrect email or password.',
				data: []
			};
		};
		return {
			code: httpStatus.OK,
			status: 'true',
			message: 'User Found.',
			data: user
		};
	} catch (err) {
		return {
			code: httpStatus.UNAUTHORIZED,
			status: 'false',
			message: err,
		};
	};
};

export const forgot = async (userEmail: string, userMobile: string) => {
	try {
		const user = await User.findOne({
			$or: [{
				'userEmail': userEmail
			}, {
				'userMobile': userMobile
			}]
		});
		if (!user) {
			return {
				code: httpStatus.NOT_FOUND,
				status: 'false',
				message: 'No users found with this email or phone.',
			};
		};
		return {
			code: httpStatus.OK,
			status: 'true',
			userID: user.userID,
			userMobile: user.userMobile,
			userEmail: user.userEmail
		};
	} catch (err) {
		return {
			code: httpStatus.UNAUTHORIZED,
			status: 'false',
			message: err,
		};
	};
};

export const verify = async (userID: string, userOTP: string) => {
	try {
		const user = await User.findOne({
			'userID': userID
		});
		if (userOTP !== '1234') {
			return {
				code: httpStatus.BAD_REQUEST,
				status: 'false',
				message: 'Invalid OTP.',
			};
		};
		return {
			code: httpStatus.OK,
			status: 'true',
			message: 'OTP verify successfully.',
			data: user
		};
	} catch (err) {
		return {
			code: httpStatus.UNAUTHORIZED,
			status: 'false',
			message: err,
		};
	};
};

export const resetPasswordUser = async (userID: string, userNewPassword: string) => {
	try {
		const user = await User.findOne({
			'userID': userID
		});
		if (!user) {
			return {
				code: httpStatus.NOT_FOUND,
				status: 'false',
				message: 'No users found.',
			};
		};
		Object.assign(user, {
			userPassword: userNewPassword
		});
		await user.save();
		return {
			code: httpStatus.OK,
			status: 'true',
			message: 'Password Reset successfully.',
			data: user
		};
	} catch (err) {
		return {
			code: httpStatus.UNAUTHORIZED,
			status: 'false',
			message: err,
		};
	};
};

export const getUsers = async (reqbody: { userID: string; searchword: string; }) => {
	const options = pick(reqbody, ['sortBy', 'pagesize', 'page']);
	const aggregate = [
		{ // stage 1
			$match: {
				userID: {
					$nin: ['0', reqbody.userID]
				},
				$expr: {

					$regexMatch: {
						input: {
							$concat: [
								"$userFirstName",
								" ",
								"$userLastName"
							]
						},
						regex: reqbody.searchword.trim(), // search query
						options: "i"
					}
				}
			}
		},
		{ // stage 2
			$project: {
				"userDeviceType": 0,
				"userDeviceID": 0,
				"apiType": 0,
				"apiVersion": 0,
				"userPassword": 0,
				"createdAt": 0,
				"updatedAt": 0,
				"__v": 0,
			}
		},
		{
			$lookup: { // stage 3
				from: "chats",
				let: {
					loginUserID: reqbody.userID,
					receiverID: "$userID"
				},
				pipeline: [
					{
						$facet: {
							"recent_chat": [ // stage 3 - (1)
								{
									$match: {
										$expr: {
											$or: [
												{
													$and: [
														{ $eq: ["$toUserId", "$$loginUserID"] },
														{ $eq: ["$fromUserId", "$$receiverID"] }
													]
												}, {
													$and: [
														{ $eq: ["$toUserId", "$$receiverID"] },
														{ $eq: ["$fromUserId", "$$loginUserID"] },
													]
												},
											],
										}
									},
								},
								{ $sort: { createdAt: -1 } },
								{ $limit: 1 }, // for showing latest chat only
								{
									$project: {
										"chatID": true, // or 1
										"toUserId": true,
										"fromUserId": true,
										"senderName": true,
										"receiverName": true,
										"message": true,
										"isRead": true,
										"date": true,
										"time": true,
										"time_in_ms": true,
										"_id": false, // don't want ~id
										"date_with_time": { $concat: ["$date", " ", "$time"] } // new key added - date_with_time
									}
								},
							],
							"unread": [ // stage 3 - (2)
								{
									$match: {
										$expr: {
											$and: [
												{ $eq: ["$toUserId", "$$loginUserID"] },
												{ $eq: ["$fromUserId", "$$receiverID"] }
											]
										}
									},
								},
								{
									$match: {
										'isRead': false
									}
								},
								{
									$project: {
										"chatID": true, // or 1
										"toUserId": true,
										"fromUserId": true,
										"senderName": true,
										"receiverName": true,
										"message": true,
										"isRead": true,
										"date": true,
										"time": true,
										"time_in_ms": true,
										"_id": false, // don't want ~id
										"date_with_time": { $concat: ["$date", " ", "$time"] } // new key added - date_with_time
									}
								},
							]
						}
					},
				],
				as: "chats"
			}
		},
	]

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

	const countPromise = User.countDocuments(aggregate).exec(); // @param {Object} [filter] - Mongo filter
	const docsPromise = User.aggregate(aggregate)
		.sort(sort)
		.skip(skip)
		.limit(limit).exec();

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
		return Promise.resolve({ result });
	});
};

export const deleteUser = async (userID: string) => {
	const user = await User.findOne({
		'userID': userID
	});
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	await user.remove();
	return user;
};

export const logout = async (refreshToken: string) => {
	const refreshTokenDoc = await Token.findOne({
		token: refreshToken,
		type: tokenTypes.REFRESH,
		blacklisted: false
	});
	if (!refreshTokenDoc) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
	}
	await refreshTokenDoc.remove();
};