import React, { Component } from 'react';
import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import { FormControl, FormControlLabel } from '@material-ui/core';
import anomaly from '../assets/img/anomaly-blur.png';
import obstacle from '../assets/img/difficulty-blur.png';
import enemy from '../assets/img/fight-blur.png';
import loot from '../assets/img/blur-loot.png';
import sensor from '../assets/img/sensor-blur.png';
import assistance from '../assets/img/ladder-blur.png';
import { loadCouriers } from '../thunks/users';
import { newMark, getAllMarks } from '../thunks/map';
import { AddCircle } from '@material-ui/icons';
import FormHelperText from '@material-ui/core/FormHelperText';
import Avatar from '@material-ui/core/Avatar';

const icons = {
    obstacle: obstacle,
    enemy: enemy,
    loot: loot,
    sensor: sensor,
    assistance: assistance,
    anomaly: anomaly,
};

class AddNewMark extends Component {
    constructor(props) {
        super(props);

        this.handleAddMark = this.handleAddMark.bind(this);
        this.handleChangeMarkName = this.handleChangeMarkName.bind(this);
        this.handleChangeSensorCode = this.handleChangeSensorCode.bind(this);
        this.handleExpandChange = this.handleExpandChange.bind(this);
        this.handleIsPrivateChange = this.handleIsPrivateChange.bind(this);
        this.validateMark = this.validateMark.bind(this);

        this.state = {
            newMarkType: '',
            newMarkName: '',
            newMarkSensorCode: '',
            newMarkIsPrivate: false,
            newMarkSharedWith: '',
            expanded: false,
            errors: {
                newMarkType: null,
                newMarkName: null,
                newMarkSensorCode: null,
                newMarkIsPrivate: null,
                newMarkSharedWith: null,
            },
        };
    }

    componentDidMount() {
        this.props.loadCouriers(this.props.token);
    }

    handleChangeMarkName(e) {
        this.setState({ newMarkName: e.target.value });
    }

    handleChangeSensorCode(e) {
        this.setState({ newMarkSensorCode: e.target.value });
    }

    handleExpandChange(e) {
        let currentExpandedState = this.state.expanded;
        this.setState({ expanded: !currentExpandedState });
    }

    handleIsPrivateChange(e) {
        let currentIsPrivateState = this.state.newMarkIsPrivate;
        this.setState({ newMarkIsPrivate: !currentIsPrivateState });
    }

    validateMark() {
        if (
            this.state.newMarkType === 'sensor' &&
            (this.state.newMarkSensorCode.length <= 5 ||
                this.state.newMarkSensorCode.length >= 100)
        ) {
            const errors = {};
            errors.newMarkSensorCode =
                'Code must contain more then 5 symbols and less then 100';
            this.setState({ errors });
            return false;
        }

        return true;
    }

    handleAddMark() {
        let data = {
            token: this.props.token,
            x: this.props.x,
            y: this.props.y,
            name: this.state.newMarkName,
            markType: this.state.newMarkType,
            sensorCode: this.state.newMarkSensorCode,
            isPrivate: this.state.newMarkIsPrivate,
            sharedWith: this.state.newMarkSharedWith.login,
        };

        if (!this.validateMark()) {
            return;
        }

        this.props
            .addNewMark(data)
            .then(() => {
                this.setState({
                    newMarkType: '',
                    newMarkName: '',
                    newMarkSensorCode: '',
                    newMarkIsPrivate: false,
                    newMarkSharedWith: '',
                    expanded: false,
                });
            })
            .then(() => {
                this.props.refreshMap(this.props.token, this.props.filter);
            })
            .catch(error => {
                this.setState({ error: { api: error } });
            });
    }

