import {
    AUTHENTICATED,
    LOGOUT,
    SET_SELECTED_MARKS,
    SET_BUNKERS,
    SET_CELLS,
    SET_COURIERS,
    UPDATE_SELECTED_MARKS,
    UPDATE_LIKED_MARK,
    SET_COMMENTS,
    SET_NEW_COMMENT,
    SET_FAVORITES,
    SET_CREDENTIALS_WRONG,
} from '../../utils/contants';

export function setAsAuthenticated(payload) {
    return { type: AUTHENTICATED, payload };
}

export function logout() {
    return { type: LOGOUT, payload: {} };
}

export function setSelectedMarks(payload) {
    return { type: SET_SELECTED_MARKS, payload: payload };
}

export function setBunkers(payload) {
    return { type: SET_BUNKERS, payload: payload };
}

export function setCells(payload) {
    return { type: SET_CELLS, payload: payload };
}

export function updateSelectedMarks(payload) {
    return { type: UPDATE_SELECTED_MARKS, payload: payload };
}

export function setCouriers(payload) {
    return { type: SET_COURIERS, payload: payload };
}

export function updateLikedMark(payload) {
    return { type: UPDATE_LIKED_MARK, payload: payload };
}

export function setComments(payload) {
    return { type: SET_COMMENTS, payload: payload };
}

export function setNewComment(payload) {
    return { type: SET_NEW_COMMENT, payload: payload };
}

export function setFavorites(payload) {
    return { type: SET_FAVORITES, payload: payload };
}

export function setCredentialsWrong(payload) {
    return { type: SET_CREDENTIALS_WRONG, payload };
}
