import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AddComment from './AddComment';
import Comment from './Comment';
import Divider from '@material-ui/core/Divider';
import { loadCouriers } from '../../thunks/users';
import { loadComments } from '../../thunks/map';

class CommentsPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mark: props.mark,
        };

        this.onAddComment = this.onAddComment.bind(this);
    }

    onAddComment() {
        this.setState({ mark: this.state.mark }); //reload since by mark is object by ref
    }

    componentDidMount() {
        const { token, mark } = this.props;

        this.props.loadCouriers(token);
        this.props
            .loadComments({ token: token, markId: mark.id })
            .then(data => {
                let updating = this.state.mark;
                updating.commentsData = data || [];
                this.setState({ mark: updating });
            });
    }

    render() {
        const { mark } = this.state;
        let comments = mark.commentsData || [];

        const commentsComponents = comments.map(com => (
            <Comment
                key={com.id}
                author={com.author}
                description={com.description}
                isPrivate={com.isPrivate}
            />
        ));
        return (
            <div>
                <h4>Comments:</h4>
                <AddComment mark={mark} onAdd={this.onAddComment} />
                <Divider />
                <div style={{ maxHeight: 200, overflow: 'auto' }}>
                    {commentsComponents}
                </div>
            </div>
        );
    }
}

CommentsPanel.propTypes = {
    mark: PropTypes.shape({}),
};

CommentsPanel.defaultProps = {
    mark: {},
};

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        marks: state.selected.marks, //need to update on marsk changes
    };
}

export default connect(mapStateToProps, { loadCouriers, loadComments })(
    CommentsPanel
);
