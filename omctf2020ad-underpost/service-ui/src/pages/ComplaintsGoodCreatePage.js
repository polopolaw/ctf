import React, {Fragment, useEffect} from "react";
import {createMuiTheme} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {Good,sendGoodComplaint} from "../thunks/complaints";
import {connect} from "react-redux";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";
const theme = createMuiTheme();

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(10),
    },

    container: {
        width: '100%',
        backgroundColor: theme.palette.background.paper

    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    formControl: {
        margin: theme.spacing(10),
        minWidth: 350,
    },
    text_area:{
        marginLeft:"80px",
        width:"350px"
    },
    button:{
        marginTop: "30px",
        marginBottom: "10px",
        marginLeft: "200px"
    }
}));

export function ComplaintsGoodCreatePage({data, getAllGood, sendGoodComplaint, token}) {
    const classes = useStyles(theme);
    const [good,setGood] = React.useState("");
    const [text,setText] = React.useState("");
    const [file,setFile] = React.useState({});
    useEffect(() => {
        getAllGood(token);
    },[]);
    return (
        <Container className={classes.root} maxWidth="sm">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Create Complaints
                </Typography>
            </div>
            <div>
                <div className={classes.container}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Good</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={(e)=>{setGood(e.target.value)}}
                        >{data.map(item => (
                            <MenuItem value={item.id}>{item.name}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    <TextField className={classes.text_area}
                               id="outlined-multiline-static"
                               label="Description complaint"
                               multiline
                               rows="7"
                               variant="outlined"
                               onChange={(e)=>{setText(e.target.value);}}
                    />
                    <Fragment>
                        <input
                            className={classes.button}
                            name="file"
                            color="primary"
                            accept="image/*"
                            type="file"
                            onChange={(e)=>{ setFile(e.target.files[0])}}/>
                    </Fragment>
                    <div>
                        <Button className ={classes.button}  onClick={()=>{
                            sendGoodComplaint(good,text,file,token)
                        }} component={Link} to={"/complaints"} variant="contained" color="primary">Submit</Button>
                    </div>

                </div>
            </div>

        </Container>
    );
}
const mapStateToProp = state => ({
    data: state.complaints.good,
    token: state.auth.token,

});
const mapDispatch = (dispatch) => {
    return {
        getAllGood: (token) => Good(token)(dispatch),
        sendGoodComplaint: (good,text,file,token) => sendGoodComplaint(good,text,file,token)(dispatch),
    }
};
export default connect(mapStateToProp, mapDispatch)(ComplaintsGoodCreatePage)

