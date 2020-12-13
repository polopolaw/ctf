import { push } from 'connected-react-router';
import {
    setAsAuthenticated,
    logout as doLogout,
    setRecoveryQuestion,
    setCredentialsWrong,
} from '../redux/actions/index';

import {
    registerUser,
    loginUser,
    getRecoveryQuestion as getRecoveryQuestionFromApi,
    sendRecoveryAnswer as sendRecoveryAnswerToApi,
} from '../api/auth';
import { getAllExistingBunkers } from '../api/orders';

export const register = data => dispatch => {
    registerUser(data)
        .then(response => {
            let serialized = JSON.stringify(response.data);
            localStorage.setItem('underpost', serialized);
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
            let serialized = JSON.stringify(response.data);
            localStorage.setItem('underpost', serialized);
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

export const getRecoveryQuestion = data => dispatch => {
    return getRecoveryQuestionFromApi(data).then(response => {
        dispatch(
            setRecoveryQuestion({ login: data.login, question: response.data })
        );
    });
};

export const sendRecoveryAnswer = data => dispatch => {
    return sendRecoveryAnswerToApi(data).then(response => {
        dispatch(setAsAuthenticated(response.data));
    });
};

export const redirectToHomePage = () => dispatch => {
    dispatch(push('/home'));
};

export const loadAuth = () => dispatch => {
    let serialized = localStorage.getItem('underpost');
    if (serialized) {
        try {
            let auth = JSON.parse(serialized);
            if (auth && auth.token) {
                getAllExistingBunkers(auth.token)
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
