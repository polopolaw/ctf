import { push } from 'connected-react-router';
import {
    logout as doLogout,
    setProfileUpdateData,
} from '../redux/actions/index';

import {
    setNewPassword as setNewPasswordToApi,
    updateProfile as updateProfileToApi,
    getCurrentUserInfo as getCurrentUserInfoFromApi,
} from '../api/profile';

export const updateProfile = (token, data) => dispatch => {
    return updateProfileToApi(token, data)
        .then(response => {
            dispatch(setProfileUpdateData(response.data));
            if (response.status === 200) {
                dispatch(push('/profile'));
            }
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(doLogout());
                dispatch(push('/login'));
            }
        });
};

export const setNewPassword = (token, data) => dispatch => {
    return setNewPasswordToApi(token, data)
        .then(response => {
            if (response.status === 200) {
                //save something to store/cookies
            }
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(doLogout());
                dispatch(push('/login'));
            }
        });
};

export const openProfile = () => dispatch => {
    dispatch(push('/profile'));
};

export const openUpdateProfilePage = () => dispatch => {
    dispatch(push('/profile/edit'));
};

export const getCurrentUserInfo = token => dispatch => {
    return getCurrentUserInfoFromApi(token)
        .then(response => {
            dispatch(setProfileUpdateData(response.data));
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(doLogout());
                dispatch(push('/login'));
            }
        });
};
