import Types from '../../action/types';

const defaultState = {};

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.LOAD_REQUEST_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          //这里为了从action中取出storeName并作为{}中的key使用所以需要借助[]，否则会js语法检查不通过
          ...state[action.storeName], //这里是为了解构state中action.storeName对应的属性，所以需要用到[]
          items: action.items, //原始数据
          projectModels: action.projectModels,
          isLoading: false,
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
        },
      };
    case Types.LOAD_REQUEST_FAIL:
      return {
        ...state,
        [action.storeName]: {
          //这里为了从action中取出storeName并作为{}中的key使用所以需要借助[]，否则会js语法检查不通过
          ...state[action.storeName], //这里是为了解构state中action.storeName对应的属性，所以需要用到[]
          // items: action.items, //原始数据
          isLoading: false,
        },
      };
    case Types.REQUEST_REFRESH:
      return {
        ...state,
        [action.storeName]: {
          //这里为了从action中取出storeName并作为{}中的key使用所以需要借助[]，否则会js语法检查不通过
          ...state[action.storeName], //这里是为了解构state中action.storeName对应的属性，所以需要用到[]
          // items: action.items, //原始数据
          isLoading: true,
        },
      };
    case Types.LOAD_MORE_REQUEST_SUCCESS: //上拉加载更多成功
      return {
        ...state, //Object.assign @http://www.devio.org/2018/09/09/ES6-ES7-ES8-Feature/
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
        },
      };
    case Types.LOAD_MORE_REQUEST_FAIL: //上拉加载更多失败
      return {
        ...state, //Object.assign @http://www.devio.org/2018/09/09/ES6-ES7-ES8-Feature/
        [action.storeName]: {
          ...state[action.storeName],
          hideLoadingMore: true,
          pageIndex: action.pageIndex,
        },
      };
    default:
      return state;
  }
}
