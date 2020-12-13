import React, { Component } from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Cell from '../components/map/Cell';
import Bunker from '../components/map/Bunker';

import MarksList from '../components/MarksList';
import TypeSwitcher from '../components/map/TypeSwitcher';

import { styleForCell } from '../utils/helpers';
import { getAllMarks, getSelectedCellMarks } from '../thunks/map';
import { getAllExistingBunkers } from '../thunks/bunkers';
import area from '../assets/img/good-map.png';
import { withStyles } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import FavoritesPane from '../components/favorites/FavoritesPane';
import MarkSearch from '../components/MarkSearch';

const width = 50;
const height = 50;

function lineOfCells(y, cells, cellClickHandler, selected) {
    const components = [];
    let shift = '-28px';
    if (y === 0) shift = '-13px';

    const yCoord = (
        <td
            key={'yCoordLeft' + y}
            style={{
                verticalAlign: 'middle',
                color: 'white',
                position: 'relative',
            }}
        >
            <div style={{ position: 'absolute', marginTop: shift }}>{y}</div>
        </td>
    );

    components.push(yCoord); //on left
    for (let x = 0; x < width; x++) {
        let isSelected = selected && x == selected.x && y == selected.y;
        components.push(
            <Cell
                key={'cell' + x + '_' + y}
                positionX={x}
                positionY={y}
                cells={cells}
                cellClickHandler={cellClickHandler}
                isSelected={isSelected}
            />
        );
    }
    let emptyCell = (
        <td key={'emptyCell' + y} style={{ minWidth: '50px' }}>
            <div>&nbsp;</div>
        </td>
    );
    components.push(emptyCell); //because even rows shifted
    const yCoordRight = (
        <td
            key={'yCoordRight' + y}
            style={{
                verticalAlign: 'middle',
                color: 'white',
                position: 'relative',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    marginTop: shift,
                    marginLeft: '-22px',
                }}
            >
                {y}
            </div>
        </td>
    );
    components.push(yCoordRight); //on right
    return components;
}

function tableBody(bunkers, cells, cellClickHandler, selected) {
    const components = [];
    const xCoords = [];
    for (let x = -1; x < width; x++) {
        if (x === -1) {
            xCoords.push(
                <td
                    key={'xCoordTopEmpty'}
                    style={{
                        textAlign: 'center',
                        color: 'white',
                        minWidth: '16px',
                    }}
                >
                    &nbsp;
                </td>
            );
        } else if (x < width) {
            xCoords.push(
                <td
                    key={'xCoordTop' + x}
                    style={{ textAlign: 'right', color: 'white' }}
                >
                    {x}
                </td>
            );
        }
    }
    components.push(<tr key="hx">{xCoords}</tr>); //on top
    for (let y = 0; y < height; y++) {
        const cellsLine = lineOfCells(y, cells, cellClickHandler, selected);

        components.push(<tr key={'row' + y}>{cellsLine}</tr>);
    }
    components.push(<tr key="bx">{xCoords}</tr>); //on bottom

    //replace empty cell on bunker
    bunkers.forEach(bunker => {
        const x = bunker.positionX;
        const y = bunker.positionY;

        const imageStyle = styleForCell(x, y);

        components[y + 1].props.children[x + 1] = (
            <Bunker
                key={'xCoord' + x + 1 + 'yCoord' + y + 1}
                imageStyle={imageStyle}
                positionX={x}
                positionY={y}
                name={bunker.name}
            />
        );
    });

    return components;
}

const theme = createMuiTheme();

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    mapArea: {
        overflowY: 'scroll',
        overflowX: 'scroll',
        maxHeight: '85vh',
        marginLeft: '8px',
        border: '1px solid white',
        borderRadius: '5px',
        '&::-webkit-scrollbar': {
            width: '0.7em',
            height: '0.7em',
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#5b6a79',
            outline: '1px solid slategrey',
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#6faaf5',
        },
    },
    marksListArea: {
        '&::-webkit-scrollbar': {
            width: '0.7em',
            height: '0.7em',
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#5b6a79',
            outline: '1px solid slategrey',
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#6faaf5',
        },
    },
});

class Map extends Component {
    constructor(props) {
        super(props);
        this.onCellClick = this.onCellClick.bind(this);
    }

    onCellClick(positionX, positionY) {
        this.props.getSelectedCellMarks({
            token: this.props.token,
            x: positionX,
            y: positionY,
        });
    }

    componentDidMount() {
        const {
            getAllExistingBunkers,
            getAllMarks,
            token,
            filter,
        } = this.props;

        getAllExistingBunkers(token);
        getAllMarks(token, filter);
    }

    render() {
        const { classes, token, selected } = this.props;
        const bodyWithCells = tableBody(
            this.props.bunkers,
            this.props.cells,
            this.onCellClick,
            selected
        );

        return (
            <div className={classes.root}>
                <Grid container spacing={3} style={{ width: '100%' }}>
                    <Grid item xs={9}>
                        <Grid container>
                            <Grid item xs={4}>
                                <div
                                    style={{
                                        textAlign: 'left',
                                        marginTop: '10px',
                                    }}
                                >
                                    {token && (
                                        <FavoritesPane
                                            style={{ textAlign: 'left' }}
                                        />
                                    )}
                                </div>
                            </Grid>
                            <Grid item xs={8}>
                                <div
                                    style={{
                                        textAlign: 'right',
                                        marginTop: '10px',
                                    }}
                                >
                                    {token && <TypeSwitcher />}
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <div
                            style={{
                                marginTop: '15px',
                                marginBottom: '10px',
                                marginLeft: '20px',
                                marginRight: '20px',
                            }}
                        >
                            <MarkSearch />
                        </div>
                    </Grid>
                    <Grid item xs={9}>
                        <div className={classes.mapArea}>
                            <table
                                style={{
                                    backgroundImage: 'url(' + area + ')',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    borderSpacing: 0,
                                    borderCollapse: 'collapse',
                                }}
                            >
                                <tbody>{bodyWithCells}</tbody>
                            </table>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div
                            className={classes.marksListArea}
                            style={{
                                overflowY: 'auto',
                                maxHeight: '85vh',
                                alignContent: 'left',
                            }}
                        >
                            <MarksList />
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        bunkers: state.bunkers.bunkers,
        cells: state.cells.marks,
        token: state.auth.token,
        filter: state.cells.filter,
        selected: state.selected,
    };
}

const mapDispatchToProps = {
    getAllExistingBunkers,
    getAllMarks,
    getSelectedCellMarks,
};

export default withStyles(styles(theme))(
    connect(mapStateToProps, mapDispatchToProps)(Map)
);
