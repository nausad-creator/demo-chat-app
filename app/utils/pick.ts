
export const pick = (object: any, keys: any) => {
	return keys.reduce((obj: { [x: string]: any; }, key: string | number) => {
		if (object && Object.prototype.hasOwnProperty.call(object, key)) {
			obj[key] = object[key];
		}
		return obj;
	}, {});
};
