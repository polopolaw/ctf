import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { createRootReducer } from './reducers';

export default function configureStore(initialState, history) {
    const historyMiddleware = routerMiddleware(history);

    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers =
        process.env.NODE_ENV !== 'production' &&
        typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                  // TODO Try to remove when `react-router-redux` is out of beta, LOCATION_CHANGE should not be fired more than once after hot reloading
                  // Prevent recomputing reducers for `replaceReducer`
                  shouldHotReload: false,
              })
            : compose;

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
