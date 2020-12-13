import React from 'react';
import PropTypes from 'prop-types';

import { FormControl } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';

function RecoveryQuestion({
    recoveryQuestionError,
    onChangeQuestion,
    recoveryQuestion,
}) {
    return (
        <div>
            <FormControl required fullWidth error={!!recoveryQuestionError}>
                <InputLabel htmlFor="recovery-question-input">
                    Recovery question
                </InputLabel>
                <Input
                    id="recovery-question-input"
                    onChange={onChangeQuestion}
                    value={recoveryQuestion}
                    aria-describedby="recovery-question-error-text"
                />
                <FormHelperText id="recovery-question-error-text">
                    {recoveryQuestionError}
                </FormHelperText>
            </FormControl>
        </div>
    );
}

RecoveryQuestion.propTypes = {
    recoveryQuestionError: PropTypes.string,
    onChangeQuestion: PropTypes.func.isRequired,
    recoveryQuestion: PropTypes.string,
};

RecoveryQuestion.defaultProps = {
    recoveryQuestionError: null,
    recoveryQuestion: '',
};

export default RecoveryQuestion;
