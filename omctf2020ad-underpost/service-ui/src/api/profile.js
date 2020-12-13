import axios from 'axios';
import { API_URL } from '../config';
import { getTokenFromLocalstorage } from '../utils/helpers';

export const setNewPassword = (token, data) => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getTokenFromLocalstorage(),
    };
    return axios.post(API_URL + 'users/password', data, { headers: headers });
};

export const updateProfile = (token, data) => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getTokenFromLocalstorage(),
    };
    return axios.patch(API_URL + 'users', data, { headers: headers });
};

export const getCurrentUserInfo = token => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + getTokenFromLocalstorage(),
        },
    };

    return axios.get(API_URL + 'users/me', config);
};
