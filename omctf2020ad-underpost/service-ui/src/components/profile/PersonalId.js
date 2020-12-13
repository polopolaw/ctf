import React from 'react';
import PropTypes from 'prop-types';

import { FormControl } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';

function PersonalId({ personalIdError, personalId, onChangePersonalId }) {
    return (
        <div>
            <FormControl required fullWidth error={personalIdError}>
                <InputLabel htmlFor="personal-id-input">
                    Personal ID number
                </InputLabel>
                <Input
                    id="personal-id-input"
                    onChange={onChangePersonalId}
                    value={personalId}
                    aria-describedby="personal-id-error-text"
                />
                <FormHelperText id="personal-id-error-text">
                    {personalIdError}
                </FormHelperText>
            </FormControl>
        </div>
    );
}

export default PersonalId;
