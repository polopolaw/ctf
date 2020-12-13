import axios from 'axios';
import { API_URL } from '../config';
import { getTokenFromLocalstorage } from '../utils/helpers';

export const getCells = data => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getTokenFromLocalstorage(),
    };
    let filter = '';
    if (data.filter) {
        filter = '?type=' + data.filter;
    }
    return axios.get(API_URL + 'mark' + filter, { headers: headers });
};

export const getSelectedCellMarks = data => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getTokenFromLocalstorage(),
    };
    return axios.get(API_URL + `mark/cell/?x=${data.x}&y=${data.y}`, {
        headers: headers,
    });
};

export const likeMark = data => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getTokenFromLocalstorage(),
    };
    return axios.post(
        API_URL + `mark/${data.markId}/like`,
        {},
        { headers: headers }
    );
};

export const createNewMark = (token, data) => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getTokenFromLocalstorage(),
    };

    return axios.post(API_URL + 'mark', data, { headers: headers });
};

export const getComments = (token, markId) => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getTokenFromLocalstorage(),
    };

    return axios.get(API_URL + 'mark/' + markId + '/comment', {
        headers: headers,
    });
};

export const addComment = (token, markId, data) => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getTokenFromLocalstorage(),
    };

    return axios.post(API_URL + 'mark/' + markId + '/comment', data, {
        headers: headers,
    });
};

export const getFavorites = token => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getTokenFromLocalstorage(),
    };

    return axios.get(API_URL + 'mark/liked', { headers: headers });
};
