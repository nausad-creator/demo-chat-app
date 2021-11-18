const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { toJSON, paginate } = require('./plugins');
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
userSchema.plugin(paginate);

userSchema.statics.isEmailTaken = async function (userEmail, excludeUserId) {
	const user = await this.findOne({ userEmail, _id: { $ne: excludeUserId } });
	return !!user;
};

userSchema.methods.isPasswordMatch = async function (userPassword) {
	const user = this;
	return bcrypt.compare(userPassword, user.userPassword);
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
