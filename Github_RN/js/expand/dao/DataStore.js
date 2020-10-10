import AsyncStorage from '@react-native-community/async-storage';

export const FLAG_STORAGE = {
  flag_popular: 'popular',
};
const AUTH_TOKEN = 'fd82d1e882462e23b8e88aa82198f166';
export default class DataStore {
  /**
   * 获取数据，优先获取本地数据，如果无本地数据或本地数据过期则获取网络数据
   * @param url
   * @param flag
   * @returns {Promise}
   */
  fetchData(url, flag) {
    return new Promise((resolve, reject) => {
      // this.fetchLocalData(url)
      //   .then((wrapData) => {
      //     if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
      //       resolve(wrapData);
      //     } else {
      //       this.fetchNetData(url, flag)
      //         .then((data) => {
      //           resolve(this._wrapData(data));
      //         })
      //         .catch((error) => {
      //           reject(error);
      //         });
      //     }
      //   })
      // .catch((error) => {
      this.fetchNetData(url, flag)
        .then((data) => {
          resolve(this._wrapData(data));
        })
        .catch((error) => {
          reject(error);
        });
      // });
    });
  }

  /**
   * 保存数据
   * @param url
   * @param data
   * @param callback
   */
  saveData(url, data, callback) {
    if (!data || !url) {
      return;
    }
    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
  }

  /**
   * 获取本地数据
   * @param url
   * @returns {Promise}
   */
  fetchLocalData(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
            console.error(e);
          }
        } else {
          reject(error);
          console.error(error);
        }
      });
    });
  }

  /**
   * 获取网络数据
   * @param url
   * @param flag
   * @returns {Promise}
   */
  fetchNetData(url, flag) {
    return new Promise((resolve, reject) => {
      // fetch(url)
      //   .then((response) => {
      //     if (response.ok) {
      //       return response.json();
      //     }
      //     throw new Error('Network response was not ok.');
      //   })
      //   .then((responseData) => {
      //     this.saveData(url, responseData);
      //     resolve(responseData);
      //   })
      //   .catch((error) => {
      //     reject(error);
      //   });
      console.log('zouzheli ');
      let formData = new FormData();
      formData.append('agentNo', '1056192471');
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          // 'Content-Type': 'application/json',
        },
        body: formData,
      })
        .then((response) => {
          console.log('response = ' + response);
          let responsedata = JSON.stringify(response);
          console.log('response data = ' + responsedata);
          return response.json();
        })
        .then((result) => {
          console.log('result = ' + result);
          let data = JSON.stringify(result);
          console.log('result data = ' + data);
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  _wrapData(data) {
    return {data: data, timestamp: new Date().getTime()};
  }

  /**
   * 检查timestamp是否在有效期内
   * @param timestamp 项目更新时间
   * @return {boolean} true 不需要更新,false需要更新
   */
  static checkTimestampValid(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(timestamp);
    if (currentDate.getMonth() !== targetDate.getMonth()) {
      return false;
    }
    if (currentDate.getDate() !== targetDate.getDate()) {
      return false;
    }
    if (currentDate.getHours() - targetDate.getHours() > 4) {
      return false;
    } //有效期4个小时
    // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
    return true;
  }
}
