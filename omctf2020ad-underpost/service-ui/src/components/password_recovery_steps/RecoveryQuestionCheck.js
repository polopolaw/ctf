import React, { Component } from 'react';

import PropTypes from 'prop-types';

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

import { redirectToHomePage, sendRecoveryAnswer } from '../../thunks/auth';

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

class RecoveryQuestionCheck extends Component {
    constructor(props) {
        super(props);

        this.validateFields = this.validateFields.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);

        this.state = {
            answer: '',

            errors: {},
        };
    }

    validateFields() {
        const errors = {};
        const { answer } = this.state;

        if (answer.length <= 0) {
            errors.answer = 'This field is required';
        }

        this.setState({ errors });
        return isEmpty(errors);
    }

    handleOnSubmit(e) {
        e.preventDefault();

        const { answer } = this.state;
        const { login } = this.props;
        const { sendRecoveryAnswer, onSubmit, redirectToHomePage } = this.props;

        if (this.validateFields()) {
            sendRecoveryAnswer({
                login: login,
                answer: answer,
            })
            .then(() => {
                this.setState({ errors: {}});
                onSubmit();
                redirectToHomePage();
            })
            .catch((err)=> {
                this.setState({ errors: { answer : "answer is incorrect"}});
            });
        }
    }

    render() {
        const { errors, answer } = this.state;        
        const { classes, question } = this.props;

        return (
            <Container className={classes.root} maxWidth="sm">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        {question}
                    </Typography>
                </div>
                <form className={classes.form} autoComplete="off">
                    <div>
                        <FormControl required fullWidth error={!!errors.answer}>
                            <InputLabel htmlFor="answer-input">
                                Answer
                            </InputLabel>
                            <Input
                                id="answer-input"
                                onChange={e =>
                                    this.setState({ answer: e.target.value })
                                }
                                value={answer}
                                aria-describedby="answer-error-text"
                            />
                            <FormHelperText id="answer-error-text">
                                {errors.answer}
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
                        Submit
                    </Button>
                </form>
            </Container>
        );
    }
}

RecoveryQuestionCheck.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

RecoveryQuestionCheck.defaultProps = {};

function mapStateToProps(state) {
    return { 
        login: state.auth.login,
        question: state.auth.question,      
    };
}

export default withStyles(styles(theme))(
    connect(mapStateToProps, { sendRecoveryAnswer, redirectToHomePage })(
        RecoveryQuestionCheck
    )
);
