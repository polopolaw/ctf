import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios, { post } from 'axios';

import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import isEmpty from 'lodash/isEmpty';
import { API_URL } from '../../config';
import { sendCourComplaint } from '../../thunks/complaints';

class CourierComplain extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chosenCourier: {},
            comment: '',
            errors: {},
        };

        this.onChangeCourier = this.onChangeCourier.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.validateFields = this.validateFields.bind(this);
    }

    componentDidMount() {}

    onChangeCourier(e, v) {
        this.setState({ chosenCourier: v || {} });
    }

    handleCancel(e) {
        e.preventDefault();
        this.props.handleCloseModal();
    }

    handleSubmit() {
        if (this.validateFields()) {
            const { chosenCourier, comment } = this.state;
            const { token } = this.props;

            this.props
                .sendCourComplaint(chosenCourier.id, comment, token)
                .then(() => {
                    this.props.handleCloseModal();
                });
        }
    }

    onChangeComment(e) {
        this.setState({ comment: e.target.value });
    }

    validateFields() {
        const errors = {};
        const { chosenCourier, comment } = this.state;

        if (isEmpty(chosenCourier.nickname)) {
            errors.couriers = 'This field is required';
        }

        if (comment == null || comment === '') {
            errors.comment = 'This field is required';
        }

        this.setState({ errors });
        return isEmpty(errors);
    }

    render() {
        const { couriers } = this.props;
        const { errors, comment, chosenCourier } = this.state;

        return (
            <div>
                <FormControl required fullWidth error={!!errors.couriers}>
                    <Autocomplete
                        id="courier-autocomplete"
                        options={couriers}
                        getOptionLabel={option => option.nickname}
                        clearOnEscape
                        onChange={this.onChangeCourier}
                        value={chosenCourier.nickname}
                        renderInput={params => (
                            <TextField
                                {...params}
                                error={!!errors.couriers}
                                label="Porters"
                                margin="normal"
                                required
                                aria-describedby="couriers-autocomplete-error-text"
                            />
                        )}
                    />
                    <FormHelperText id="couriers-autocomplete-error-text">
                        {errors.couriers}
                    </FormHelperText>
                </FormControl>

                <FormControl fullWidth>
                    <Typography gutterBottom variant="body1">
                        Comment
                    </Typography>
                    <TextareaAutosize
                        id="comment-text-area"
                        onChange={this.onChangeComment}
                        placeholder="Type here..."
                        rowsMin={5}
                        value={comment}
                    />
                    <FormHelperText
                        id="couriers-autocomplete-error-text"
                        error={!!errors.comment}
                    >
                        {errors.comment}
                    </FormHelperText>
                </FormControl>
                <DialogActions>
                    <Button
                        size="small"
                        color="primary"
                        onClick={this.handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="small"
                        color="primary"
                        onClick={this.handleSubmit}
                    >
                        Create Complaint
                    </Button>
                </DialogActions>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        couriers: state.complaints.couriers,
    };
}

CourierComplain.propTypes = {
    couriers: PropTypes.arrayOf(PropTypes.shape({})),
    handleCloseModal: PropTypes.func.isRequired,
};

CourierComplain.defaultProps = {
    couriers: [],
};

export default connect(mapStateToProps, { sendCourComplaint })(CourierComplain);
