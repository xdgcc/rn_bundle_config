/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

export default class ZebcusItem extends Component {
  _onPress = () => {
    this.props.onSelect(this.props);
  };
  render() {
    const { item } = this.props;
    if (!item) {
      console.log('ZebcusItem null');
      return null;
    }
    let type = item.eventType;
    let updateFlag = (item.updateFlag === 'Y');
    if (type === 'agent_share') {
      return (
        <TouchableOpacity onPress={this._onPress} activeOpacity={1}>
          <View style={styles.hasNoData_container}>
            <View style={{ height: 60 }}>
              <Text numberOfLines={1} style={styles.title}>
                {item.typeName}
              </Text>
              <Text style={styles.description}>
                已识别用户 {item.identified} 未识别用户 {item.unidentified}
              </Text>
            </View>
            <View style={styles.line} />
            <View
              style={{
                height: 46,
                marginTop: 5,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Text style={{ color: 'rgba(0,0,0,.45)' }}>暂无客户动态</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={this._onPress} activeOpacity={1}>
          <View style={styles.hasData_container}>
            <View style={{ height: 60 }}>
              <Text numberOfLines={1} style={styles.title}>
                {item.typeName}
              </Text>
              <Text style={styles.description}>
                已识别用户 {item.identified} 未识别用户 {item.unidentified}
              </Text>
            </View>
            <View style={styles.line} />
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <View style={{ flex: 1 }}>
                <Image
                  style={styles.headImage}
                  source={{
                    uri: item.behaviors[0].header,
                  }}
                />
              </View>
              <View
                style={{
                  // justifyContent: 'space-between',
                  flexDirection: 'row',
                  flex: 5,
                  // backgroundColor: 'blue',
                }}>
                <View style={{ marginLeft: 16 }}>
                  <Text>{item.behaviors[0].name}</Text>
                  <Text style={styles.description}>
                    {item.behaviors[0].time}
                  </Text>
                </View>
              </View>
              <View
                // flex={1}
                style={{
                  flex: 4,
                  // backgroundColor: 'red',
                  textAlign: 'right',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    width: 120,
                    textAlign: 'right',
                    color: 'rgba(0,0,0,.45)',
                  }}>
                  {item.behaviors[0].behavior}
                </Text>
              </View>
            </View>
            <View style={styles.secondline} />
            <View
              style={{
                height: 46,
                marginTop: 5,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              {updateFlag ? <View style={{ backgroundColor: 'red', width: 8, marginEnd: 8, height: 8, borderRadius: 5, borderColor: '#e60012' }} />
                : null
              }
              <Text>查看全部</Text>
              <Image
                style={{
                  marginLeft: 5,
                  height: 16,
                  width: 16,
                }}
                // pae_cus_more_arrow
                source={require('../source/image/pae_cus_more_arrow.png')}
              // source={{uri: item.owner.avatar_url}}
              />
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  hasData_container: {
    backgroundColor: 'white',
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 12,
    marginRight: 12,
    // marginBottom: 12,
    borderRadius: 6,
  },
  hasNoData_container: {
    backgroundColor: 'white',
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  headImage: {
    height: 35,
    width: 35,
    borderRadius: 17,
  },
  line: {
    height: 0.5,
    // backgroundColor: '#f5f5f5',
    backgroundColor: '#f5f5f5',
    // marginHorizontal: 12,
    marginTop: 8,
  },
  secondline: {
    height: 0.5,
    // backgroundColor: '#f5f5f5',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 12,
    marginTop: 15,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginTop: 10,
    fontSize: 14,
    color: '#212121',
  },
  description: {
    fontSize: 12,
    marginTop: 4,
    color: '#757575',
  },
  hasDataStyle: {
    // ios 这三个
    shadowColor: 'gray',
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    // Android 这一个
    elevation: 2,
  },
});
