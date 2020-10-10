import React, {Component} from 'react';
import {
  View,
  Button,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  Modal,
  AsyncStorage,
  NativeModules,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const Native = {
  /**
   * 关闭
   * @param {Object} options 参数
   * {}
   */
  insuranceBack: (options, onSuccess, onFail) => {
    const option = options || {};
    if (NativeModules.PAERNBridgeModule) {
      NativeModules.PAERNBridgeModule.insuranceBack(option);
    } else {
      console.log('NativeModules.PAERNBridgeModule.insuranceBack.....');
    }
  },

  popNativeViewController: () => {
    if (NativeModules.PAERNBridgeModule) {
      NativeModules.PAERNBridgeModule.popNativeViewController();
    } else {
      console.log(
        ' NativeModules.PAERNBridgeModule.popNativeViewController();.....',
      );
    }
  },

  zeb_jumpToMyHuoKeList: () => {
    if (NativeModules.PAERNBridgeModule) {
      NativeModules.PAERNBridgeModule.zeb_jumpToMyHuoKeList();
    } else {
      console.log(
        ' NativeModules.PAERNBridgeModule.zeb_jumpToMyHuoKeList();.....',
      );
    }
  },

  zeb_jumpToMyShare: () => {
    if (NativeModules.PAERNBridgeModule) {
      NativeModules.PAERNBridgeModule.zeb_jumpToMyShare();
    } else {
      console.log(' NativeModules.PAERNBridgeModule.zeb_jumpToMyShare();.....');
    }
  },

  zeb_jumpToMoreWithModel: (params) => {
    if (NativeModules.PAERNBridgeModule) {
      NativeModules.PAERNBridgeModule.zeb_jumpToMoreWithModel(params);
    } else {
      console.log(' NativeModules.PAERNBridgeModule.zeb_jumpToMyShare();.....');
    }
  },

  jumpToPrivacyRules: () => {
    if (NativeModules.PAERNBridgeModule) {
      NativeModules.PAERNBridgeModule.jumpToPrivacyRules();
    } else {
      console.log(
        ' NativeModules.PAERNBridgeModule.jumpToPrivacyRules();.....',
      );
    }
  },

  jumpToRecommend: () => {
    if (NativeModules.PAERNBridgeModule) {
      NativeModules.PAERNBridgeModule.jumpToRecommend();
    } else {
      console.log(' NativeModules.PAERNBridgeModule.jumpToRecommend();.....');
    }
  },

  jumpToFunctionIntro: () => {
    if (NativeModules.PAERNBridgeModule) {
      NativeModules.PAERNBridgeModule.jumpToFunctionIntro();
    } else {
      console.log(
        ' NativeModules.PAERNBridgeModule.jumpToFunctionIntro();.....',
      );
    }
  },

  // jumpToPrivacyRules
  /**
   * 通过native发送网络请求
   */
  sendNetRequest: (params) => {
    if (NativeModules.PAERNBridgeModule) {
      let string = JSON.stringify(params);
      NativeModules.PAERNBridgeModule.sendRNNetRequest(params)
        .then((result) => {
          let data = result.data;
          let iosArray = data.ios;
          // let jsonString = JSON.stringify(iosArray);
          resolve(data);
        })
        .catch((err) => {
          Alert.alert(err);
        });
    } else {
      console.log(' NativeModules.PAERNBridgeModule.sendRNNetRequest;.....');
    }
  },

  kde_getAgentNo: () =>
    new Promise((resolve, reject) => {
      if (NativeModules.PAERNBridgeModule) {
        NativeModules.PAERNBridgeModule.kde_getAgentNo()
          .then((result) => {
            console.log('kde_getAgentNo 1111111111');
            resolve(result);
          })
          .catch((err) => {
            console.log('kde_getAgentNo 2222222222' + err);
            reject(err);
          });
      } else {
        console.log(
          'NativeModules.PAERNBridgeModule.getNativeVersionInfoRequest.......',
        );
      }
    }),

  sendNetRequestNew: (params) =>
    new Promise((resolve, reject) => {
      if (NativeModules.PAERNBridgeModule) {
        let string = JSON.stringify(params);
        NativeModules.PAERNBridgeModule.sendRNNetRequest(params)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      } else {
        console.log(
          'NativeModules.PAERNBridgeModule.getNativeVersionInfoRequest.......',
        );
      }
    }),

  getNativeVersionInfoRequest: (params) => {
    if (NativeModules.PAERNBridgeModule) {
      // var dic = {'1': '2'};
      let string = JSON.stringify(params);
      // Alert.alert(string);
      // return;
      NativeModules.PAERNBridgeModule.getNativeVersionInfoRequest(params)
        .then((result) => {
          // let jsonString = JSON.stringify(result);
          console.log(result);
        })
        .catch((err) => {
          Alert.alert(err);
        });
    } else {
      console.log(
        'NativeModules.PAERNBridgeModule.getNativeVersionInfoRequest.......',
      );
    }
  },

  /**
   * 获取App版本信息
   * @param {Function} onSuccess 参数
   */
  getVersionInfo: (options, onSuccess, onFail) => {
    return new Promise((resolve, reject) => {
      if (NativeModules.PAERNBridgeModule) {
        NativeModules.PAERNBridgeModule.getNativeVersionInfo((result) => {
          resolve(result);
        }).catch((err) => {
          reject(err);
        });
      }
    });
  },
  /**
   * 通用方法
   */
  executeNativeMethod: (action, options) => {
    //添加通用参数（当前时间戳）(用于消息时间埋点统计)
    options.timestamp = Date.now() + '';
    console.log('executeNativeMethod: action='+action+"," + JSON.stringify(options));
    return new Promise((resolve, reject) => {
      if (
        NativeModules.PAERNBridgeModule &&
        NativeModules.PAERNBridgeModule.executeNativeMethod
      ) {
        return NativeModules.PAERNBridgeModule.executeNativeMethod(
          action,
          options,
        )
          .then((result) => {
            console.log('result:' + result);
            resolve(result);
            //RN端收到Native消息后，通知Native端收到(用于消息时间埋点统计)
            Native.executeNativeMethod('CD_N2R', {action: action});
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        console.log('action' + action);
      }
    });
  },
};
export default Native;
