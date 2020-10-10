import {combineReducers} from 'redux';
import theme from './theme';
import request from './request';
// reducer 是空的话会报不合法
const index = combineReducers({
  theme: theme,
  request: request,
});

export default index;
