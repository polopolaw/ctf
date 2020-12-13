import React, { Component } from 'react';

import { connect } from 'react-redux';

import isEmpty from 'lodash/isEmpty';

import Container from '@material-ui/core/Container';
import { FormControl } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
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
        backgroundColor: 'white',
        padding: theme.spacing(3),
        borderRadius: '4px',
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
});

const contactNumberOptions = ['BRG', 'EKC'];

class SignForm extends Component {
    constructor(props) {
        super(props);

        this.validateFields = this.validateFields.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);

        this.state = {
            username: '',
            password: '',
            contactNumber: '',
            contactNumberPrefix: '',
            recoveryQuestion: '',
            recoveryQuestionAnswer: '',
            personalId: '',

            errors: {},
        };
    }

    validateFields() {
        const errors = {};
        const {
            username,
            password,
            contactNumber,
            contactNumberPrefix,
            recoveryQuestion,
            recoveryQuestionAnswer,
            personalId,
        } = this.state;

        if (username.length < 3 || username.length > 50) {
            errors.username =
                'Name should contain at least 3 symbols and not more then 50';
        }

        if (password.length < 3 || password.length > 50) {
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

        if (personalId.length !== 6) {
            errors.personalId = 'Personal ID should contain 6 symbols';
        }

        if (contactNumberPrefix.length <= 0) {
            errors.contactNumberPrefix = 'This field is required';
        }

        if (recoveryQuestion.length <= 0) {
            errors.recoveryQuestion = 'This field is required';
        }

        if (recoveryQuestionAnswer.length <= 0) {
            errors.recoveryQuestionAnswer = 'This field is required';
        }

        this.setState({ errors });
        return isEmpty(errors);
    }

    handleOnSubmit(e) {
        e.preventDefault();

        const {
            username,
            password,
            contactNumber,
            contactNumberPrefix,
            recoveryQuestion,
            recoveryQuestionAnswer,
            personalId,
        } = this.state;

        if (this.validateFields()) {
            this.props.registerUser({
                login: username,
                password: password,
                contactNumber: contactNumberPrefix + contactNumber,
                question: recoveryQuestion,
                answer: recoveryQuestionAnswer,
                personalID: personalId,
                fullName: '',
            });
        }
    }

    render() {
        const {
            errors,
            username,
            password,
            contactNumber,
            contactNumberPrefix,
            recoveryQuestion,
            recoveryQuestionAnswer,
            personalId,
        } = this.state;

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
                            error={!!errors.recoveryQuestion}
                        >
                            <InputLabel htmlFor="recovery-question-input">
                                Recovery question
                            </InputLabel>
                            <Input
                                id="recovery-question-input"
                                onChange={e =>
                                    this.setState({
                                        recoveryQuestion: e.target.value,
                                    })
                                }
                                value={recoveryQuestion}
                                aria-describedby="recovery-question-error-text"
                            />
                            <FormHelperText id="recovery-question-error-text">
                                {errors.recoveryQuestion}
                            </FormHelperText>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl
                            required
                            fullWidth
                            error={!!errors.recoveryQuestionAnswer}
                        >
                            <InputLabel htmlFor="recovery-question-answer-input">
                                Recovery question answer
                            </InputLabel>
                            <Input
                                id="recovery-question-answer-input"
                                onChange={e =>
                                    this.setState({
                                        recoveryQuestionAnswer: e.target.value,
                                    })
                                }
                                value={recoveryQuestionAnswer}
                                aria-describedby="recovery-question-answer-error-text"
                            />
                            <FormHelperText id="recovery-question-answer-error-text">
                                {errors.recoveryQuestionAnswer}
                            </FormHelperText>
                        </FormControl>
                    </div>
                    <div>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <FormControl
                                    required
                                    fullWidth
                                    error={!!errors.contactNumberPrefix}
                                >
                                    <Autocomplete
                                        id="contact-number-autocomplete"
                                        options={contactNumberOptions}
                                        getOptionLabel={option => option}
                                        onChange={(e, v) =>
                                            this.setState({
                                                contactNumberPrefix: v,
                                            })
                                        }
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                error={
                                                    !!errors.contactNumberPrefix
                                                }
                                                label="Prefix"
                                                required
                                                aria-describedby="contact-number-autocomplete-error-text"
                                            />
                                        )}
                                        inputValue={contactNumberPrefix}
                                    />
                                    <FormHelperText id="contact-number-autocomplete-error-text">
                                        {errors.contactNumberPrefix}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8}>
                                <FormControl
                                    required
                                    fullWidth
                                    error={!!errors.contactNumber}
                                >
                                    <InputLabel htmlFor="contact-number-input">
                                        Contact number
                                    </InputLabel>
                                    <Input
                                        id="contact-number-input"
                                        onChange={e =>
                                            this.setState({
                                                contactNumber: e.target.value,
                                            })
                                        }
                                        value={contactNumber}
                                        aria-describedby="contact-number-error-text"
                                    />
                                    <FormHelperText id="contact-number-error-text">
                                        {errors.contactNumber}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
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
                        color="default"
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
