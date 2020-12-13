import React, {useEffect} from "react";
import {connect} from 'react-redux';
import {createMuiTheme} from '@material-ui/core/styles';
import makeStyles from "@material-ui/core/styles/makeStyles";

import Typography from '@material-ui/core/Typography';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';

import {getAllUserOrders} from '../../thunks/orders';
import ApproveDelivery from "./ApproveDelivery";
import Paper from "@material-ui/core/Paper";
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';


const theme = createMuiTheme();

const useStyles = makeStyles(theme => ({
    root: {
        height: "600px",
        width: '50%',
        marginTop: theme.spacing(10),        
        paddingBottom: theme.spacing(2),
        backgroundColor: 'white',
        borderRadius: '4px',
        minWidth: '1000px',
    },
    table: {
        minWidth: 800,
    },
    paper: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    container: {
        maxHeight: 470,
        minHeight: 470,
        minWidth: 800,
    },
}));

export function Orders({getOrders, data , token, handleCloseModal }) {
    const classes = useStyles(theme);     
    
    let delivered = data.filter(x => x.status==='delivered');
    
    return (
        <Container className={classes.root} maxWidth="sm">            
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        CONFIRM DELIVERY
                    </Typography>
                </div>
                <div className={classes.container}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="center">Comment</TableCell>
                                <TableCell align="center">Damage</TableCell>
                                <TableCell align="center">Porter</TableCell>
                                <TableCell align="center">Place</TableCell>
                                <TableCell align="center">Approve Delivery</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {delivered.length !==0 &&(delivered.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell component="th" scope="row">
                                        {item.good.name}
                                    </TableCell>
                                    <TableCell align="center">{item.comment}</TableCell>
                                    <TableCell align="center">{item.damage}</TableCell>
                                    <TableCell align="center">{item.courier.nickname}</TableCell>
                                    <TableCell align="center">{item.target.name}</TableCell>
                                    <TableCell align="center">
                                        <ApproveDelivery  orderId={item.id}/>
                                    </TableCell>
                                </TableRow>
                            )))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </div>
                <DialogActions>
                    <Button
                        size="small"
                        color="primary"
                        onClick={ handleCloseModal() }
                    >
                        Close
                    </Button>                        
                </DialogActions>            
        </Container>

);
}



const mapStateToProp = state => ({
    data: state.orders.orders,
    token: state.auth.token
});

const mapDispatch = {  }

export default connect(mapStateToProp, mapDispatch)(Orders)
