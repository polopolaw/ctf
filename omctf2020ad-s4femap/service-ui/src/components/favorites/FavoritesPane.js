import React, { Component } from 'react';
import { connect } from 'react-redux';

import FavoriteIcon from '@material-ui/icons/Favorite';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import MarkInfo from './MarkInfo';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Typography from '@material-ui/core/Typography';
import { getFavorites } from '../../thunks/map';

class FavoritesPane extends Component {
    constructor(props) {
        super(props);      

        this.state = {
            isDrawerOpened: false,
        };        
    }      

    componentDidMount() {
        this.props.getFavorites(this.props.token);
    }

    render() {
        const { marks } = this.props;

        const toggleDrawer = open => event => {
            if (
                event &&
                event.type === 'keydown' &&
                (event.key === 'Tab' || event.key === 'Shift')
            ) {
                return;
            }

            this.setState({ ...this.state, isDrawerOpened: open });
        };

        const listItems = (marks.length > 0 &&
            marks.map(mark => <MarkInfo key={mark.id} mark={mark} on />)) || (
            <div
                style={{
                    marginBottom: '5px',
                    minWidth: '230px',
                    textAlign: 'center',
                }}
            >
                No favorites yet.
            </div>
        );

        return (
            <div>
                <Button onClick={toggleDrawer(true)}>
                    <FavoriteIcon />
                    Favorites
                </Button>
                <SwipeableDrawer
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                    open={this.state.isDrawerOpened}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                    <div style={{ marginTop: '20px' }}>
                        <Typography
                            component="h1"
                            variant="h5"
                            noWrap
                            paragraph
                            style={{
                                textAlign: 'center',
                                marginLeft: '24px',
                                marginRight: '24px',
                            }}
                        >
                            <FavoriteIcon />
                            Favorites
                        </Typography>
                        {listItems}
                    </div>
                </SwipeableDrawer>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        marks: state.cells.favorites,
    };
}

FavoritesPane.propTypes = {
    marks: PropTypes.arrayOf(PropTypes.shape({})),
};

FavoritesPane.defaultProps = {
    marks: [],
};

export default connect(mapStateToProps, { getFavorites })(FavoritesPane);
