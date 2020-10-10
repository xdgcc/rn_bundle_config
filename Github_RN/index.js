import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import NewApp from './js/NewApp';

console.disableYellowBox = true; // 关闭全部黄色警告

AppRegistry.registerComponent(appName, () => NewApp);
