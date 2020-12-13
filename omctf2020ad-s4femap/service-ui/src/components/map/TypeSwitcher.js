import React, { Component } from 'react';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import anomaly from '../../assets/img/anomaly-blur.png';
import obstacle from '../../assets/img/difficulty-blur.png';
import enemy from '../../assets/img/fight-blur.png';
import loot from '../../assets/img/blur-loot.png';
import sensor from '../../assets/img/sensor-blur.png';
import assistance from '../../assets/img/ladder-blur.png';

import { getAllMarks } from '../../thunks/map';

class TypeSwitcher extends Component {
    constructor(props) {
        super(props);

        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick(value) {
        let newFilter = value;
        if (newFilter === 'noFilters') {
            newFilter = null;
        }

        const { getAllMarks, token, filter } = this.props;

        getAllMarks(token, newFilter);
    }

    componentDidMount() {
        const { getAllMarks, token, filter } = this.props;

        getAllMarks(token, filter);
    }

    render() {
        const { filter } = this.props;

        return (
            <div
                style={{
                    marginRight: '30px',
                    marginBottom: '2px',
                    marginTop: '2px',
                }}
            >
                <Chip
                    key="noFilters"
                    label="No Filters"
                    clickable
                    onClick={() => this.handleButtonClick('noFilters')}
                    variant="outlined"
                    color={(!filter && 'primary') || 'default'}
                    style={{ marginLeft: '2px', marginRight: '2px' }}
                />
                <Chip
                    key="anomaly"
                    label="Anomalies"
                    avatar={
                        <Avatar
                            alt="anomaly"
                            src={anomaly}
                            style={{ backgroundColor: 'transparent' }}
                        />
                    }
                    clickable
                    onClick={() => this.handleButtonClick('anomaly')}
                    variant="outlined"
                    color={(filter === 'anomaly' && 'primary') || 'default'}
                    style={{ marginLeft: '2px', marginRight: '2px' }}
                />

                <Chip
                    key="sensor"
                    label="Sensors"
                    avatar={
                        <Avatar
                            alt="sensor"
                            src={sensor}
                            style={{ backgroundColor: 'transparent' }}
                        />
                    }
                    clickable
                    onClick={() => this.handleButtonClick('sensor')}
                    variant="outlined"
                    color={(filter === 'sensor' && 'primary') || 'default'}
                    style={{ marginLeft: '2px', marginRight: '2px' }}
                />

                <Chip
                    key="enemy"
                    label="Enemies"
                    avatar={
                        <Avatar
                            alt="enemy"
                            src={enemy}
                            style={{ backgroundColor: 'transparent' }}
                        />
                    }
                    clickable
                    onClick={() => this.handleButtonClick('enemy')}
                    variant="outlined"
                    color={(filter === 'enemy' && 'primary') || 'default'}
                    style={{ marginLeft: '2px', marginRight: '2px' }}
                />
                <Chip
                    key="obstacle"
                    label="Obstacles"
                    avatar={
                        <Avatar
                            alt="obstacle"
                            src={obstacle}
                            style={{ backgroundColor: 'transparent' }}
                        />
                    }
                    clickable
                    onClick={() => this.handleButtonClick('obstacle')}
                    variant="outlined"
                    color={(filter === 'obstacle' && 'primary') || 'default'}
                    style={{ marginLeft: '2px', marginRight: '2px' }}
                />
                <Chip
                    key="assistance"
                    label="Assistance"
                    avatar={
                        <Avatar
                            alt="assistance"
                            src={assistance}
                            style={{ backgroundColor: 'transparent' }}
                        />
                    }
                    clickable
                    onClick={() => this.handleButtonClick('assistance')}
                    variant="outlined"
                    color={(filter === 'assistance' && 'primary') || 'default'}
                    style={{ marginLeft: '2px', marginRight: '2px' }}
                />
                <Chip
                    key="loot"
                    label="Loot"
                    avatar={
                        <Avatar
                            alt="loot"
                            src={loot}
                            style={{ backgroundColor: 'transparent' }}
                        />
                    }
                    clickable
                    onClick={() => this.handleButtonClick('loot')}
                    variant="outlined"
                    color={(filter === 'loot' && 'primary') || 'default'}
                    style={{ marginLeft: '2px', marginRight: '2px' }}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        filter: state.cells.filter,
    };
}

const mapDispatchToProps = {
    getAllMarks,
};

export default connect(mapStateToProps, mapDispatchToProps)(TypeSwitcher);
