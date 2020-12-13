import {
    AUTHENTICATED,
    LOGOUT,
    GET_DELIVERED_ORDERS,
    SET_RECOVERY_QUESTION,
    SET_ALL_EXISTING_BUNKERS,
    SET_ALL_EXISTING_GOODS,
    SET_ALL_USER_ORDERS,
    UPDATE_PROFILE,
    SET_CREDENTIALS_WRONG,
    GETCOMPLAIINTSCOURIERS,
    GETCOMPLAIINTSGOOD,
    GETCOURIERS,
    GETGOOD
} from '../../utils/constants';

export function setAsAuthenticated(payload) {
    return { type: AUTHENTICATED, payload };
}

export function logout() {
    return { type: LOGOUT, payload: {} };
}

export function setRecoveryQuestion(payload) {
    return { type: SET_RECOVERY_QUESTION, payload };
}

export function setAllExistingBunkers(payload) {
    return { type: SET_ALL_EXISTING_BUNKERS, payload };
}

export function setAllExistingGoods(payload) {
    return { type: SET_ALL_EXISTING_GOODS, payload };
}

export function setAllUserOrders(payload) {
    return { type: SET_ALL_USER_ORDERS, payload };
}

export function setProfileUpdateData(payload) {
    return { type: UPDATE_PROFILE, payload };
}

export function getComplaintCouriers(payload) {
    return { type: GETCOMPLAIINTSCOURIERS, payload}
}

export function getComplaintGood(payload) {
    return { type:GETCOMPLAIINTSGOOD,payload}
}

export function getCouriers(payload) {
    return { type:GETCOURIERS,payload}
}

export function getGood(payload) {
    return { type:GETGOOD,payload}
}

export function getDeliveredOrders(payload) {
    return { type: GET_DELIVERED_ORDERS, payload };
}

export function setCredentialsWrong(payload) {
    return { type: SET_CREDENTIALS_WRONG, payload };
}
