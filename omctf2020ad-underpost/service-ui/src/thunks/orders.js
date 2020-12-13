import { confirmDelivery, getDeliveredOrdersUser } from '../api/orders';
import {
    setAllExistingBunkers,
    setAllExistingGoods,
    setAllUserOrders,
    getDeliveredOrders,
    logout as doLogout,
} from '../redux/actions/index';

import {
    createOrder as createOrderFromApi,
    getAllExistingBunkers as getAllExistingBunkersFromApi,
    getAllExistingGoods as getAllExistingGoodsFromApi,
    getAllUserOrders as getAllUserOrdersFromApi,
} from '../api/orders';
import { push } from 'connected-react-router';

export const getAllExistingBunkers = token => dispatch => {
    return getAllExistingBunkersFromApi(token)
        .then(response => {
            dispatch(setAllExistingBunkers({ bunkers: response.data }));
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(doLogout());
                dispatch(push('/login'));
            }
        });
};

export const getAllExistingGoods = token => dispatch => {
    return getAllExistingGoodsFromApi(token)
        .then(response => {
            dispatch(setAllExistingGoods({ goods: response.data }));
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(doLogout());
                dispatch(push('/login'));
            }
        });
};

export const getAllUserOrders = token => dispatch => {
    return getAllUserOrdersFromApi(token)
        .then(response => {
            dispatch(setAllUserOrders({ orders: response.data }));
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(doLogout());
                dispatch(push('/login'));
            }
        });
};

export const createOrder = (token, data) => dispatch => {
    return createOrderFromApi(token, data)
        .then(response => {
            if (response.status === 200) {
                getAllUserOrdersFromApi(token).then(response => {
                    dispatch(setAllUserOrders({ orders: response.data }));
                });
            }
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(doLogout());
                dispatch(push('/login'));
            }
        });
};

export const approveDelivery = (orderId, likes, token) => dispatch => {
    return confirmDelivery(orderId, likes, token)
        .then(response => {
            getAllUserOrders(token);
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(doLogout());
                dispatch(push('/login'));
            }
        });
};

export const getOrders = token => dispatch => {
    return getDeliveredOrdersUser(token)
        .then(response => {
            dispatch(getDeliveredOrders(response.data));
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(doLogout());
                dispatch(push('/login'));
            }
        });
};
