const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const shortid = require('shortid');
const pick = require('../utils/pick');
require('../model/user.model')
const mongoose = require('mongoose');
const User = mongoose.model('User');

const createUser = async (userBody) => {
	if (await User.isEmailTaken(userBody.userEmail)) {
		return {
			code: httpStatus.BAD_REQUEST,
			status: 'false',
			message: 'Email already exist.'
		};
	}
	if (await User.isMobileTaken(userBody.userMobile)) {
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

const get_users = async (req_body) => {
	const options = pick(req_body, ['sortBy', 'pagesize', 'page']);
	const filter = {
		userID: {
			$nin: ['0', req_body.userID] // $ne is the not-equal to 0 (zero) userID data that we are fetching.
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
				regex: req_body.searchword.trim(), // search query
				options: "i"
			}
		}
	};
	const users = await User.query_users(filter, options);
	return {
		users
	};
};

const getUserByuserID = async (userID) => {
	return User.findOne({
		'userID': userID
	});
};

const getUserByEmail = async (userEmail) => {
	return User.findOne({
		'userEmail': userEmail
	});
};

const getUserByEmailOrMobile = async (userEmail, userMobile) => {
	return User.findOne({
		$or: [{
			'userEmail': userEmail
		}, {
			'userMobile': userMobile
		}]
	});
};

const deleteUserById = async (userId) => {
	const user = await getUserByuserID(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	await user.remove();
	return user;
};

module.exports = {
	createUser,
	get_users,
	getUserByuserID,
	getUserByEmail,
	getUserByEmailOrMobile,
	deleteUserById,
};