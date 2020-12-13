import React, { Component } from 'react';
import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import privateIcon from '../../assets/img/private.png';
import comments from '../../assets/img/comments.png';
import PropTypes from 'prop-types';
import liked from '../../assets/img/liked.png';
import anomaly from '../../assets/img/anomaly-blur.png';
import obstacle from '../../assets/img/difficulty-blur.png';
import enemy from '../../assets/img/fight-blur.png';
import loot from '../../assets/img/blur-loot.png';
import sensor from '../../assets/img/sensor-blur.png';
import assistance from '../../assets/img/ladder-blur.png';

import { getSelectedCellMarks } from '../../thunks/map';

class MarkInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mark: this.props.mark,
        };

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.getSelectedCellMarks({
            token: this.props.token,
            x: this.props.mark.x,
            y: this.props.mark.y,
        });
    }

    componentDidMount() {}

    getIcon(markType) {
        switch (markType) {
            case 'obstacle':
                return obstacle;
            case 'enemy':
                return enemy;
            case 'loot':
                return loot;
            case 'sensor':
                return sensor;
            case 'assistance':
                return assistance;
            default:
                return anomaly;
        }
    }

    render() {
        const { mark } = this.props;

        let icon = this.getIcon(mark.markType);

        return (
            <Container
                key={mark.id}
                style={{
                    marginBottom: '5px',
                    minWidth: '230px',
                    cursor: 'pointer',
                }}
            >
                <Card onClick={this.onClick}>
                    <CardContent>
                        <div>
                            <Typography component="h5" noWrap paragraph>
                                Location: {'[' + mark.x + ',' + mark.y + ']'}
                            </Typography>
                            <Typography component="h2" variant="h6" noWrap>
                                <img
                                    src={icon}
                                    alt={mark.markType}
                                    style={{
                                        maxHeight: '20px',
                                        maxWidth: '20px',
                                    }}
                                />
                                {mark.name}
                                {mark.isPrivate && (
                                    <img
                                        src={privateIcon}
                                        alt="private"
                                        style={{
                                            maxHeight: '15px',
                                            maxWidth: '15px',
                                        }}
                                    />
                                )}
                            </Typography>
                        </div>
                        {mark.markType === 'sensor' && (
                            <div style={{ marginTop: '3px' }}>
                                {mark.sensorData}
                            </div>
                        )}
                        <div>
                            <table border="0">
                                <tbody>
                                    <tr>
                                        <td>
                                            <div>{mark.author}</div>
                                        </td>
                                        <td>
                                            <div
                                                style={{
                                                    textAlign: 'center',
                                                    padding: '6px 16px',
                                                }}
                                            >
                                                <img
                                                    src={liked}
                                                    alt="likes"
                                                    style={{
                                                        maxHeight: '15px',
                                                        maxWidth: '15px',
                                                    }}
                                                />
                                                {this.state.mark.likes}
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <img
                                                    src={comments}
                                                    alt="comments"
                                                    style={{
                                                        maxHeight: '15px',
                                                        maxWidth: '15px',
                                                    }}
                                                />
                                                {mark.comments}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        marks: state.selected.marks, //to refresh on change
    };
}

const mapDispatchToProps = { getSelectedCellMarks: getSelectedCellMarks };

MarkInfo.propTypes = {
    mark: PropTypes.shape({}),
};

MarkInfo.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MarkInfo);
