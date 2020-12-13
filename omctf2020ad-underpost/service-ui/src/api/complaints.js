import axios from 'axios';
import { API_URL } from '../config';
import { getTokenFromLocalstorage } from '../utils/helpers';

export const getComplaintsCourier = token => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + getTokenFromLocalstorage(),
        },
    };
    return axios.get(API_URL + 'appeals/couriers', config);
};

export const getComplaintsGood = token => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + getTokenFromLocalstorage(),
        },
    };
    return axios.get(API_URL + 'appeals/goods', config);
};

export const getAllCouriers = token => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + getTokenFromLocalstorage(),
        },
    };

    return axios.get(API_URL + 'couriers', config);
};

export const sendComplaintCourier = (courierId, text, token) => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getTokenFromLocalstorage(),
    };

    return axios.post(
        API_URL + `appeals/couriers/${encodeURI(courierId)}`,
        {
            complaint: text.toString(),
        },
        {
            headers: headers,
        }
    );
};
export const sendGoodComplaint = (goodId, comment, file, token) => {
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            Authorization: 'Bearer ' + getTokenFromLocalstorage(),
        },
    };

    const formData = new FormData();
    if (file) {
        formData.append('file', file);
    }
    formData.append('complaint', comment);

    return axios.post(
        API_URL + 'appeals/goods/' + encodeURI(goodId),
        formData,
        config
    );
};
