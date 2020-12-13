import { push } from 'connected-react-router';
import { logout, setCouriers } from '../redux/actions/index';

import { getUsers } from '../api/users';

export const loadCouriers = token => dispatch => {
    getUsers({ token: token })
        .then(response => {
            dispatch(setCouriers(response.data));
        })
        .catch(e => {
            if (e.response.status === 403) {
                dispatch(logout());
                dispatch(push('/login'));
            }
        });
};
