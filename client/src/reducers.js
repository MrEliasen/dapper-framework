import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import AppReducer from './components/app/reducer';
import AuthReducer from './components/auth/reducer';
import AccountReducer from './components/account/reducer';

const rootReducer = combineReducers({
    app: AppReducer,
    auth: AuthReducer,
    account: AccountReducer,
    router: routerReducer,
});

export default rootReducer;
