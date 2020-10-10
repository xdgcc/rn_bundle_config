import Types from '../types';
import DataStore from '../../expand/dao/DataStore';

export function onLoadRequestData(storeName, url, pageSize) {
  return (dispatch) => {
    dispatch({type: Types.REQUEST_REFRESH, storeName: storeName});
    let dataStore = new DataStore();

    let formData = new FormData();
    formData.append('agentNo', '1056192471');
    let zUrl = 'https://ela.pa18.com:31024/pss-esales-ela/updates/events.dhtml';
    var opts = {
      method: 'POST', //请求方法
      body: formData, //请求体
      // credentials: 'include',
      headers: {
        Accept: 'application/json',
        // 'Content-Type': 'application/json',
      },
    };

    //     let formData = new FormData();
    // formData.append('agentNo', '1056192471');
    // fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     // 'Content-Type': 'application/json',
    //   },
    //   body: formData,
    // })
    // .then((response) => {
    //   console.log('response = ' + response);
    //   let responsedata = JSON.stringify(response);
    //   console.log('response data = ' + responsedata);
    //   return response.json();
    // })
    // .then((result) => {
    //   console.log('result = ' + result);
    //   let data = JSON.stringify(result);
    //   console.log('result data = ' + data);
    //   store.projectModels = data;
    // })
    // .catch((error) => console.log('error = ' + error));

    // 异步action与数据流
    dataStore
      .fetchData(zUrl)
      .then((data) => {
        let result = data;
        console.log('data json - ' + JSON.parse(result));
        console.log('data string - ' + JSON.stringify(result));
        console.log('data  - ' + result);
        // debugger;
        handleData(dispatch, storeName, data, pageSize);
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: Types.LOAD_REQUEST_FAIL,
          storeName,
          error,
        });
      });
  };
}

// export function onLoadRequestData(storeName, url, pageSize) {
//   return (dispatch) => {
//     dispatch({type: Types.REQUEST_REFRESH, storeName: storeName});
//     let dataStore = new DataStore();
//     // 异步action与数据流
//     dataStore
//       .fetchData(url)
//       .then((data) => {
//         handleData(dispatch, storeName, data, pageSize);
//       })
//       .catch((error) => {
//         console.log(error);
//         dispatch({
//           type: Types.LOAD_REQUEST_FAIL,
//           storeName,
//           error,
//         });
//       });
//   };
// }

/**
 * 加载更多
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param callBack 回调函数，可以通过回调函数来向调用页面通信：比如异常信息的展示，没有更多等待
 * @param favoriteDao
 * @returns {function(*)}
 */
export function onLoadMoreRequest(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  callBack,
) {
  return (dispatch) => {
    setTimeout(() => {
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        if (typeof callBack === 'function') {
          callBack('no more');
        }
        dispatch({
          type: Types.LOAD_MORE_REQUEST_FAIL,
          error: 'no more',
          storeName: storeName,
          pageIndex: --pageIndex,
          projectModels: dataArray,
        });
      } else {
        let max =
          pageSize * pageIndex > dataArray.length
            ? dataArray.length
            : pageIndex * pageSize;
        dispatch({
          type: Types.LOAD_MORE_REQUEST_SUCCESS,
          storeName: storeName,
          pageIndex: pageIndex,
          projectModels: dataArray.slice(0, max),
        });
      }
    }, 500);
  };
}

function handleData(dispatch, storeName, data, pageSize) {
  let fixItems = [];
  if (data && data.data && data.data.items) {
    fixItems = data.data.items;
  }
  dispatch({
    type: Types.LOAD_REQUEST_SUCCESS,
    projectModels:
      pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize), //第一次要加载的数据
    storeName,
    pageIndex: 1,
  });
}
