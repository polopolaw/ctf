import React, { Component } from 'react';

import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import AccountCircle from '@material-ui/icons/AccountCircle';
import privateIcon from '../../assets/img/private.png';

class Comment extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { author, description, isPrivate } = this.props;

        return (
            <div>
                <div
                    style={{
                        marginTop: '5px',
                        marginBottom: '5px',
                        color: 'LightSlateGrey',
                        fontSize: 'small',
                        verticalAlign: 'middle',
                        textAlign: 'right',
                    }}
                >
                    {isPrivate && (
                        <img
                            src={privateIcon}
                            style={{
                                verticalAlign: 'middle',
                                maxHeight: '14px',
                                maxWidth: '14px',
                            }}
                        />
                    )}{' '}
                    &nbsp;
                    <AccountCircle
                        style={{
                            verticalAlign: 'middle',
                            maxHeight: '14px',
                            maxWidth: '14px',
                        }}
                    />
                    &nbsp;{author}
                </div>
                <div
                    style={{
                        marginTop: '5px',
                        marginBottom: '5px',
                        color: 'green',
                    }}
                >
                    {description}
                </div>
                <Divider />
            </div>
        );
    }
}

Comment.propTypes = {
    author: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isPrivate: PropTypes.bool.isRequired,
};

Comment.defaultProps = {};

export default Comment;
