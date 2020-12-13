import React, { Component } from 'react';

import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';

import { withStyles } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import MarkDetails from './MarkDetails';
import AddNewMark from './AddNewMark';

const theme = createMuiTheme();

const styles = theme => ({
    root: {},
    form: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    paper: {
        //marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
});

class MarksList extends Component {
    constructor(props) {
        super(props);

        this.expandHandler = this.expandHandler.bind(this);

        this.state = {
            expandedMarkId: '',
            errors: {},
        };
    }

    expandHandler(id) {
        this.setState({ expandedMarkId: id });
    }

    render() {
        const { errors, expandedMarkId } = this.state;
        const { classes, x, y, marks } = this.props;
        let isValidCellLocation = x != -1 && y != -1;
        const listItems =
            (isValidCellLocation &&
                marks &&
                marks.map(mark => (
                    <MarkDetails
                        key={mark.id}
                        mark={mark}
                        expanded={mark.id == expandedMarkId}
                        onExpand={this.expandHandler}
                    />
                ))) ||
            ' ';

        return (
            <Container>
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5" noWrap paragraph>
                        Location:{' '}
                        {(isValidCellLocation && '[' + x + ',' + y + ']') ||
                            '[ Unknown ]'}
                    </Typography>
                </div>
                <div>{isValidCellLocation && <AddNewMark />}</div>
                <div>{listItems}</div>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        x: state.selected.x,
        y: state.selected.y,
        marks: state.selected.marks,
    };
}

const mapDispatchToProps = {};

export default withStyles(styles(theme))(
    connect(mapStateToProps, mapDispatchToProps)(MarksList)
);
