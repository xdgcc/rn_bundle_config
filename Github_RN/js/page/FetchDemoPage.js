import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TextInput} from 'react-native';

export default class FetchDemoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showText: '',
    };
  }

  loadData() {
    console.log(this.searchKey);
    let url = 'https://ams.pa18.com/ams/feedback/swithch.loginFree';
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        this.setState({
          showText: responseText,
        });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>FetchDemoPage 详情页</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            this.searchKey = text;
          }}
        />
        <Button
          title="获取"
          onPress={() => {
            this.loadData();
          }}
        />
        <Text>{this.state.showText}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input: {
    height: 30,
    // flex:1,
    width: 100,
    backgroundColor: 'lightgray',
    borderWidth: 1,
    marginRight: 10,
  },
});
