import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  DeviceInfo,
  Dimensions,
  PixelRatio,
  Platform,
} from 'react-native';
import ZebcusItem from '../common/ZebcusItem';
import Native from '../utils/native';
import AsyncStorage from '@react-native-community/async-storage';
import {LayoutProvider, DataProvider, RecyclerListView} from 'recyclerlistview';

var viewHeight;
var HEADER_URL = //'https://ela-padis-dmzstg1.pa18.com/pss-esales-ela/updates/overview.dhtml';
  'https://ela.pa18.com:31024/pss-esales-ela/updates/overview.dhtml';
var EVENT_URL = // 'https://ela-padis-dmzstg1.pa18.com/pss-esales-ela/updates/events.dhtml';
  'https://ela.pa18.com:31024/pss-esales-ela/updates/events.dhtml';
const storeName = 'ZEB';

const ViewTypes = {
  HEADER: 0,
  AGENT: 1,
  CUSTOMER: 2,
  EMPTY: 3,
};
let {width} = Dimensions.get('window');
let tempTime = '';
export default class DetailPage extends Component {
  constructor(props) {
    super(props);
    //初始化View高度，px转换成dp。默认接收初始传参
    if (props.screenProps.height > 0) {
      console.log('props props height=11111111');
      viewHeight = props.screenProps.height / PixelRatio.get();
    } else {
      if (Platform.OS === 'ios') {
        console.log('props props height=22222222');
        let heigth = DeviceInfo.isIPhoneX_deprecated ? 88 + 44 + 34 : 64 + 44;
        let iosViewHeight = Dimensions.get('window').height;
        viewHeight = iosViewHeight - heigth;
      } else {
        console.log('props props height=33333333');
        viewHeight = Dimensions.get('window').height;
      }
    }
    console.log('props props height=' + viewHeight);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
    this.dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });
    this._layoutProvider = new LayoutProvider(
      (index) => {
        if (index == 0) {
          console.log('state.dataArray = ' + this.state.dataArray.length);
          return ViewTypes.HEADER;
        } else {
          console.log(
            'state.dataArray = index=' +
              this.state.dataArray.length +
              ' -' +
              this.state.dataArray[1],
          );
          //空视图
          if (
            this.state.dataArray.length == 2 &&
            this.state.dataArray[1] == ViewTypes.EMPTY
          ) {
            return ViewTypes.EMPTY;
          }
          //非空
          let type = this.state.dataArray[index].eventType;
          if (type === 'agent_share') {
            return ViewTypes.AGENT;
          } else {
            return ViewTypes.CUSTOMER;
          }
        }
      },
      (type, dim) => {
        switch (type) {
          case ViewTypes.HEADER:
            dim.width = width;
            dim.height = 300;
            break;
          case ViewTypes.EMPTY:
            dim.width = width;
            dim.height = 300;
            break;
          case ViewTypes.AGENT:
            dim.width = width;
            dim.height = 140;
            break;
          case ViewTypes.CUSTOMER:
            dim.width = width;
            dim.height = 210;
            break;
        }
      },
    );

    this.state = {
      dataArray: [{}],
      shareNum: '',
      readNum: '',
      avgReadExpire: '',
      stasticDate: '',
      updateTime: '',
      hideLoadingMore: true, //默认隐藏加载更多
      isLoading: false,
      currentPage: 1,
      agentNo: '',
      // dataProvider: this.dataProvider.cloneWithRows(this.dataArray)
    };
  }
  componentDidMount() {
    //第一次渲染调用
    Native.executeNativeMethod('loadFinish', {});
    console.log('应该是走的这里 2 ' + this.props.screenProps.agentNo);
    let debug = this.props.screenProps.debug;
    if (debug === 'true') {
      HEADER_URL =
        'https://ela-padis-dmzstg1.pa18.com/pss-esales-ela/updates/overview.dhtml';
      EVENT_URL =
        'https://ela-padis-dmzstg1.pa18.com/pss-esales-ela/updates/events.dhtml';
    }
    //获取最后一次请求时间
    AsyncStorage.getItem('requestTime').then((requestTime) => {
      if (requestTime != null) {
        tempTime = requestTime;
      }
      console.log('AsyncStorage.getItem  requestTime=' + tempTime);
      if (this.props.screenProps.agentNo === undefined) {
        Native.executeNativeMethod('kde_getAgentNo', {}).then((result) => {
          console.log('Native.kde_getAgentNo result' + result);
          this.setState({agentNo: result}, () => {
            console.log('Native.kde_getAgentNo  state=' + this.state.agentNo);
            this.loadHeaderData();
            this.loadData();
          });
        });
      } else {
        let str = this.props.screenProps.agentNo;
        console.log('Native.kde_getAgentNo 33333' + str);
        this.setState({agentNo: str}, () => {
          console.log('Native.kde_getAgentNo  state=' + this.state.agentNo);
          this.loadHeaderData();
          this.loadData();
        });
      }
    });
  }
  // /updates/overview.dhtml
  loadHeaderData() {
    console.log('loadHeaderData url : ' + HEADER_URL);
    let formData = new FormData();
    let agentNo = this.state.agentNo;
    formData.append('agentNo', agentNo);
    this.setState({isLoading: true});
    // this.isLoadMore = true;
    fetch(HEADER_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        // 'Content-Type': 'application/json',
      },
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((resultData) => {
        let finalData = resultData.result;
        if (finalData === undefined) {
          return;
        } //如果finalData则不再继续解析
        // console.log("finalData = " + JSON.stringify(finalData))
        let shareNum = finalData.shareNum;
        let readNum = finalData.readNum;
        let avgReadExpire = finalData.avgReadExpire;
        let stasticDate = finalData.stasticDate;
        let updateTime = finalData.updateTime;
        let str = JSON.stringify(updateTime);
        console.log('loadHeaderData data - ' + str);
        this.setState({
          updateTime: updateTime,
          shareNum: shareNum,
          readNum: readNum,
          avgReadExpire: avgReadExpire,
          stasticDate: stasticDate,
          hideLoadingMore: true,
        });
      })
      .then((response) => {
        return response.json();
      })
      .then((resultData) => {
        let finalData = resultData.result;
        if (finalData === undefined) {
          return;
        } //如果finalData则不再继续解析
        // console.log("finalData = " + JSON.stringify(finalData))
        let shareNum = finalData.shareNum;
        let readNum = finalData.readNum;
        let avgReadExpire = finalData.avgReadExpire;
        let stasticDate = finalData.stasticDate;
        let updateTime = finalData.updateTime;
        let str = JSON.stringify(updateTime);
        console.log('loadHeaderData data - ' + str);
        this.setState({
          updateTime: updateTime,
          shareNum: shareNum,
          readNum: readNum,
          avgReadExpire: avgReadExpire,
          stasticDate: stasticDate,
          isLoading: false,
          hideLoadingMore: true,
        });
      })
      .catch((error) => {
        this.setState({
          hideLoadingMore: true,
        });
        console.log('error = ' + error);
      });
  }

  loadData(loadMore) {
    console.log('loadData url : ' + EVENT_URL);
    let formData = new FormData();
    let agentNo = this.state.agentNo;
    console.log('111111' + agentNo + ' loadMore =' + loadMore);
    formData.append('agentNo', agentNo);
    formData.append('requestTime', tempTime);
    if (loadMore) {
      let currentPage = this.state.currentPage;
      currentPage++;
      this.state.currentPage = currentPage;
      formData.append('currentPage', currentPage);
      formData.append('pageSize', '10');
      // this.hideLoadingMore = false;
      // this.setState({ hideLoadingMore:false });
    } else {
      let currentPage = 1;
      this.state.currentPage = currentPage;
      this.hideLoadingMore = false;
      // this.setState({ hideLoadingMore:false });
    }
    console.log('loadData formData : ' + JSON.stringify(formData));

    fetch(EVENT_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        // 'Content-Type': 'application/json',
      },
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((resultData) => {
        let finalData = resultData.result;
        let loadMore = false;
        let str = JSON.stringify(finalData);
        if (this.state.currentPage === 1) {
          //第一页数据加载时，无数据，则显示空视图
          if (str === '[]' || finalData === undefined) {
            this.state.dataArray = [{}].concat(ViewTypes.EMPTY);
          } else {
            loadMore = true;
            tempTime = resultData.result[0].lastRequestTime;
            AsyncStorage.setItem(
              'requestTime',
              resultData.result[0].lastRequestTime,
            );
            this.state.dataArray = [{}].concat(resultData.result);
            console.log(
              '拿到的数据不为空:最后一次请求时间：' +
                resultData.result[0].lastRequestTime,
            );
          }
          this.setState({
            isLoadMore: loadMore,
            dataArray: this.state.dataArray,
            hideLoadingMore: !loadMore,
            isLoading: false,
          });
        } else {
          //第一页数据加载时，无数据，不加载空视图
          if (str === '[]' || finalData === undefined) {
            console.log('拿到的数据为空' + str);
            this.setState({
              isLoadMore: false,
              dataArray: this.state.dataArray,
              hideLoadingMore: true,
              isLoading: false,
            });
          }
          this.setState({
            isLoadMore: true,
            dataArray: this.state.dataArray.concat(finalData),
            hideLoadingMore: false,
          });
        }
      })
      .catch((error) => {
        console.log('error = ' + error + '--' + this.state.dataArray.length);
        //第一页数据加载时，无数据，则显示空视图
        if (this.state.dataArray.length == 1) {
          console.log('请求异常，无数据');
          this.state.dataArray = [{}].concat(ViewTypes.EMPTY);
        }
        this.setState({
          isLoading: false,
          dataArray: this.state.dataArray,
        });
      });
  }

  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const {request} = this.props;
    let store = request[storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], //要显示的数据
        hideLoadingMore: true, //默认隐藏加载更多
      };
    }
    return store;
  }

  _onPressItem = (data) => {
    let str = JSON.stringify(data);
    console.log('data - ' + ' - ' + str);
    let type = data.item.type;
    let typeNo = data.item.typeNo;
    let params = {type: type, typeNo: typeNo};
    console.log('被点击了' + JSON.stringify(params));
    Native.executeNativeMethod('zeb_jumpToMoreWithModel', params);
  };
  _renderItem = (data) => {
    return <ZebcusItem item={data.item} onSelect={this._onPressItem} />;
  };

  _rowRenderer = (type, data) => {
    let str = JSON.stringify(data);
    console.log('data - ' + ' - ' + type);
    switch (type) {
      case ViewTypes.HEADER:
        return this._renderHeader();
      case ViewTypes.EMPTY:
        return this._renderEmpty();
      case ViewTypes.AGENT:
      case ViewTypes.CUSTOMER:
        return <ZebcusItem item={data} onSelect={this._onPressItem} />;
    }
  };
  _renderFooter = () => {
    console.log('-----显示正在加载更多------' + this.state.hideLoadingMore);
    return this.state.hideLoadingMore ? (
      <View />
    ) : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} animating={true} />
        <Text style={{marginLeft: 4, marginTop: 2}}>正在加载更多</Text>
      </View>
    );
  };

  _onLoadMore = () => {
    if (!this.state.isLoadMore) {
      console.log('没有数据了，直接不请求');
      return;
    }
    console.log('---onEndReached----' + this.isLoadMore);
    setTimeout(() => {
      this.loadData(true);
    }, 100);
  };

  render() {
    return (
      //设置view高度
      <View style={{backgroundColor: '#f6f6f9', height: viewHeight}}>
        <RecyclerListView
          style={{backgroundColor: '#f6f6f9', height: viewHeight}}
          layoutProvider={this._layoutProvider}
          dataProvider={this.dataProvider.cloneWithRows(this.state.dataArray)}
          rowRenderer={this._rowRenderer}
          extendedState={this.state}
          onEndReached={this._onLoadMore}
          onEndReachedThreshold={50}
          renderFooter={this._renderFooter}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl
                title={'下拉可以刷新'}
                titleColor={'rgba(0,0,0,.6)'}
                colors={['rgba(0,0,0,.6)']}
                tintColor={'rgba(0,0,0,.6)'}
                refreshing={this.state.isLoading}
                onRefresh={async () => {
                  this.setState({isLoading: true});
                  // analytics.logEvent("Event_Stagg_pull_to_refresh");
                  // await this.getInfo();
                  await this.loadHeaderData();
                  await this.loadData();
                  // this.setState({ isLoading: false });
                }}
              />
            ),
          }}
        />
      </View>
    );
  }

  /**
   * 空布局
   */
  _renderEmpty = () => {
    return (
      <View style={styles.noListView}>
        <Image
          style={styles.noListViewImage}
          source={require('../source/image/pae_actionState_nodata.png')}
          // style={styles.middleSubImageView}
        />
        <Text style={{textAlign: 'center'}}>
          没有最新动态，赶快去分享获客吧！
        </Text>
        {/* 分享获客素材 */}
        <TouchableOpacity
          onPress={() => {
            console.log('分享获客素材');
            Native.executeNativeMethod('zeb_jumpToHuoKeSuCai', {});
          }}>
          <View
            style={{
              marginTop: 20,
              borderStyle: 'solid',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#ff6000',
              width: 141,
              height: 40,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#ff6000',
                textAlign: 'center',
              }}>
              分享获客素材
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  _renderHeader = () => {
    return (
      <View style={{flex: 1}}>
        {/* 头部的View */}
        <View style={styles.headerView}>
          {/* 今日概况 */}
          <View style={styles.todayTextViewStyle}>
            <Text style={styles.todayTextStyle}>今日概况</Text>
            <Text style={styles.updateTextStyle}>
              更新于:{this.state.updateTime}
            </Text>
          </View>
          <View style={styles.numberViewStyle}>
            <Text style={styles.numberLabelStyle}>
              {this.state.shareNum ? this.state.shareNum : 0}
            </Text>
            <Text style={styles.numberLabelStyle}>
              {this.state.readNum ? this.state.readNum : 0}
            </Text>
            <View
              style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 27,
                  fontWeight: 'bold',
                  marginTop: 30,
                  color: 'rgba(0,0,0,.85)',
                  fontFamily: 'DINAlternate-Bold',
                }}>
                {this.state.avgReadExpire ? this.state.avgReadExpire : 0}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                  marginTop: 42,
                  fontWeight: 'bold',
                  color: 'rgba(0,0,0,.85)',
                }}>
                秒
              </Text>
            </View>
          </View>
          <View style={styles.descViewStyle}>
            <Text style={styles.descLabelStyle}>我的分享次数</Text>
            <Text style={styles.descLabelStyle}>用户阅读次数</Text>
            <Text style={styles.descLabelStyle}>用户平均阅读时长</Text>
          </View>
        </View>
        {/* 中间的View */}
        <View style={styles.middleView}>
          {/* 我的分享和获客清单 */}
          <TouchableOpacity
            style={{flex: 1, alignItems: 'stretch'}}
            onPress={() => {
              Native.executeNativeMethod('zeb_jumpToMyShare', {});
            }}>
            <LeftMiddleView />
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, alignItems: 'stretch'}}
            onPress={() => {
              Native.executeNativeMethod('zeb_jumpToMyHuoKeList', {});
            }}>
            <RightMiddleView />
          </TouchableOpacity>
        </View>
        <View style={{height: 56}}>
          <Text style={styles.zuixindongtai}>最新动态</Text>
        </View>
      </View>
    );
  };
}

