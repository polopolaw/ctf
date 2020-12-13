import axios from 'axios';
import { API_URL } from '../config';

const item = JSON.parse(localStorage.getItem('underpost'));
const token = item ? item.token : null;

axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

export const registerUser = data => {
    const headers = {
        'Content-Type': 'application/json',
    };
    return axios.post(API_URL + 'users', data, { headers: headers });
};

export const loginUser = data => {
    const headers = {
        'Content-Type': 'application/json',
    };
    return axios.post(API_URL + 'session', data, { headers: headers });
};

export const getRecoveryQuestion = data => {
    return axios.get(API_URL + 'restore?login=' + encodeURI(data.login));
};

export const sendRecoveryAnswer = data => {
    const headers = {
        'Content-Type': 'application/json',
    };
    return axios.post(API_URL + 'restore', data, { headers: headers });
};
