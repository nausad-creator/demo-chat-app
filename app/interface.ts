
export interface UserI {
	_id: string;
	userID: string;
	userFirstName: string;
	userLastName: string;
	userEmail: string;
	userCountryCode: string;
	userMobile: string;
	userPassword: string;
	userProfilePicture: string;
	languageID: string;
	userDeviceType: string;
	userDeviceID: string;
	userVerified: string;
	userStatus: string;
	userOTP: string;
	userDOB: string;
	userCreatedDate: string;
	languageName: string;
	chats: ChatInterface[];
}
export interface ChatInterface {
	chatID?: string;
	fromUserId: string;
	toUserId: string;
	senderName: string;
	date: string;
	time: string;
	time_in_ms: number;
	receiverName: string;
	isRead?: boolean;
	message: string;
	apiType?: string;
	apiVersion?: string;
	chatCreatedOn: Date;
	createdAt?: Date;
	id?: string;
}