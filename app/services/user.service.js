const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const shortid = require('shortid');
require('../model/user.model')
const mongoose = require('mongoose');
const User = mongoose.model('User');

const createUser = async (userBody) => {
	if (await User.isEmailTaken(userBody.userEmail)) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken.');
	}
	return User.create({
		userID: shortid.generate(),
		userFirstName: userBody?.userFirstName,
		userLastName: userBody?.userLastName,
		userEmail: userBody?.userEmail,
		userCountryCode: userBody?.userCountryCode,
		userMobile: userBody?.userMobile,
		userPassword: userBody?.userPassword,
		userProfilePicture: userBody?.userProfilePicture,
		userDeviceType: userBody?.userDeviceType,
		userDeviceID: userBody?.userDeviceID,
		apiType: userBody?.apiType,
		apiVersion: userBody?.apiVersion,
	});
};

const queryUsers = async (filter, options) => {
	const users = await User.paginate(filter, options);
	return users;
};

const getUserByuserID = async (userID) => {
	return User.findOne({ 'userID': userID });
};

const getUserByEmail = async (userEmail) => {
	return User.findOne({ 'userEmail': userEmail });
};

const getUserByEmailOrMobile = async (userEmail, userMobile) => {
	return User.findOne({ $or: [{ 'userEmail': userEmail }, { 'userMobile': userMobile }] });
};

const updateUserById = async (userID, userPassword) => {
	const user = await getUserByuserID(userID);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');
	}
	Object.assign(user, { userPassword });
	await user.save();
	return user;
};

const deleteUserById = async (userId) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	await user.remove();
	return user;
};

module.exports = {
	createUser,
	queryUsers,
	getUserByuserID,
	getUserByEmail,
	getUserByEmailOrMobile,
	updateUserById,
	deleteUserById,
};