    render() {
        const { newMarkSharedWith, errors } = this.state;
        let couriers = this.props.couriers || [];
        let markTypes = [
            'anomaly',
            'enemy',
            'obstacle',
            'sensor',
            'assistance',
            'loot',
        ];
        let ctrlStyle = { marginBottom: '10px' };

        return (
            <Container style={{ marginBottom: '5px', minWidth: '230px' }}>
                <Card>
                    <CardContent>
                        <Button onClick={this.handleExpandChange}>
                            <AddCircle style={{ marginRight: '5px' }} />
                            New Mark
                        </Button>
                        {this.state.expanded && (
                            <div>
                                <FormControl
                                    fullWidth
                                    error={!!errors.newMarkIsPrivate}
                                    style={ctrlStyle}
                                >
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={
                                                    this.state.newMarkIsPrivate
                                                }
                                                onChange={
                                                    this.handleIsPrivateChange
                                                }
                                                name="newMarkIsPrivate"
                                                color="secondary"
                                            />
                                        }
                                        label="Private"
                                    />
                                </FormControl>
                                {this.state.newMarkIsPrivate && (
                                    <FormControl
                                        fullWidth
                                        required
                                        error={!!errors.newMarkSharedWith}
                                        style={ctrlStyle}
                                    >
                                        <Autocomplete
                                            id="newMarkSharedWith"
                                            options={couriers}
                                            getOptionLabel={itm => itm.login}
                                            onChange={(event, newValue) => {
                                                this.setState({
                                                    newMarkSharedWith: newValue,
                                                });
                                            }}
                                            value={newMarkSharedWith}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label="Shared with"
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    </FormControl>
                                )}
                                <FormControl
                                    required
                                    fullWidth
                                    error={!!errors.newMarkType}
                                    style={ctrlStyle}
                                >
                                    <Autocomplete
                                        id="newMarkType"
                                        options={markTypes}
                                        getOptionLabel={itm => itm}
                                        onChange={(event, newValue) => {
                                            this.setState({
                                                newMarkType: newValue,
                                            });
                                        }}
                                        renderOption={itm => (
                                            <React.Fragment>
                                                <span
                                                    style={{
                                                        marginRight: '10px',
                                                    }}
                                                >
                                                    <Avatar
                                                        style={{
                                                            maxWidth: '20px',
                                                            maxHeight: '20px',
                                                        }}
                                                        src={icons[itm]}
                                                        alt={itm}
                                                    />
                                                </span>
                                                {itm}
                                            </React.Fragment>
                                        )}
                                        value={this.state.newMarkType}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label="Type"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </FormControl>
                                {this.state.newMarkType === 'sensor' && (
                                    <FormControl
                                        required
                                        fullWidth
                                        error={!!errors.newMarkSensorCode}
                                        style={ctrlStyle}
                                    >
                                        <TextField
                                            id="newMarkSensorCode"
                                            label="Sensor Code"
                                            variant="filled"
                                            value={this.state.newMarkSensorCode}
                                            onChange={
                                                this.handleChangeSensorCode
                                            }
                                            aria-describedby="sensor-code-error"
                                        />
                                        <FormHelperText id="sensor-code-error">
                                            {errors.newMarkSensorCode}
                                        </FormHelperText>
                                    </FormControl>
                                )}

                                <FormControl
                                    required
                                    fullWidth
                                    error={!!errors.newMarkName}
                                    style={ctrlStyle}
                                >
                                    <TextField
                                        id="newMarkName"
                                        onChange={this.handleChangeMarkName}
                                        label="Mark Name"
                                        variant="filled"
                                        value={this.state.newMarkName}
                                    />
                                </FormControl>

                                <DialogActions>
                                    <Button
                                        id="add"
                                        size="small"
                                        color="primary"
                                        onClick={this.handleAddMark}
                                    >
                                        Add
                                    </Button>
                                </DialogActions>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        x: state.selected.x,
        y: state.selected.y,
        token: state.auth.token,
        couriers: state.couriers.users,
        filter: state.cells.filter,
    };
}

const mapDispatchToProps = {
    loadCouriers: loadCouriers,
    addNewMark: newMark,
    refreshMap: getAllMarks,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewMark);
