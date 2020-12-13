import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { authReducer } from './AuthReducer'
import { complaintsReducer } from './ComplaintsReducer'
import { orderReducer } from './OrdersReducer';

export function createRootReducer(history) {
    return combineReducers({
        router: connectRouter(history),
        auth: authReducer,
        orders: orderReducer,
        complaints: complaintsReducer
    });
}
