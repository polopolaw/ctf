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
import MenuIcon from '@material-ui/icons/Menu';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CreateIcon from '@material-ui/icons/Create';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import StarsIcon from '@material-ui/icons/Stars';

import { withStyles } from '@material-ui/styles';

import { openProfile, openUpdateProfilePage } from '../thunks/profile';
import { logout } from '../thunks/auth';
import { createMuiTheme } from '@material-ui/core/styles';
import { redirectToHomePage } from '../thunks/auth';
import OrderCreation from '../components/order/OrderCreation';
import Orders from '../components/order/Orders';

import background from '../assets/img/background.jpg';
import ComplaintsPage from '../pages/ComplaintsPage';
import ComplaintCreation from './complaint/ComplaintCreation';

const theme = createMuiTheme();

const styles = theme => ({
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        background: '#eaeceb',
    },
    menuButton: {
        color: '#2b3841',
        marginRight: theme.spacing(2),
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
        color: '#2b3841',
        '&:hover': {
            cursor: 'pointer',
        },
    },
    title: {
        flexGrow: 1,
        margin: theme.spacing(1, 1.5),
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    accountCircle: {
        color: '#2b3841',
        marginRight: theme.spacing(1),
        position: 'relative',
        top: '5px',
    },
    list: {
        width: 250,
    },
    menu: {
        marginTop: theme.spacing(6),
    },

    drawer: {
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },

    menuItem: {
        color: 'black',
        fontWeight: 100,
    },
});

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
            openModal: false,
            openModalComplaintList: false,
            openModalComplaint: false,
            openModalApprove: false,
            left: false,
        };

        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleProfile = this.handleProfile.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
        this.handleCloseModalApproveOrder = this.handleCloseModalApproveOrder.bind(
            this
        );
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleCloseModalComplaint = this.handleCloseModalComplaint.bind(
            this
        );
        this.handleCloseModalComplaintList = this.handleCloseModalComplaintList.bind(
            this
        );
        this.handleOpenModalComplaintList = this.handleOpenModalComplaintList.bind(
            this
        );
        this.handleOpenModalApproveOrder = this.handleOpenModalApproveOrder.bind(
            this
        );
        this.handleOpenModalComplaint = this.handleOpenModalComplaint.bind(
            this
        );
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

    handleUpdateProfile() {
        this.props.onHandleUpdateProfile();
        this.setState({ anchorEl: null });
    }

    handleOpenModal = () => {
        this.props.redirectToHomePage();
        this.setState({ openModal: true, left: false });
    };
    handleOpenModalApproveOrder = () => {
        this.props.redirectToHomePage();
        this.setState({ openModalApprove: true, left: false });
    };

    handleCloseModal = () => {
        this.setState({ openModal: false });
    };

    handleOpenModalComplaintList = () => {
        this.props.redirectToHomePage();
        this.setState({ openModalComplaintList: true, left: false });
    };

    handleCloseModalComplaintList = () => {
        this.setState({ openModalComplaintList: false });
    };

    handleOpenModalComplaint = () => {
        this.props.redirectToHomePage();
        this.setState({ openModalComplaint: true, left: false });
    };

    handleCloseModalComplaint = () => {
        this.setState({ openModalComplaint: false });
    };

    handleCloseModalApproveOrder = () => {
        this.setState({ openModalApprove: false });
    };

    toggleDrawer = (anchor, open) => event => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        this.setState({ ...this.state, [anchor]: open });
    };

    render() {
        const {
            anchorEl,
            openModal,
            openModalApprove,
            openModalComplaintList,
            openModalComplaint,
        } = this.state;

        const open = Boolean(anchorEl);
        const { login, isAuthenticated, classes } = this.props;
        const anchor = 'left';

        return (
            <React.Fragment>
                <CssBaseline />
                <AppBar
                    position="static"
                    elevation={0}
                    className={classes.appBar}
                >
                    <Toolbar className={classes.toolbar}>
                        {isAuthenticated && (
                            <div>
                                <IconButton
                                    aria-label="menu"
                                    aria-controls="icon-menu"
                                    aria-haspopup="true"
                                    className={classes.menuButton}
                                    color="inherit"
                                    edge="start"
                                    onClick={this.toggleDrawer(anchor, true)}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Drawer
                                    anchor={anchor}
                                    open={this.state[anchor]}
                                    onClose={this.toggleDrawer(anchor, false)}
                                    classes={{ paper: classes.drawer }}
                                >
                                    <List className={classes.list}>
                                        <ListItem
                                            button
                                            key="create-order"
                                            onClick={this.handleOpenModal}
                                        >
                                            <ListItemIcon>
                                                <StarsIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                classes={{
                                                    primary: classes.menuItem,
                                                }}
                                                primary="Create&nbsp;&nbsp;order"
                                            />
                                        </ListItem>

                                        <ListItem
                                            button
                                            key="approve-order"
                                            onClick={
                                                this.handleOpenModalApproveOrder
                                            }
                                        >
                                            <ListItemIcon>
                                                <ThumbUpIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                classes={{
                                                    primary: classes.menuItem,
                                                }}
                                                primary="Approve&nbsp;&nbsp;delivery"
                                            />
                                        </ListItem>

                                        <ListItem
                                            button
                                            key=" create-complaint"
                                            onClick={
                                                this.handleOpenModalComplaint
                                            }
                                        >
                                            <ListItemIcon>
                                                <CreateIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                classes={{
                                                    primary: classes.menuItem,
                                                }}
                                                primary="Create&nbsp;&nbsp;complaint"
                                            />
                                        </ListItem>

                                        <ListItem
                                            button
                                            key="complaint-list"
                                            onClick={
                                                this
                                                    .handleOpenModalComplaintList
                                            }
                                        >
                                            <ListItemIcon>
                                                <FormatListBulletedIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                classes={{
                                                    primary: classes.menuItem,
                                                }}
                                                primary="Complaint&nbsp;&nbsp;list"
                                            />
                                        </ListItem>
                                    </List>
                                </Drawer>
                                <Modal
                                    open={openModal}
                                    onClose={this.handleCloseModal}
                                    aria-describedby="order-creation-modal"
                                >
                                    <OrderCreation
                                        handleCloseModal={this.handleCloseModal}
                                    />
                                </Modal>
                                <Modal
                                    open={openModalComplaintList}
                                    onClose={this.handleCloseModalComplaintList}
                                    aria-describedby="complaint-list-modal"
                                >
                                    <ComplaintsPage
                                        handleCloseModal={
                                            this.handleCloseModalComplaintList
                                        }
                                    />
                                </Modal>
                                <Modal
                                    open={openModalComplaint}
                                    onClose={this.handleCloseModalComplaint}
                                    aria-describedby="complaint-modal"
                                >
                                    <ComplaintCreation
                                        handleCloseModal={
                                            this.handleCloseModalComplaint
                                        }
                                    />
                                </Modal>
                                <Modal
                                    open={openModalApprove}
                                    onClose={this.handleCloseModalApproveOrder}
                                    aria-describedby="approve-delivery-modal"
                                >
                                    <Orders
                                        handleCloseModal={() =>
                                            this.handleCloseModalApproveOrder
                                        }
                                    />
                                </Modal>
                            </div>
                        )}
                        <Typography
                            variant="h6"
                            color="inherit"
                            noWrap
                            className={classes.toolbarTitle}
                            onClick={this.props.redirectToHomePage}
                        >
                            Underpost
                        </Typography>
                        {!isAuthenticated && (
                            <div>
                                <Button
                                    href="/login"
                                    color="default"
                                    variant="outlined"
                                    className={classes.link}
                                >
                                    Login
                                </Button>
                                <Button
                                    href="/sign"
                                    color="default"
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
                                    <div style={{ color: '#2b3841' }}>
                                        <AccountCircle
                                            style={{
                                                verticalAlign: 'middle',
                                                color: '#2b3841',
                                            }}
                                        />
                                        &nbsp;{login}
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
                                    open={open}
                                    className={classes.menu}
                                    onClose={this.handleClose}
                                >
                                    <Typography
                                        variant="h6"
                                        color="inherit"
                                        noWrap
                                        className={classes.title}
                                    >
                                        <AccountCircle
                                            className={classes.accountCircle}
                                        />
                                        {login}
                                    </Typography>
                                    <Divider />
                                    <MenuItem onClick={this.handleProfile}>
                                        Profile
                                    </MenuItem>
                                    <MenuItem
                                        onClick={this.handleUpdateProfile}
                                    >
                                        Edit Profile
                                    </MenuItem>
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
    onHandleProfile: PropTypes.func.isRequired,
    onHandleLogout: PropTypes.func.isRequired,
    onHandleUpdateProfile: PropTypes.func.isRequired,
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
        onHandleProfile: () => openProfile()(dispatch),
        onHandleLogout: () => logout()(dispatch),
        onHandleUpdateProfile: () => openUpdateProfilePage()(dispatch),
        redirectToHomePage: () => redirectToHomePage()(dispatch),
    };
}

export default withStyles(styles(theme))(
    connect(mapStateToProps, mapDispatchToProps)(Header)
);
