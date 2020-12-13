import {
    AUTHENTICATED,
    LOGOUT,
    SET_CREDENTIALS_WRONG,
} from '../../utils/contants';

const item = JSON.parse(localStorage.getItem('underpost'));
const token = item ? item.token : null;

const initialState = {
    login: null,
    role: null,
    token,
    isCredentialsWrong: false,
};

export function authReducer(state = initialState, action) {
    if (action.type === AUTHENTICATED) {
        let serialized = JSON.stringify(action.payload);
        localStorage.setItem('s4feMapAuth', serialized);

        return Object.assign({}, state, {
            token: action.payload.token,
            login: action.payload.data.login,
            role: action.payload.data.role,
            isCredentialsWrong: false,
        });
    }

    if (action.type === LOGOUT) {
        localStorage.removeItem('s4feMapAuth');

        return Object.assign({}, state, {
            token: null,
            login: null,
            role: null,
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
            isCredentialsWrong: false,
        };
    }
    return state;
}
