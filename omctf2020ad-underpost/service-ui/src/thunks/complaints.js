import { push } from 'connected-react-router';
import {
    getComplaintsCourier,
    getComplaintsGood,
    getAllCouriers,
    getAllGood,
    sendComplaintCourier,
    sendGoodComplaint as sendGoodComplaintToApi,
} from '../api/complaints';
import {
    getComplaintCouriers,
    getComplaintGood,
    getCouriers,
    getGood,
    logout as doLogout,
    setAsAuthenticated,
    setCredentialsWrong,
} from '../redux/actions/index';

export const getComplaintCourier = token => dispatch => {
    return getComplaintsCourier(token)
        .then(response => {
            dispatch(getComplaintCouriers(response.data));
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(doLogout());
                dispatch(push('/login'));
            }
        });
};
export const getComplGood = token => dispatch => {
    return getComplaintsGood(token)
        .then(response => {
            dispatch(getComplaintGood(response.data));
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(doLogout());
                dispatch(push('/login'));
            }
        });
};
export const listCouriers = token => dispatch => {
    return getAllCouriers(token)
        .then(response => {
            dispatch(getCouriers(response.data));
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(doLogout());
                dispatch(push('/login'));
            }
        });
};
export const listGood = token => dispatch => {
    return getAllGood(token)
        .then(response => {
            dispatch(getGood(response.data));
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(doLogout());
                dispatch(push('/login'));
            }
        });
};
export const sendCourComplaint = (courierId, text, token) => dispatch => {
    return sendComplaintCourier(courierId, text, token)
        .then(response => {
            return response.data;
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(doLogout());
                dispatch(push('/login'));
            }
        });
};
export const sendGoodComplaint = (goodId, comment, file, token) => dispatch => {
    return sendGoodComplaintToApi(goodId, comment, file, token)
        .then(response => {
            return response.data;
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(doLogout());
                dispatch(push('/login'));
            }
        });
};
