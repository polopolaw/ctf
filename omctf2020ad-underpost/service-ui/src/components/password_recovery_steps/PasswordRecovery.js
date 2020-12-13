import React, { Component } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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

import { getRecoveryQuestion } from '../../thunks/auth';

const theme = createMuiTheme();

const styles = theme => ({
    root: {
        marginTop: theme.spacing(20),
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(5, 0, 2),
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
});

class PasswordRecovery extends Component {
    constructor(props) {
        super(props);

        this.validateFields = this.validateFields.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);

        this.state = {
            username: '',

            errors: {},
        };
    }

    validateFields() {
        const errors = {};
        const { username } = this.state;

        if (username.length <= 0) {
            errors.username = 'This field is required';
        }

        this.setState({ errors });
        return isEmpty(errors);
    }

    handleOnSubmit(e) {
        e.preventDefault();        

        const { username } = this.state;

        if (this.validateFields()) {
            this.props.getRecoveryQuestion({
                login: username,
            })            
            .then(()=>{
                this.setState({ errors: {},});                
                this.props.onSubmit();
            })
            .catch((err)=>{                
                this.setState({ errors: { username: "not found" }})
            });            
        }
    }

    render() {
        const { errors, username } = this.state;

        const { classes } = this.props;

        return (
            <Container className={classes.root} maxWidth="sm">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Enter Your Username
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={this.handleOnSubmit}
                    >
                        Next
                    </Button>
                </form>
            </Container>
        );
    }
}

PasswordRecovery.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

PasswordRecovery.defaultProps = {};

export default withStyles(styles(theme))(
    connect(null, { getRecoveryQuestion })(PasswordRecovery)
);
