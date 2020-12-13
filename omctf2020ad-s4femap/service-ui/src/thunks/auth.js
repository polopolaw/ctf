import { push } from 'connected-react-router';
import {
    setAsAuthenticated,
    logout as doLogout,
    loadAuthFromStorage,
} from '../redux/actions/index';

import { registerUser, loginUser } from '../api/auth';

import { getBunkers } from '../api/bunkers';
import { setCredentialsWrong } from '../redux/actions';

export const register = data => dispatch => {
    registerUser(data)
        .then(response => {
            dispatch(setAsAuthenticated(response.data));
        })
        .then(() => {
            setTimeout(function() {
                dispatch(push('/home'));
            }, 500);
        });
};

export const login = data => dispatch => {
    loginUser(data)
        .then(response => {
            dispatch(setAsAuthenticated(response.data));
        })
        .then(response => {
            setTimeout(function() {
                dispatch(push('/home'));
            }, 500);
        })
        .catch(e => {
            if (e.response.status === 404) {
                dispatch(setCredentialsWrong(true));
            }
        });
};

export const logout = () => dispatch => {
    return new Promise(() => {
        dispatch(doLogout());
        dispatch(push('/login'));
    });
};

export const loadAuth = () => dispatch => {
    let serialized = localStorage.getItem('s4feMapAuth');
    if (serialized) {
        try {
            let auth = JSON.parse(serialized);
            if (auth && auth.token) {
                getBunkers({ token: auth.token })
                    .then(response => {
                        dispatch(setAsAuthenticated(auth));
                    })
                    .then(response => {
                        setTimeout(function() {
                            dispatch(push('/home'));
                        }, 500);
                    });
            }
        } catch (e) {
            dispatch(push('/login'));
        }
    }
};

export const redirectToHomePage = () => dispatch => {
    dispatch(push('/home'));
};
