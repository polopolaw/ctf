import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { getCurrentUserInfo } from '../thunks/profile';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(5),
        '& .MuiTextField-root': {
            marginTop: theme.spacing(2),
        },
    },
}));

function ProfilePage(props) {
    const classes = useStyles();

    useEffect(() => {
        if (!props.userData) {
            props.getCurrentUserInfo(props.token);
        }
    });

    const { contactNumber, id, login, personalID, question, role } =
        props.userData || {};

    const createTextField = (label, value) => {
        return (
            <TextField
                fullWidth
                label={label}
                defaultValue={value ? value : 'No value'}
                InputProps={{ readOnly: true }}
            />
        );
    };

    return (
        (props.token && (
            <Container className={classes.root} maxWidth="sm">
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Profile
                        </Typography>
                        {createTextField('ID', id)}
                        {createTextField('Contact Number', contactNumber)}
                        {createTextField('Username', login)}
                        {createTextField('Personal ID number', personalID)}
                        {createTextField('Recovery question', question)}
                        {createTextField('Role', role)}
                    </CardContent>
                </Card>
            </Container>
        )) || <div></div>
    );
}

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userData: state.auth.userData,
    };
}

export default connect(mapStateToProps, { getCurrentUserInfo })(ProfilePage);
