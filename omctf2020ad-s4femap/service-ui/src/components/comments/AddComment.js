import React, { Component } from 'react';

import PropTypes from 'prop-types';

import AddCommentIcon from '@material-ui/icons/AddComment';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DialogActions from '@material-ui/core/DialogActions';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import { FormControl } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { connect } from 'react-redux';
import { addComment } from '../../thunks/map';


class AddComment extends Component {
    constructor(props) {
        super(props);

        this.onChangeIsPrivate = this.onChangeIsPrivate.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);          
        this.onExpandComment = this.onExpandComment.bind(this);
        this.onAddComment = this.onAddComment.bind(this);

        this.state = {
            expanded: false,
            commentText: '',
            isPrivate: false,
            sharedWith: '',            
        };
    }

    onChangeIsPrivate(e, v) {
        if (!v) {
            this.setState({
                isPrivate: false,
                sharedWith: '',
            });
        } else {
            this.setState({
                isPrivate: true,
            });
        }
    }

    onAddComment() {
        this.props.addComment(
            this.props.token, 
            this.props.mark.id, 
            { 
                description: this.state.commentText, 
                isPrivate: this.state.isPrivate, 
                sharedWith: this.state.sharedWith.login, 
            })
        .then(() => {                
            this.setState({
                commentText: '',
                isPrivate: false,
                sharedWith: '',
                expanded: false
            });

            if(this.props.onAdd) {
                this.props.onAdd(); //notify parent
            }

        }); 
    }

    onExpandComment() {        
        this.setState({
            expanded: !this.state.expanded,
        });
    }  

    onChangeComment(e) {
        this.setState({
            commentText: e.target.value,
        });
    }

    render() {
        const { couriers, mark } = this.props;
        const { isPrivate, sharedWith, commentText, expanded } = this.state;
        let allowedSharedWith = (mark.isPrivate && couriers.filter(c => c.login===mark.author || c.login===mark.sharedWith)) || couriers;

        return (
            <div style={{ marginTop: '15px' }}>
                <Grid container spacing={1} alignItems="flex-end">
                    <Grid item>
                        <Button onClick={this.onExpandComment}>
                            <AddCommentIcon />&nbsp;&nbsp;NEW COMMENT
                        </Button>
                    </Grid>                    
                </Grid>
                {expanded && (
                 <div>
                    <FormControl >
                        <TextField
                            id="comment-input"
                            label="Comment"
                            value={commentText}
                            onChange={this.onChangeComment}
                        />
                    </FormControl>
                    <FormControlLabel
                        style={{ marginTop: '15px', marginLeft: '3px' }}
                        control={
                            <Switch
                                size="small"
                                checked={isPrivate}
                                onChange={this.onChangeIsPrivate}
                            />
                        }
                        label="Private"
                    /> 
                </div>)      
                }          
                {expanded && isPrivate && (
                    <FormControl
                        fullWidth
                        required
                        style={{ marginBottom: '10px' }}
                    >
                        <Autocomplete
                            id="new-comment"
                            options={allowedSharedWith}
                            getOptionLabel={item => item.login || ""}
                            onChange={(event, value) => {
                                this.setState({
                                    sharedWith: value,
                                });
                            }}
                            value={sharedWith}
                            renderInput={params => (
                                <TextField {...params} label="Shared with" />
                            )}
                        />
                    </FormControl>
                )}                

                { expanded && (
                    <DialogActions style={{ marginBottom: '2px'}}>
                        <Button
                            id="add"
                            size="small"
                            color="primary"
                            onClick={this.onAddComment}
                        >
                            Add
                        </Button>
                    </DialogActions>)
                }
            </div>
        );
    }
}

AddComment.propTypes = {
    couriers: PropTypes.arrayOf(PropTypes.shape({})),
    mark: PropTypes.shape({}),    
};

AddComment.defaultProps = {
    couriers: [],
};

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        couriers: state.couriers.users,        
    };
}

const mapDispatchToProps = {    
    addComment,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddComment);
