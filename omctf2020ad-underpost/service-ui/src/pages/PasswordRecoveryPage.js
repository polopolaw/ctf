import React from 'react';

import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import RecoveryQuestionCheck from '../components/password_recovery_steps/RecoveryQuestionCheck';
import PasswordRecovery from '../components/password_recovery_steps/PasswordRecovery';

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}));

const steps = ['Enter username', 'Answer secret question'];

const PasswordRecoveryPage = () => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {      

        setActiveStep(activeStep + 1);
    };

    const getStepContent = step => {
        switch (step) {
            case 0:
                return (<PasswordRecovery onSubmit={handleNext} />);
            case 1:
                return (<RecoveryQuestionCheck onSubmit={handleNext} />);
        }
    };

    return (
        <React.Fragment>
            <div className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h4" align="center">
                        Password Recovery
                    </Typography>
                    <Stepper
                        activeStep={activeStep}
                        className={classes.stepper}
                    >
                        {steps.map(label => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <React.Fragment>
                        <React.Fragment>
                            { getStepContent(activeStep) }
                        </React.Fragment>
                    </React.Fragment>
                </Paper>
            </div>
        </React.Fragment>
    );
};

export default PasswordRecoveryPage;