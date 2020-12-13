import React from "react";
import FavoriteIcon from '@material-ui/icons/Favorite';
import Button from '@material-ui/core/Button';
import makeStyles from "@material-ui/core/styles/makeStyles";

import {connect} from "react-redux";

import {approveDelivery} from "../../thunks/orders";

const useStyles = makeStyles(() => ({
    favorite: {
        position: "relative",
        top:"6px",
        right:"5px",
    },

}));

export function ApproveDelivery({orderId, sendApproveDelivery, token}) {
    const[state,setState] = React.useState(10);
    const classes = useStyles();
    
    const handleRateChange = (event)=>{
        setState(event.target.value);        
    }


    return (
        <div>            
            <FavoriteIcon className={classes.favorite} fontSize ={"default"} color={"primary"}/>
            <input type="number" style={{width: "4em", height:"30px", fontSize: "large"}}
                    placeholder={" 1-10"} 
                    value={state} 
                    onChange={ handleRateChange} 
                    name="likes"
                    min="0" 
                    max="10" 
                    inputMode="numeric"                   
                    />

            <Button
                style ={{marginLeft:"10px"}}
                variant="contained"
                color="primary"
                disabled={state == ""||state < 0||state > 10}
                onClick={() =>{sendApproveDelivery(orderId,state,token);}}>
                CONFIRM
            </Button>
        </div>

    );
}
const mapStateToProp = state => ({
    token: state.auth.token
});

const mapDispatch = (dispatch) => {
    return {
        sendApproveDelivery: (orderId,like,token) => approveDelivery(orderId,like,token)(dispatch),
    }
};
export default connect(mapStateToProp, mapDispatch) (ApproveDelivery)