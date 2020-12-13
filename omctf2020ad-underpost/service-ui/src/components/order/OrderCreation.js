import React, { Component } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import { createOrder, getAllExistingGoods } from '../../thunks/orders';

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
import { API_URL } from '../../config';

const theme = createMuiTheme();

const styles = theme => ({
    root: {
        marginTop: theme.spacing(10),
    },

    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
});

class OrderCreation extends Component {
    constructor(props) {
        super(props);

        this.onChangeTargetBunkerId = this.onChangeTargetBunkerId.bind(this);
        this.onChangeGoodId = this.onChangeGoodId.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOnCreate = this.handleOnCreate.bind(this);
        this.validateFields = this.validateFields.bind(this);
        this.findGoodImageById = this.findGoodImageById.bind(this);

        this.state = {
            comment: '',
            goodId: '',
            targetId: '',
            showGoods: false,
            errors: {},
        };
    }

    componentDidMount() {
        const { token, getAllExistingGoods } = this.props;

        if (token) {
            getAllExistingGoods(token);
        }
    }

    validateFields() {
        const errors = {};
        const { goodId, targetId } = this.state;

        if (!goodId || goodId.length <= 0) {
            errors.goodId = 'This field is required';
        }

        if (!targetId || targetId.length <= 0) {
            errors.targetId = 'This field is required';
        }

        this.setState({ errors });
        return isEmpty(errors);
    }

    handleOnCreate(e) {
        e.preventDefault();

        const { comment, goodId, targetId } = this.state;
        const { createOrder, handleCloseModal, token } = this.props;

        if (this.validateFields()) {
            createOrder(token, { comment, goodId, targetId });
            handleCloseModal();
        }
    }

    handleCancel(e) {
        e.preventDefault();

        this.props.handleCloseModal();
    }

    onChangeTargetBunkerId(e, v) {
        this.setState({
            targetId: v,
            showGoods: v ? true : false,
        });
    }

    onChangeGoodId(e, v) {
        this.setState({ goodId: v });
    }

    onChangeComment(e) {
        this.setState({ comment: e.target.value });
    }

    findGoodImageById() {
        return (
            this.props.goods.filter(good => good.id === this.state.goodId)[0] ||
            {}
        ).image;
    }

    render() {
        const { bunkers, classes, goods } = this.props;
        const { errors, showGoods, targetId, goodId } = this.state;

        const options = {
            bunkers: [],
            goods: [],
        };

        if (bunkers && bunkers.length > 0) {
            options.bunkers = bunkers.map(bunker => bunker.id);
        }

        if (goods && goods.length > 0) {
            const filteredGoods = goods.filter(
                good => good.producingPlace.id !== targetId
            );

            options.goods = filteredGoods.map(good => good.id);
        }

        return (
            <Container className={classes.root} maxWidth="sm">
                <Card>
                    <CardContent>
                        <div className={classes.header}>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                            >
                                Create Order
                            </Typography>
                        </div>
                        <FormControl
                            required
                            fullWidth
                            error={!!errors.targetId}
                        >
                            <Autocomplete
                                id="target-id-autocomplete"
                                options={options.bunkers}
                                getOptionLabel={option => option}
                                clearOnEscape
                                onChange={this.onChangeTargetBunkerId}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        error={!!errors.targetId}
                                        label="Target bunker"
                                        margin="normal"
                                        required
                                        aria-describedby="target-id-autocomplete-error-text"
                                    />
                                )}
                            />
                            <FormHelperText id="target-id-autocomplete-error-text">
                                {errors.targetId}
                            </FormHelperText>
                        </FormControl>
                        {showGoods && (
                            <FormControl
                                required
                                fullWidth
                                error={!!errors.goodId}
                            >
                                <Autocomplete
                                    id="good-id-autocomplete"
                                    options={options.goods}
                                    getOptionLabel={option => option}
                                    clearOnEscape
                                    onChange={this.onChangeGoodId}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            error={!!errors.goodId}
                                            label="Good"
                                            margin="normal"
                                            required
                                            aria-describedby="good-id-autocomplete-error-text"
                                        />
                                    )}
                                />
                                <FormHelperText id="good-id-autocomplete-error-text">
                                    {errors.goodId}
                                </FormHelperText>
                                {goodId && (
                                    <img
                                        src={
                                            API_URL +
                                            'files/' +
                                            (this.findGoodImageById() || '')
                                        }
                                        style={{
                                            maxHeight: '150px',
                                            maxWidth: '150px',
                                            marginTop: '10px',
                                            marginBottom: '10px',
                                        }}
                                    />
                                )}
                            </FormControl>
                        )}
                        <FormControl fullWidth>
                            <Typography gutterBottom variant="body1">
                                Comment
                            </Typography>
                            <TextareaAutosize
                                id="comment-text-area"
                                onChange={this.onChangeComment}
                                placeholder="Type here..."
                                rowsMin={5}
                            />
                        </FormControl>
                    </CardContent>
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
                            onClick={this.handleOnCreate}
                        >
                            Create Order
                        </Button>
                    </DialogActions>
                </Card>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        bunkers: state.orders.bunkers,
        goods: state.orders.goods,
        token: state.auth.token,
    };
}

const mapDispatchToProps = {
    createOrder,
    getAllExistingGoods,
};

export default withStyles(styles(theme))(
    connect(mapStateToProps, mapDispatchToProps)(OrderCreation)
);
