import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import { createMuiTheme } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import { getAllExistingGoods } from '../../thunks/orders';
import { listCouriers } from '../../thunks/complaints';
import GoodComplain from './GoodComplain';
import CourierComplain from './CourierComplain';

const theme = createMuiTheme();

const styles = theme => ({
    root: {
        marginTop: theme.spacing(10),
    },

    card: {
        minHeight: 150,
    },
});

class ComplaintCreation extends Component {
    constructor(props) {
        super(props);

        this.handleCancel = this.handleCancel.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.validateFields = this.validateFields.bind(this);

        this.state = {
            type: '',
            errors: {},
        };
    }

    componentDidMount() {
        const { token, listCouriers, getAllExistingGoods } = this.props;
        if (token) {
            getAllExistingGoods(token);
            listCouriers(token);
        }
    }

    validateFields() {
        const errors = {};

        this.setState({ errors });
        return isEmpty(errors);
    }

    handleCancel(e) {
        e.preventDefault();
        this.props.handleCloseModal();
    }

    onChangeType(e, v) {
        this.setState({
            type: v,
        });
    }

    render() {
        const { classes } = this.props;
        const { errors, type } = this.state;

        const options = {
            types: ['Delivery Quality', 'Good Quality'],
        };

        return (
            <Container className={classes.root} maxWidth="sm">
                <Card className={classes.card}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Create Complaint
                        </Typography>
                        <FormControl required fullWidth>
                            <Autocomplete
                                id="types-autocomplete"
                                options={options.types}
                                getOptionLabel={option => option}
                                clearOnEscape
                                onChange={this.onChangeType}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        error={!!errors.type}
                                        label="Type of complaint"
                                        margin="normal"
                                        required
                                        aria-describedby="type-autocomplete-error-text"
                                    />
                                )}
                            />
                            <FormHelperText id="type-autocomplete-error-text">
                                {errors.type}
                            </FormHelperText>
                        </FormControl>
                        {type === 'Delivery Quality' && (
                            <CourierComplain
                                handleCloseModal={this.props.handleCloseModal}
                            />
                        )}
                        {type === 'Good Quality' && (
                            <GoodComplain
                                handleCloseModal={this.props.handleCloseModal}
                            />
                        )}
                        {(type == null || type === '') && (
                            <DialogActions>
                                <Button
                                    size="small"
                                    color="primary"
                                    onClick={this.props.handleCloseModal}
                                >
                                    Cancel
                                </Button>
                            </DialogActions>
                        )}
                    </CardContent>
                </Card>
            </Container>
        );
    }
}
function mapStateToProps(state) {
    return {
        token: state.auth.token,
    };
}

const mapDispatchToProps = {
    listCouriers,
    getAllExistingGoods,
};

export default withStyles(styles(theme))(
    connect(mapStateToProps, mapDispatchToProps)(ComplaintCreation)
);
