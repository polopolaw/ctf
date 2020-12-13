import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import App from './components/App';
import configureStore from './redux/configureStore';
import SignForm from './pages/SignForm';
import Header from './components/Header';
import Login from './pages/Login';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage';
import ProfileEditPage from './pages/ProfileEditPage';
import ProfilePage from './pages/ProfilePage';
import Map from './pages/Map';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import ThemeProvider from '@material-ui/styles/ThemeProvider';

const initialState = {};

const history = createBrowserHistory();
const store = configureStore(initialState, history);

const theme = createMuiTheme({
    typography: {
        fontFamily: 'SansumiRegular',
    },
    palette: {
        background: {
            paper: '#eaeceb',
        },
    },
});

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <ThemeProvider theme={theme}>
                <Header />
                <App>
                    <Switch>
                        <Route exact path="/sign" component={SignForm} />
                        <Route exact path="/login" component={Login} />
                        <Route
                            exact
                            path="/login/forgot"
                            component={PasswordRecoveryPage}
                        />
                        <Route exact path="/profile" component={ProfilePage} />
                        <Route
                            exact
                            path="/profile/edit"
                            component={ProfileEditPage}
                        />
                        <Route exact path="/map" component={Map} />
                        <Route exact path="/home" component={Map} />
                    </Switch>
                </App>
            </ThemeProvider>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
);

module.hot.accept();
