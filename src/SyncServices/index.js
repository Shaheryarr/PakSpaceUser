import axios from 'axios';
import { LOGIN_API, UPLOAD_IMAGE_API, SIGNUP_API, MANAGE_POSTS, OTP_VERIFY_API } from './apis';

export const postLoginRequest = params => {
	return new Promise((resolve, reject) => {
		axios.post(LOGIN_API, params, {
			withCredentials: true,
		}).then(res => {
			console.log('postLoginRequest res: ', res.data);
			resolve(res.data);
		}).catch(err => {
			//400 email / password incorrect
			console.log('postLoginRequest err: ', err.response.data);
			reject(err);
		});
	});
};

export const postSignUpRequest = params => {
	return new Promise((resolve, reject) => {
		axios.post(SIGNUP_API, params, {
			withCredentials: true,
		}).then(res => {
			console.log('postSignUpRequest res: ', res.data);
			resolve(res.data);
		}).catch(err => {
			console.log('postSignUpRequest err: ', err.response.data);
			reject(err);
		});
	});
};

export const postImageBase64 = params => {
	return new Promise((resolve, reject) => {
		axios.post(UPLOAD_IMAGE_API, params, {
			// withCredentials: true,
		}).then(res => {
			console.log('postImageBase64 res: ', res.data);
			resolve(res.data);
		}).catch(err => {
			console.log('postImageBase64 err: ', err);
			console.log('postImageBase64 err: ', err.response.data);
			reject(err);
		});
	});
};

export const createIssue = params => {
	return new Promise((resolve, reject) => {
		axios
			.put(MANAGE_POSTS, params, {
				withCredentials: true,
			})
			.then(res => {
				console.log('createPost res: ', res.data);
				resolve(res.data);
			})
			.catch(err => {
				console.log('createPost err: ', err.response.data);
				reject(err);
			});
	});
};

export const postOtpVerify = params => {
	return new Promise((resolve, reject) => {
		axios
			.post(OTP_VERIFY_API, params, {
				withCredentials: true,
			})
			.then(res => {
				console.log('postOtpVerify res: ', res.data);
				resolve(res.data);
			})
			.catch(err => {
				console.log('postOtpVerify err: ', err.response.data);
				reject(err);
			});
	});
};