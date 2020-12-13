import React, { Component } from 'react';

import { connect } from 'react-redux';

import Cell from '../components/map/Cell';
import Bunker from '../components/map/Bunker';
import Container from '@material-ui/core/Container';

import { styleForCell } from '../utils/helpers';

import { getAllExistingBunkers, getAllUserOrders } from '../thunks/orders';
import { REFRESH_PERIOD } from '../config';
import withStyles from '@material-ui/core/styles/withStyles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const theme = createMuiTheme();

const width = 50;
const height = 50;

function lineOfCells(y, orders) {
    const components = [];

    for (let x = 0; x < width; x++) {
        components.push(
            <Cell
                key={`cell_${y}_${x}`}
                positionX={x}
                positionY={y}
                orders={orders}
            />
        );
    }
    components.push(
        <td key={`cell_${y}_${width}`}>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        </td>
    );
    return components;
}

function tableBody(bunkers, orders) {
    const components = [];

    for (let y = 0; y < height; y++) {
        const cellsLine = lineOfCells(y, orders);

        components.push(<tr key={`tr_${y}`}>{cellsLine}</tr>);
    }

    //replace empty cell on bunker
    if (bunkers && bunkers.length > 0) {
        bunkers.forEach(bunker => {
            const x = bunker.positionX;
            const y = bunker.positionY;

            const imageStyle = styleForCell(x, y);

            components[y].props.children[x] = (
                <Bunker
                    key={`bnkcell_${y}_${x}`}
                    imageStyle={imageStyle}
                    bunkerName={bunker.name}
                    positionX={x}
                    positionY={y}
                    orders={orders}
                />
            );
        });
    }

    return components;
}

const styles = theme => ({
    mapStyle: {
        overflowY: 'scroll',
        overflowX: 'scroll',
        maxHeight: '84vh',
        maxWidth: '130vh',
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
            backgroundColor: '#7fbee2',
        },
    },
});

class Map extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { getAllExistingBunkers, getAllUserOrders, token } = this.props;
        let period = REFRESH_PERIOD;
        if (token) {
            getAllExistingBunkers(token);
            getAllUserOrders(token);

            this.timer = setInterval(() => {
                getAllExistingBunkers(token);
                getAllUserOrders(token);
            }, period);
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const { bunkers, orders, classes } = this.props;
        let ordersWithoutFinished;
        if (orders) {
            ordersWithoutFinished = orders.filter(
                order => order.status !== 'finished'
            );
        } else {
            ordersWithoutFinished = orders;
        }

        const bodyWithCells = tableBody(bunkers, ordersWithoutFinished);

        return (
            (this.props.token && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingTop: '3vh',
                    }}
                >
                    <div
                        style={{
                            padding: '3px',
                            backgroundColor: 'white',
                            borderRadius: '5px',
                        }}
                    >
                        <div className={classes.mapStyle}>
                            <table
                                style={{
                                    backgroundAttachment: 'scroll',
                                    backgroundImage:
                                        "url('../assets/img/good-map.png')",
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    borderSpacing: 0,
                                    borderCollapse: 'collapse',
                                }}
                            >
                                <tbody>{bodyWithCells}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )) || <div />
        );
    }
}

function mapStateToProps(state) {
    return {
        bunkers: state.orders.bunkers,
        orders: state.orders.orders,
        token: state.auth.token,
    };
}

const mapDispatchToProps = {
    getAllExistingBunkers,
    getAllUserOrders,
};

export default withStyles(styles(theme))(
    connect(mapStateToProps, mapDispatchToProps)(Map)
);
