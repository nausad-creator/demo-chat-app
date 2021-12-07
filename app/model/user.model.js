const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { toJSON } = require('./plugins');
const config = require('../../config/appConfig');

const userSchema = mongoose.Schema(
	{
		userID: {
			type: String,
			default: '0',
			index: true,
			unique: true
		},
		userFirstName: {
			type: String,
			required: true,
			trim: true,
		},
		userLastName: {
			type: String,
			required: true,
			trim: true,
		},
		userCountryCode: {
			type: String,
			required: true,
			default: '+91',
			trim: true,
		},
		userMobile: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 10
		},
		userEmail: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Invalid email');
				}
			},
		},
		userPassword: {
			type: String,
			required: true,
			trim: true,
			minlength: 8,
			validate(value) {
				if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
					throw new Error('Password must contain at least one letter and one number');
				}
			},
			private: true, // used by the toJSON plugin
		},
		userProfilePicture: {
			type: String,
			required: true,
			default: 'a.png',
			trim: true,
		},
		userDeviceType: {
			type: String,
			required: true,
			default: 'web',
			trim: true,
		},
		userDeviceID: {
			type: String,
			required: false,
			trim: true,
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
		isEmailVerified: {
			type: String,
			default: 'false',
		},
		isMobileVerified: {
			type: String,
			default: 'false',
		},
		userCreatedOn: {
			type: Date,
			default: Date.now()
		}
	},
	{
		timestamps: true,
	}
);
// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

userSchema.statics.isEmailTaken = async function (userEmail, excludeUserId) {
	const user = await this.findOne({ userEmail, _id: { $ne: excludeUserId } });
	return !!user;
};

userSchema.statics.isMobileTaken = async function (userMobile, excludeUserId) {
	const user = await this.findOne({ userMobile, _id: { $ne: excludeUserId } });
	return !!user;
};

userSchema.methods.isPasswordMatch = async function (userPassword) {
	const user = this;
	return bcrypt.compare(userPassword, user.userPassword);
};

userSchema.statics.query_users = async function (filter, options) {
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
	let docsPromise = this.aggregate(filter)
		.sort(sort)
		.skip(skip)
		.limit(limit);

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

userSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('userPassword')) {
		user.userPassword = await bcrypt.hash(user.userPassword, 8);
	}
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
