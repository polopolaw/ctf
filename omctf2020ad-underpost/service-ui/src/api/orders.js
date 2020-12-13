import axios from 'axios';
import { API_URL } from '../config';
import { getTokenFromLocalstorage } from '../utils/helpers';

export const getAllUserOrders = toke => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + getTokenFromLocalstorage(),
        },
    };

    return axios.get(API_URL + 'orders', config);
};

export const getAllExistingBunkers = token => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + getTokenFromLocalstorage(),
        },
    };

    return axios.get(API_URL + 'bunkers', config);
};

export const getAllExistingGoods = token => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + getTokenFromLocalstorage(),
        },
    };

    return axios.get(API_URL + 'goods', config);
};

export const createOrder = (token, data) => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getTokenFromLocalstorage(),
    };
    return axios.post(API_URL + 'orders', data, { headers: headers });
};

export const getDeliveredOrdersUser = token => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + getTokenFromLocalstorage(),
        },
    };

    return axios.get(API_URL + 'orders?status=delivered', config);
};
export const confirmDelivery = (orderId, likes, token) => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getTokenFromLocalstorage(),
    };

    return axios.post(
        API_URL + `orders/${orderId}/finish`,
        {
            likes: parseInt(likes),
        },
        { headers: headers }
    );
};
