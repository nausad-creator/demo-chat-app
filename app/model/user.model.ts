import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { version } from '../../config/appConfig';

const userSchema = new mongoose.Schema({
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
		validate(value: string) {
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
		validate(value: any) {
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
	userStatus: {
		type: String,
		default: 'Offline'
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
		default: version,
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
		toJSON: {
			transform: (doc, ret) => {
				ret.id = ret._id.toString();
				delete ret._id;
				delete ret.__v;
				delete ret.createdAt;
				delete ret.updatedAt;
			},
		},
		timestamps: true,
	});

userSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('userPassword')) {
		user.userPassword = await bcrypt.hash(user.userPassword, 8);
	}
	next();
});

export const User = mongoose.model('User', userSchema);