class LeftMiddleView extends Component {
  render() {
    return (
      <View style={styles.middleSubView}>
        <Image
          source={require('../source/image/pae_douhao.png')}
          style={styles.douhaoSubImageView}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            // alignItems: 'center',
            // backgroundColor: 'red',
          }}>
          <Text style={styles.middleLabelStyle} numberOfLines={2}>
            我的分享
          </Text>
        </View>
        <Image
          source={require('../source/image/pae_sharelist.png')}
          style={styles.middleSubImageView}
        />
      </View>
    );
  }
}

class RightMiddleView extends Component {
  render() {
    return (
      <View style={styles.middleSubView}>
        <Image
          source={require('../source/image/pae_douhao.png')}
          style={styles.douhaoSubImageView}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <Text
            style={styles.middleLabelStyle}
            numberOfLines={2}
            onPress={() => {
              let dic = {1: '1'};
              Native.getNativeVersionInfoRequest(dic);
            }}>
            获客清单
          </Text>
        </View>
        <Image
          source={require('../source/image/pae_customerlist.png')}
          style={styles.middleSubImageView}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navHeader: {
    backgroundColor: 'white',
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: DeviceInfo.isIPhoneX_deprecated ? 88 : 64,
  },
  leftBackImageView: {
    width: 24,
    height: 24,
    marginLeft: 15,
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 44 : 20,
  },
  zuixindongtai: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,.85)',
    marginTop: 25,
    marginLeft: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 44 : 20,
    fontSize: 18,
    marginRight: 40,
  },
  headerView: {
    borderRadius: 6,
    backgroundColor: 'white',
    height: 140,
    margin: 12,
  },
  noListView: {
    borderRadius: 6,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 260,
    margin: 12,
  },
  noListViewImage: {
    justifyContent: 'center',
    width: 130,
    height: 130,
  },
  todayTextViewStyle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 6,
    color: 'rgba(0,0,0,.85)',
  },
  todayTextStyle: {
    marginTop: 10,
    marginLeft: 15,
    fontSize: 17,
    fontWeight: 'bold',
  },
  updateTextStyle: {
    marginTop: 13,
    marginLeft: 6,
    flex: 1,
    fontSize: 12,
    fontWeight: 'normal',
    color: 'rgba(0,0,0,.3)',
  },
  numberViewStyle: {
    flexDirection: 'row',
    // backgroundColor: 'lightgray',
    height: 60,
    // alignItems: 'center',
  },
  numberLabelStyle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 30,
    color: 'rgba(0,0,0,.85)',
    fontFamily: 'DINAlternate-Bold',
  },
  descViewStyle: {
    flexDirection: 'row',
    height: 30,
    // alignItems: 'center',
  },
  descLabelStyle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(0,0,0,.6)',
    marginTop: 10,
  },
  middleView: {
    borderRadius: 6,
    height: 70,
    marginHorizontal: 6,
    flexDirection: 'row',
  },
  middleSubView: {
    borderRadius: 6,
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 70,
    flex: 1,
    marginHorizontal: 6,
    justifyContent: 'flex-end',
  },
  middleSubImageView: {
    // flex:1,
    width: 78,
    height: 70,
    marginRight: 0,
    // justifyContent: 'flex-end',
  },
  douhaoSubImageView: {
    width: 26,
    height: 18,
    marginStart: 4,
  },
  middleLabelStyle: {
    // textAlign: 'center',
    // flex:1,
    alignItems: 'stretch',
    fontSize: 16,
    fontWeight: 'bold',
    width: 35,
    color: 'rgba(0,0,0,.85)',
  },
  container: {
    // flex: 1,
    backgroundColor: '#f6f6f9',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  tabStyle: {
    minWidth: 50,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white',
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  },
  indicatorContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
