import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

//Middlewares
import logger from 'redux-logger';
import thunk from 'redux-thunk';

//Reducers
import taskReducer from './reducers/taskReducer';
import authReducer from './reducers/authReducer';

const reducers = combineReducers({
  task: taskReducer,
  auth: authReducer,
});

const middlewaresArr = [thunk];

const middlewares = applyMiddleware(...middlewaresArr);

let store;

if (process.env.NODE_ENV === 'development') {
  middlewaresArr.push(logger);
  store = createStore(reducers, composeWithDevTools(middlewares));
} else {
  store = createStore(reducers, middlewares);
}

export default store;