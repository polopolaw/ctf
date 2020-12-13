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
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/styles';

import { login as loginUser } from '../thunks/auth';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme();

const styles = theme => ({
    root: {
        marginTop: theme.spacing(20),
        backgroundColor: 'white',
        padding: theme.spacing(3),
        borderRadius: '4px',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(5, 0, 2),
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
});

class Login extends Component {
    constructor(props) {
        super(props);

        this.validateFields = this.validateFields.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);

        this.state = {
            username: '',
            password: '',

            errors: {},
        };
    }

    validateFields() {
        const errors = {};
        const { username, password } = this.state;

        if (username.length <= 0) {
            errors.username = 'This field is required';
        }

        if (password.length <= 0) {
            errors.password = 'This field is required';
        }

        this.setState({ errors });
        return isEmpty(errors);
    }

    handleOnSubmit(e) {
        e.preventDefault();

        const { username, password, errors } = this.state;

        if (this.validateFields()) {
            this.props.loginUser({
                login: username,
                password: password,
            });
        }
    }

    render() {
        const { errors, username, password } = this.state;

        const { classes, isCredentialsWrong } = this.props;

        return (
            <Container className={classes.root} maxWidth="sm">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Log in
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
                    {isCredentialsWrong && (
                        <FormHelperText id="creds-error-text" error>
                            Please enter correct login and password.
                        </FormHelperText>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="default"
                        className={classes.submit}
                        onClick={this.handleOnSubmit}
                    >
                        Log in
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="login/forgot" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/sign" variant="body2">
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        isCredentialsWrong: state.auth.isCredentialsWrong,
    };
}

export default withStyles(styles(theme))(
    connect(mapStateToProps, { loginUser })(Login)
);
