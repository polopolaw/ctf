import React from 'react';
import PropTypes from 'prop-types';

import { FormControl } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';

function RecoveryAnswer({
    recoveryAnswerError,
    onChangeRecoveryAnswer,
    recoveryAnswer,
}) {
    return (
        <div>
            <FormControl required fullWidth error={recoveryAnswerError}>
                <InputLabel htmlFor="recovery-question-answer-input">
                    Recovery question answer
                </InputLabel>
                <Input
                    id="recovery-question-answer-input"
                    onChange={onChangeRecoveryAnswer}
                    value={recoveryAnswer}
                    aria-describedby="recovery-question-answer-error-text"
                />
                <FormHelperText id="recovery-question-answer-error-text">
                    {recoveryAnswerError}
                </FormHelperText>
            </FormControl>
        </div>
    );
}

RecoveryAnswer.propTypes = {
    recoveryAnswerError: PropTypes.string,
    onChangeRecoveryAnswer: PropTypes.func.isRequired,
    recoveryAnswer: PropTypes.string,
};

RecoveryAnswer.defaultProps = {
    recoveryAnswerError: null,
    recoveryAnswer: '',
};

export default RecoveryAnswer;
