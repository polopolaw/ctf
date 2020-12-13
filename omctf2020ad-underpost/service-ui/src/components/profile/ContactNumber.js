import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { FormControl } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

const contactNumberOptions = ['BRG', 'EKC'];

function ContactNumber({
    errors,
    onChangePrefix,
    contactNumberPrefix,
    onChangeContactNumber,
    contactNumber,
}) {
    return (
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
                            onChange={onChangePrefix}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    error={!!errors.contactNumberPrefix}
                                    label="Prefix"
                                    required
                                    aria-describedby="contact-number-autocomplete-error-text"
                                />
                            )}
                            value={contactNumberPrefix}
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
                            onChange={onChangeContactNumber}
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
    );
}

ContactNumber.propTypes = {
    errors: PropTypes.object,
    onChangePrefix: PropTypes.func.isRequired,
    contactNumberPrefix: PropTypes.string,
    onChangeContactNumber: PropTypes.func.isRequired,
    contactNumber: PropTypes.string,
};

ContactNumber.defaultProps = {
    errors: {},
    contactNumberPrefix: '',
    contactNumber: '',
};

export default ContactNumber;
