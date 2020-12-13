import React, { Component } from 'react';

import { connect } from 'react-redux';

import isEmpty from 'lodash/isEmpty';

import Container from '@material-ui/core/Container';
import { FormControl } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';

import { withStyles } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

import { register as registerUser } from '../thunks/auth';

const theme = createMuiTheme();

const styles = theme => ({
    root: {
        marginTop: theme.spacing(20),
    },
    form: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
});

class SignForm extends Component {
    constructor(props) {
        super(props);

        this.validateFields = this.validateFields.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);

        this.state = {
            username: '',
            password: '',
            personalId: '',

            errors: {},
        };
    }

    validateFields() {
        const errors = {};
        const { username, password, personalId } = this.state;

        if (username.length < 5 || username.length > 20) {
            errors.username =
                'Name should contain at least 5 symbols and not more then 20';
        }

        if (password.length < 8 || password.length > 40) {
            errors.password =
                'Password should contain at least 8 symbols and not more then 40';
        }

        if (personalId.length == 0) {
            errors.personalId = 'This field is required';
        }

        this.setState({ errors });
        return isEmpty(errors);
    }

    handleOnSubmit(e) {
        e.preventDefault();

        const { username, password, personalId } = this.state;

        if (this.validateFields()) {
            this.props.registerUser({
                login: username,
                password: password,
                personalID: personalId,
                fullName: '',
            });
        }
    }

    render() {
        const { errors, username, password, personalId } = this.state;

        const { classes } = this.props;

        return (
            <Container className={classes.root} maxWidth="sm">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                </div>
                <form className={classes.form} autoComplete="off">
                    <div>
                        <FormControl
                            required
                            fullWidth
                            error={!!errors.username}
                        >
                            <InputLabel htmlFor="username-input">
                                Username
                            </InputLabel>
                            <Input
                                id="username-input"
                                onChange={e =>
                                    this.setState({ username: e.target.value })
                                }
                                value={username}
                                aria-describedby="username-error-text"
                            />
                            <FormHelperText id="username-error-text">
                                {errors.username}
                            </FormHelperText>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl
                            required
                            fullWidth
                            error={!!errors.password}
                        >
                            <InputLabel htmlFor="password-input">
                                Password
                            </InputLabel>
                            <Input
                                id="password-input"
                                onChange={e =>
                                    this.setState({ password: e.target.value })
                                }
                                value={password}
                                type="password"
                                aria-describedby="password-error-text"
                            />
                            <FormHelperText id="password-error-text">
                                {errors.password}
                            </FormHelperText>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl
                            required
                            fullWidth
                            error={!!errors.personalId}
                        >
                            <InputLabel htmlFor="personal-id-input">
                                Personal ID number
                            </InputLabel>
                            <Input
                                id="personal-id-input"
                                onChange={e =>
                                    this.setState({
                                        personalId: e.target.value,
                                    })
                                }
                                value={personalId}
                                aria-describedby="personal-id-error-text"
                            />
                            <FormHelperText id="personal-id-error-text">
                                {errors.personalId}
                            </FormHelperText>
                        </FormControl>
                    </div>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={this.handleOnSubmit}
                    >
                        Sign Up
                    </Button>
                </form>
            </Container>
        );
    }
}

export default withStyles(styles(theme))(
    connect(null, { registerUser })(SignForm)
);
