import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { authReducer } from './AuthReducer'
import { selectedReducer } from './SelectedReducer'
import { bunkersReducer } from './BunkersReducer'
import { cellsReducer } from './CellsReducer'
import { couriersReducer } from './CouriersReducer'


export function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    selected: selectedReducer,
    bunkers: bunkersReducer,
    cells: cellsReducer,
    couriers: couriersReducer,
  });
}
