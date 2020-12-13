import axios from 'axios';
import { API_URL } from '../config';

export const registerUser = data => {
    const headers = {
        'Content-Type': 'application/json',
    };
    return axios.post(API_URL + 'user', data, { headers: headers });
};

export const loginUser = data => {
    const headers = {
        'Content-Type': 'application/json',
    };
    return axios.post(API_URL + 'user/session', data, { headers: headers });
};
