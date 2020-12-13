import { push } from 'connected-react-router';
import {
    setSelectedMarks,
    setCells,
    updateSelectedMarks,
    updateLikedMark,
    setCouriers,
    setNewComment,
    logout,
} from '../redux/actions/index';

import { likeMark as likeMarkAction } from '../api/marks';

import {
    getCells,
    getSelectedCellMarks as getSelectedCell,
    createNewMark,
    getComments,
    addComment as addCommentAction,
    getFavorites as getFavoritesFromApi,
} from '../api/marks';
import { setComments, setFavorites } from '../redux/actions';

export const getSelectedCellMarks = data => dispatch => {
    getSelectedCell({ token: data.token, x: data.x, y: data.y })
        .then(response => {
            dispatch(
                setSelectedMarks({
                    cell: {
                        x: data.x,
                        y: data.y,
                    },
                    marks: response.data,
                })
            );
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(logout());
                dispatch(push('/login'));
            }
        });
};

export const getAllMarks = (token, filter) => dispatch => {
    getCells({ token: token, filter: filter })
        .then(response => {
            dispatch(setCells({ filter: filter, data: response.data }));
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(logout());
                dispatch(push('/login'));
            }
        });
};

export const newMark = data => dispatch => {
    let token = data.token;
    let request = {
        private: data.private,
        x: data.x,
        y: data.y,
        name: data.name,
        markType: data.markType,
        sensorCode: data.sensorCode,
        isPrivate: data.isPrivate,
        sharedWith: data.sharedWith,
    };
    return createNewMark(token, request)
        .then(response => {
            dispatch(updateSelectedMarks(response.data));
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(logout());
                dispatch(push('/login'));
            }
        });
};

export const likeMark = data => dispatch => {
    return likeMarkAction(data)
        .then(response => {
            dispatch(getFavorites(data.token));
            return response.data.data; //mark data
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(logout());
                dispatch(push('/login'));
            }
        });
};

export const addComment = (token, markId, data) => dispatch => {
    return addCommentAction(token, markId, data)
        .then(response => {
            dispatch(
                setNewComment({ markId: markId, data: response.data.data })
            );
            return response.data.data; //comment data
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(logout());
                dispatch(push('/login'));
            }
        });
};

export const loadComments = data => dispatch => {
    return getComments(data.token, data.markId)
        .then(response => {
            dispatch(
                setComments({ markId: data.markId, data: response.data.data })
            );
            return response.data.data;
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(logout());
                dispatch(push('/login'));
            }
        });
};

export const getFavorites = token => dispatch => {
    getFavoritesFromApi(token)
        .then(response => {
            dispatch(setFavorites(response));
            return response.data;
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(logout());
                dispatch(push('/login'));
            }
        });
};
