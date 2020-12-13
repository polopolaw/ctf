import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { createRootReducer } from './reducers';

export default function configureStore(initialState, history) {
    const historyMiddleware = routerMiddleware(history);

    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const enchancer = composeEnhancers(
        applyMiddleware(thunk, historyMiddleware)
    );

    const store = createStore(
        createRootReducer(history),
        initialState,
        enchancer
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers', () => {
            store.replaceReducer(createRootReducer(history));
        });
    }

    return store;
}
