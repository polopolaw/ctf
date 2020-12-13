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
import ImageUploader from '../ImageUploader';
import { API_URL } from '../../config';
import { sendGoodComplaint } from '../../thunks/complaints';

class GoodComplain extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chosenGood: {},
            comment: '',
            imagePreviewUrl: '',
            imageFile: null,
            errors: {},
        };

        this.onChangeGood = this.onChangeGood.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.validateFields = this.validateFields.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
    }

    componentDidMount() {}

    onChangeGood(e, v) {
        this.setState({ chosenGood: v || {} });
    }

    handleCancel(e) {
        e.preventDefault();
        this.props.handleCloseModal();
    }

    handleSubmit() {
        if (this.validateFields()) {
            const { chosenGood, comment, imageFile } = this.state;
            const { token } = this.props;

            this.props.sendGoodComplaint(
                chosenGood.id,
                comment,
                imageFile,
                token
            ).then(() =>{
                this.props.handleCloseModal();
            });
        }
    }

    onChangeComment(e) {
        this.setState({ comment: e.target.value });
    }

    onChangeImage(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                imageFile: file,
                imagePreviewUrl: reader.result,
            });
        };
        reader.readAsDataURL(file);
    }

    validateFields() {
        const errors = {};
        const { chosenGood, comment } = this.state;

        if (isEmpty(chosenGood.name)) {
            errors.good = 'This field is required';
        }

        if (isEmpty(comment)) {
            errors.comment = 'This field is required';
        }

        this.setState({ errors });
        return isEmpty(errors);
    }

    render() {
        const { goods } = this.props;
        const { errors, comment, chosenGood, imagePreviewUrl } = this.state;       

        return (
            <div>
                <FormControl required fullWidth error={!!errors.good}>
                    <Autocomplete
                        id="good-autocomplete"
                        options={ goods }
                        getOptionLabel={option => option.name}
                        clearOnEscape
                        onChange={this.onChangeGood}
                        value={ chosenGood.name }
                        renderInput={params => (
                            <TextField
                                {...params}
                                error={!!errors.good}
                                label="Good"
                                margin="normal"
                                required
                                aria-describedby="good-autocomplete-error-text"
                            />
                        )}
                    />
                    <FormHelperText id="good-autocomplete-error-text">
                        {errors.good}
                    </FormHelperText>
                </FormControl>

                <FormControl fullWidth error={!!errors.comment}>
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
                    <FormHelperText id="good-autocomplete-error-text">
                        {errors.comment}
                    </FormHelperText>
                </FormControl>
                <ImageUploader
                    imagePreviewUrl={imagePreviewUrl}
                    onChangeImage={this.onChangeImage}
                />
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
        goods: state.orders.goods,
    };
}

GoodComplain.propTypes = {
    goods: PropTypes.arrayOf(PropTypes.shape({})),
    handleCloseModal: PropTypes.func.isRequired,
};

GoodComplain.defaultProps = {
    goods: [],
};

export default connect(mapStateToProps, { sendGoodComplaint })(GoodComplain);
