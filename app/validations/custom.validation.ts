import { CustomHelpers, Types } from "joi";

export const objectId = (value: string, helpers: CustomHelpers) => {
	if (!value.match(/^[0-9a-fA-F]{24}$/)) {
		return helpers.message({
			"string.base": `"username" should be a type of 'text'`,
			"string.empty": `"username" cannot be an empty field`,
			"any.required": `"username" is a required.`,
		})
	};
	return value;
};

export const password = (value: string, helpers: CustomHelpers) => {
	if (value.length < 8) {
		return helpers.message({
			"string.base": `"password must be at least 8 characters'`,
			"string.empty": `"password must be at least 8 characters`,
			"any.required": `"password must be at least 8 characters`,
		});
	}
	if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
		return helpers.message({
			"string.base": `"password must contain at least 1 letter and 1 number'`,
			"string.empty": `"password must contain at least 1 letter and 1 number`,
			"any.required": `"password must contain at least 1 letter and 1 number`,
		});
	}
	return value;
};
