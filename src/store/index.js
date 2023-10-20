import {createStore, applyMiddleware,compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '@/reducer';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));
const store = createStore(rootReducer, enhancer);

export default store;