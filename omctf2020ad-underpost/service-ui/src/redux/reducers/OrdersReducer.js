import {
    SET_ALL_EXISTING_BUNKERS,
    SET_ALL_EXISTING_GOODS,
    SET_ALL_USER_ORDERS    
} from '../../utils/constants';

const initialState = {
    bunkers: null,
    goods: null,
    orders: null,
};

export function orderReducer(state = initialState, action) {
    if (action.type === SET_ALL_EXISTING_BUNKERS) {
        return Object.assign({}, state, {
            bunkers: action.payload.bunkers,
        });
    }

    if (action.type === SET_ALL_EXISTING_GOODS) {
        return Object.assign({}, state, {
            goods: action.payload.goods,
        });
    }

    if (action.type === SET_ALL_USER_ORDERS) {
        return Object.assign({}, state, {
            orders: action.payload.orders,
        });
    }    

    if (!state) {
        state = {
            bunkers: null,
            goods: null,
            orders: null,
        };
    }
    return state;
}
