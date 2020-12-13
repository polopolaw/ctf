import axios from 'axios';
import { API_URL } from '../config';
import { getTokenFromLocalstorage } from '../utils/helpers';

export const getBunkers = data => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getTokenFromLocalstorage(),
    };
    return axios.get(API_URL + 'bunkers', { headers: headers });
};
