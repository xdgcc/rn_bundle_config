import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import FetchDemoPage from '../page/FetchDemoPage';
import newApp from '../NewApp';

export default createAppContainer(
  createSwitchNavigator(
    {
      // Init: InitNavigator,
      Main: DetailPage,
    },
    {
      navigationOptions: {
        header: null,
      },
    }
  ),
);
