import React, {Component} from 'react';
import {Provider} from 'react-redux';
import AppNavigators from './navigator/AppNavigators';
import store from './store';

// var height;

export default class NewApp extends Component {
  // static initProps;

  constructor(props) {
    super(props);
    // console.log("NewApp props =" + JSON.stringify(props))
    // this.height = this.props.height;
  }

  render() {
    console.log('NewApp props render=' + JSON.stringify(this.props));
    return (
      <Provider store={store}>
        <AppNavigators screenProps={this.props} />
      </Provider>
    );
  }
}
