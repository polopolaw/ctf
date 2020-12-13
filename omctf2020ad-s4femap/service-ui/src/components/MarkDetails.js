import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import anomaly from '../assets/img/anomaly-blur.png';
import obstacle from '../assets/img/difficulty-blur.png';
import enemy from '../assets/img/fight-blur.png';
import loot from '../assets/img/blur-loot.png';
import sensor from '../assets/img/sensor-blur.png';
import assistance from '../assets/img/ladder-blur.png';
import privateIcon from '../assets/img/private.png';
import liked from '../assets/img/liked.png';
import unliked from '../assets/img/unliked.png';
import comments from '../assets/img/comments.png';
import { connect } from 'react-redux';
import { getSelectedCellMarks, likeMark } from '../thunks/map';
import CommentsPanel from './comments/CommentsPanel';
import Tooltip from '@material-ui/core/Tooltip';

class MarkDetails extends Component {
    constructor(props) {
        super(props);
        this.onOpenComments = this.onOpenComments.bind(this);
        this.onToggleLikes = this.onToggleLikes.bind(this);

        this.state = {
            mark: this.props.mark,
            isCommentsPanelOpen: false,
        };
    }
    componentDidMount() {
        const { token, mark } = this.props;
        // just for understanding how to fix
        this.props.getSelectedCellMarks({ token, x: mark.x, y: mark.y });
        this.setState({
            mark: this.props.mark,
        });
    }

    onOpenComments() {
        this.setState({
            isCommentsPanelOpen: !this.state.isCommentsPanelOpen,
        });
    }

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

    onToggleLikes(markId) {
        const { token, mark } = this.props;

        this.props
            .likeMark({ token, markId, x: mark.x, y: mark.y })
            .then(updatedMark => {
                this.setState({
                    mark: updatedMark,
                });
            });
    }

    render() {
        const { mark, isCommentsPanelOpen } = this.state; //internal state

        if (!mark) {
            return <div />;
        }

        mark.comments = this.props.marks
            .filter(x => x.id === mark.id)
            .reduce((a, i) => (a = i.comments), mark.comments);

        let icon = this.getIcon(mark.markType);
        let likesIcon = (mark.isLiked && liked) || unliked;

        return (
            <Container
                key={mark.id}
                style={{ marginBottom: '5px', minWidth: '230px' }}
            >
                <Card>
                    <CardContent>
                        <div>
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
                                            <Tooltip title="Like">
                                                <Button
                                                    onClick={() =>
                                                        this.onToggleLikes(
                                                            mark.id
                                                        )
                                                    }
                                                >
                                                    <img
                                                        src={likesIcon}
                                                        alt="likes"
                                                        style={{
                                                            maxHeight: '15px',
                                                            maxWidth: '15px',
                                                        }}
                                                    />
                                                    {this.state.mark.likes}
                                                </Button>
                                            </Tooltip>
                                        </td>
                                        <td>
                                            <Tooltip title="Show comments">
                                                <Button
                                                    onClick={
                                                        this.onOpenComments
                                                    }
                                                >
                                                    <img
                                                        src={comments}
                                                        alt="comments"
                                                        style={{
                                                            maxHeight: '15px',
                                                            maxWidth: '15px',
                                                        }}
                                                    />
                                                    {mark.comments}
                                                </Button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {isCommentsPanelOpen ? (
                            <CommentsPanel mark={this.state.mark} />
                        ) : null}
                    </CardContent>
                </Card>
            </Container>
        );
    }
}

MarkDetails.propTypes = {
    mark: PropTypes.shape({}),
    likes: PropTypes.number,
};

MarkDetails.defaultProps = {
    mark: null,
};

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        marks: state.selected.marks, //to refresh on change
    };
}

export default connect(mapStateToProps, { likeMark, getSelectedCellMarks })(
    MarkDetails
);
