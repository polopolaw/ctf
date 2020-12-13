import { SET_COURIERS } from "../../utils/contants";

const initialState = {            
  users: []
}

export function couriersReducer(state = initialState, action) {    
    if (action.type === SET_COURIERS) {      
      return Object.assign({} , state, {                    
        users: action.payload || [],        
      });      
    }

    
    if (!state) {
        state = {                
          users: []
        };
    }
    return state;
}