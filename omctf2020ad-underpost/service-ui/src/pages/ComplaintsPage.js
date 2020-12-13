import React, { useEffect } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Container from '@material-ui/core/Container';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import connect from 'react-redux/es/connect/connect';
import { getComplaintCourier, getComplGood } from '../thunks/complaints';
import { API_URL } from '../config';

const theme = createMuiTheme();

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(10),
        backgroundColor: 'white',
        borderRadius: '4px',
        minWidth: '850px',
        minHeight: '400px',
    },
    paper: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

export function ComplaintsPage({
    token,
    dataCouriers,
    getComplaintsCouriers,
    dataGoods,
    getComplaintsGoods,
    handleCloseModal,
}) {
    const classes = useStyles(theme);

    useEffect(() => {
        getComplaintsCouriers(token);
        getComplaintsGoods(token);
    }, []);

    let urlbase = API_URL + 'files/';

    return (
        <Container className={classes.root} maxWidth="sm">
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Complaints
                </Typography>
            </div>
            <TableContainer
                style={{
                    maxHeight: 350,
                    minHeight: 350,
                    maxWidth: 800,
                }}
            >
                <Table
                    className={classes.table}
                    stickyHeader
                    aria-label="sticky table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Complain Type</TableCell>
                            <TableCell align="center">Subject</TableCell>
                            <TableCell align="center">Message</TableCell>
                            <TableCell align="center">Image</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataCouriers.length !== 0 &&
                            dataCouriers.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell component="td" scope="row">
                                        Delivery Quality
                                    </TableCell>
                                    <TableCell component="td" scope="row">
                                        {item.courier.nickname}
                                    </TableCell>
                                    <TableCell align="center">
                                        {item.complaint}
                                    </TableCell>
                                    <TableCell align="center">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                    </TableCell>
                                </TableRow>
                            ))}
                        {dataGoods.length !== 0 &&
                            dataGoods.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell component="td" scope="row">
                                        Good Quality
                                    </TableCell>
                                    <TableCell component="td" scope="row">
                                        {item.good.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        {item.complaint}
                                    </TableCell>
                                    <TableCell align="center">
                                        {' '}
                                        {item.image && (
                                            <img
                                                src={
                                                    urlbase + (item.image || '')
                                                }
                                                style={{ maxHeight: '50px' }}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <DialogActions>
                <Button size="small" color="primary" onClick={handleCloseModal}>
                    Close
                </Button>
            </DialogActions>
        </Container>
    );
}
const mapStateToProp = state => ({
    dataCouriers: state.complaints.complaints_couriers,
    dataGoods: state.complaints.complaints_good,
    token: state.auth.token,
});
const mapDispatch = dispatch => {
    return {
        getComplaintsCouriers: token => getComplaintCourier(token)(dispatch),
        getComplaintsGoods: token => getComplGood(token)(dispatch),
    };
};
export default connect(mapStateToProp, mapDispatch)(ComplaintsPage);
