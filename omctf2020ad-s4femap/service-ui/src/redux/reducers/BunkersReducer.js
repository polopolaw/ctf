import { SET_BUNKERS } from "../../utils/contants";

const initialState = {            
  bunkers: []
}

export function bunkersReducer(state = initialState, action) {    
    if (action.type === SET_BUNKERS) {      
      return Object.assign({} , state, {                    
        bunkers: action.payload || [],        
      });      
    }

    
    if (!state) {
        state = {                
          bunkers: []
        };
    }
    return state;
}