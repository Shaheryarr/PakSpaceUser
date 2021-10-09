import axios from 'axios';
import { LOGIN_API } from './apis';

export const postLoginRequest = params => {
    return new Promise((resolve, reject) => {
        axios.post(LOGIN_API, params, {
            withCredentials: true,
        }).then(res => {
            console.log('postLoginRequest res: ', res.data);
            resolve(res.data);
        }).catch(err => {
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