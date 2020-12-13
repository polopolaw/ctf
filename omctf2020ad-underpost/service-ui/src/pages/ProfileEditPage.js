import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import { createMuiTheme } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';

import isEmpty from 'lodash/isEmpty';

import ContactNumber from '../components/profile/ContactNumber';
import { redirectToHomePage } from '../thunks/auth';
import { setNewPassword, updateProfile } from '../thunks/profile';
import Password from '../components/profile/Password';

const theme = createMuiTheme();

const styles = theme => ({
    root: {
        marginTop: theme.spacing(5),
    },
    media: {
        height: 140,
    },
});

class ProfileEditPage extends Component {
    constructor(props) {
        super(props);

        this.validateFields = this.validateFields.bind(this);
        this.handleOnSave = this.handleOnSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeContactNumber = this.onChangeContactNumber.bind(this);
        this.onChangeContactNumberPrefix = this.onChangeContactNumberPrefix.bind(
            this
        );

        this.state = {
            password: '',
            contactNumber: '',
            contactNumberPrefix: '',

            errors: {},
        };
    }

    componentDidMount() {
        if (!this.props.userData) {
            return;
        }

        this.setState((state, { userData }) => ({
            contactNumber: userData.contactNumber.slice(3),
            contactNumberPrefix: userData.contactNumber.slice(0, 3),
        }));
    }

    validateFields() {
        const errors = {};
        const { password, contactNumber, contactNumberPrefix } = this.state;

        if (
            password.length >= 1 &&
            (password.length < 3 || password.length > 50)
        ) {
            errors.password =
                'Password should contain at least 3 symbols and not more then 50';
        }

        if (contactNumber.length <= 0) {
            errors.contactNumber = 'This field is required';
        }

        if (contactNumber.length > 9) {
            errors.contactNumber =
                'Contact number should contain less then 9 symbols';
        }

        if (!contactNumberPrefix || contactNumberPrefix.length <= 0) {
            errors.contactNumberPrefix = 'This field is required';
        }

        this.setState({ errors });
        return isEmpty(errors);
    }

    handleOnSave(e) {
        e.preventDefault();

        const { contactNumber, contactNumberPrefix, password } = this.state;
        const { setNewPassword, token, updateProfile } = this.props;

        if (this.validateFields()) {
            updateProfile(token, {
                contactNumber: contactNumberPrefix + contactNumber,
            });

            if (password) {
                setNewPassword(token, { password });
            }
        }
    }

    handleCancel(e) {
        e.preventDefault();
        this.props.redirectToHomePage();
    }

    onChangePassword(e) {
        this.setState({ password: e.target.value });
    }

    onChangeContactNumber(e) {
        this.setState({ contactNumber: e.target.value });
    }

    onChangeContactNumberPrefix(e, v) {
        this.setState({ contactNumberPrefix: v });
    }

    render() {
        const { classes } = this.props;
        const {
            password,
            contactNumber,
            contactNumberPrefix,
            errors,
        } = this.state;

        return (
            (this.props.token && (
                <Container className={classes.root} maxWidth="sm">
                    <Card>
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                            >
                                Edit profile
                            </Typography>
                            <ContactNumber
                                onChangeContactNumber={
                                    this.onChangeContactNumber
                                }
                                onChangePrefix={
                                    this.onChangeContactNumberPrefix
                                }
                                contactNumber={contactNumber}
                                errors={{
                                    contactNumber: errors.contactNumber,
                                    contactNumberPrefix:
                                        errors.contactNumberPrefix,
                                }}
                                contactNumberPrefix={contactNumberPrefix}
                            />
                            <Password
                                onChangePassword={this.onChangePassword}
                                password={password}
                                passwordError={errors.password}
                            />
                        </CardContent>
                        <DialogActions>
                            <Button
                                size="small"
                                color="primary"
                                onClick={this.handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="small"
                                color="primary"
                                onClick={this.handleOnSave}
                            >
                                Save
                            </Button>
                        </DialogActions>
                    </Card>
                </Container>
            )) || <div></div>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userData: state.auth.userData,
    };
}

const mapDispatchToProps = {
    redirectToHomePage,
    setNewPassword,
    updateProfile,
};

export default withStyles(styles(theme))(
    connect(mapStateToProps, mapDispatchToProps)(ProfileEditPage)
);
