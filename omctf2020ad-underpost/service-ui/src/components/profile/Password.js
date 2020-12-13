import React from 'react';
import PropTypes from 'prop-types';

import { FormControl } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';

function Password({ passwordError, onChangePassword, password }) {
    return (
        <div>
            <FormControl fullWidth error={!!passwordError}>
                <InputLabel htmlFor="password-input">New password</InputLabel>
                <Input
                    id="password-input"
                    onChange={onChangePassword}
                    value={password}
                    type="password"
                    aria-describedby="password-error-text"
                />
                <FormHelperText id="password-error-text">
                    {passwordError}
                </FormHelperText>
            </FormControl>
        </div>
    );
}

Password.propTypes = {
    passwordError: PropTypes.string,
    onChangePassword: PropTypes.func.isRequired,
    password: PropTypes.string,
};

Password.defaultProps = {
    passwordError: null,
    password: '',
};

export default Password;
