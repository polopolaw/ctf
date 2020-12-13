import { push } from 'connected-react-router';
import { setBunkers } from '../redux/actions/index';

import { getBunkers } from '../api/bunkers';
import { logout } from '../redux/actions';

export const getAllExistingBunkers = token => dispatch => {
    getBunkers({ token: token })
        .then(response => {
            dispatch(setBunkers(response.data));
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(logout());
                dispatch(push('/login'));
            }
        });
};
