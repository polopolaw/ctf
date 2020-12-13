import {
    AUTHENTICATED,
    LOGOUT,
    SET_CREDENTIALS_WRONG,
    SET_RECOVERY_QUESTION,
    UPDATE_PROFILE,
} from '../../utils/constants';

const item = JSON.parse(localStorage.getItem('underpost'));
const token = item ? item.token : null;

const initialState = {
    login: null,
    role: null,
    token,
    question: null,
    userData: null,
    isCredentialsWrong: false,
};

export function authReducer(state = initialState, action) {
    if (action.type === AUTHENTICATED) {
        let serialized = JSON.stringify(action.payload);
        localStorage.setItem('underpost', serialized);

        return Object.assign({}, state, {
            token: action.payload.token,
            login: action.payload.data.login,
            role: action.payload.data.role,
            userData: action.payload.data,
            isCredentialsWrong: false,
        });
    }

    if (action.type === LOGOUT) {
        localStorage.removeItem('underpost');

        return Object.assign({}, state, {
            token: null,
            login: null,
            role: null,
            question: null,
        });
    }

    if (action.type === SET_RECOVERY_QUESTION) {
        return Object.assign({}, state, {
            login: action.payload.login,
            question: action.payload.question,
        });
    }

    if (action.type === UPDATE_PROFILE) {
        return Object.assign({}, state, {
            userData: action.payload,
        });
    }

    if (action.type === SET_CREDENTIALS_WRONG) {
        return Object.assign({}, state, {
            isCredentialsWrong: action.payload,
        });
    }

    if (!state) {
        state = {
            login: null,
            role: null,
            token: null,
            question: null,
            userData: null,
            isCredentialsWrong: false,
        };
    }
    return state;
}
