export interface IUser {
	_id: string;
	fullName: string;
	email: string;
	password: string;
	avatarUrl: string;
	originalAvatarUrl: string;
	refreshToken: string[];
	createdAt: Date;
	updatedAt: Date;
	__v: number;
	active: boolean;
}

export interface IPost {
	_id: string;
	title: string;
	text: string;
	imageUrl?: string;
	tags: string[];
	viewsCount: number;
	comment: IComment[];
	createdAt: Date;
	updatedAt: Date;
	__v: number;
	user?: IUser;
}

export interface IComment {
	_id: string;
	text: string;
	user: Partial<IUser>;
	post: Partial<IPost>;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
}

export interface UserResponse {
	user: IUser;
	token: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	user: IUser;
	accessToken: string;
}

export interface SignUpRequest {
	fullName: string;
	email: string;
	password: string;
	avatarUrl?: string;
	originalAvatarUrl?: string;
}

export interface SignUpResponse {
	message: string;
	userData: IUser;
}

export interface VerifyRequest {
	email: string;
	otp: string;
}

export interface VerifyResponse {
	user: IUser;
	accessToken: string;
}

export interface ResendCodeRequest {
	email: string;
}

export interface ResendCodeResponse {
	message: string;
}

export interface RecoveryRequest {
	email: string;
}

export interface RecoveryResponse {
	message: string;
}

export interface ChangePwdRequest {
	userId: string;
	token: string;
	password: string;
	confirmPassword?: string;
}

export interface ChangePwdResponse {
	message: string;
}

export interface IFile {
	url: string;
}

export interface CommentRequest {
	postId?: string;
	text: string;
}
