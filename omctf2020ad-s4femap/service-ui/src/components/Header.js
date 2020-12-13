import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/styles';
import { logout } from '../thunks/auth';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme();

const styles = theme => ({
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        background: '#eaeceb',
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
        margin: theme.spacing(1, 1.5),
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    menu: {
        marginTop: theme.spacing(6),
    },
});

class Header extends Component {
    constructor() {
        super();

        this.state = {
            anchorEl: null,
        };

        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleProfile = this.handleProfile.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleMenu(event) {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleClose() {
        this.setState({ anchorEl: null });
    }

    handleProfile() {
        this.props.onHandleProfile();
        this.setState({ anchorEl: null });
    }

    handleLogout() {
        this.props.onHandleLogout();
        this.setState({ anchorEl: null });
    }

    render() {
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        const { login, isAuthenticated, classes } = this.props;

        return (
            <React.Fragment>
                <CssBaseline />
                <AppBar
                    position="static"
                    color="default"
                    elevation={0}
                    className={classes.appBar}
                >
                    <Toolbar className={classes.toolbar}>
                        <Typography
                            variant="h6"
                            color="inherit"
                            noWrap
                            className={classes.toolbarTitle}
                        >
                            S4fe Map
                        </Typography>
                        {!isAuthenticated && (
                            <div>
                                <Button
                                    href="/login"
                                    color="primary"
                                    variant="outlined"
                                    className={classes.link}
                                >
                                    Login
                                </Button>
                                <Button
                                    href="/sign"
                                    color="primary"
                                    variant="outlined"
                                    className={classes.link}
                                >
                                    Sign up
                                </Button>
                            </div>
                        )}
                        {isAuthenticated && (
                            <div>
                                <IconButton
                                    aria-label={login}
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={this.handleMenu}
                                    color="inherit"
                                    style={{ fontFamily: 'SansumiRegular' }}
                                >
                                    <div>
                                        <AccountCircle
                                            style={{ verticalAlign: 'middle' }}
                                        />
                                        &nbsp;&nbsp;{login}
                                    </div>
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    className={classes.menu}
                                    open={open}
                                    onClose={this.handleClose}
                                >
                                    <Typography
                                        variant="h6"
                                        color="inherit"
                                        noWrap
                                        className={classes.title}
                                    >
                                        <AccountCircle
                                            style={{ verticalAlign: 'middle' }}
                                        />
                                        &nbsp;&nbsp;{login}
                                    </Typography>
                                    <Divider />
                                    <MenuItem onClick={this.handleLogout}>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
            </React.Fragment>
        );
    }
}

Header.propTypes = {
    login: PropTypes.string,
    onHandleLogout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
};

Header.defaultProps = {
    login: null,
    isAuthenticated: false,
};

function mapStateToProps(state) {
    return {
        login: state.auth.login,
        isAuthenticated: !(!state.auth.token || 0 === state.auth.token.length),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onHandleLogout: () => logout()(dispatch),
    };
}

export default withStyles(styles(theme))(
    connect(mapStateToProps, mapDispatchToProps)(Header)
);
