import React, { Component } from 'react';
import { View } from 'react-native'
import HomeScreen from './src/HomeScreen';
import FetchHeadlines from './src/Apis/FetchHeadlines';
import SplashScreen from './src/SplashScreen';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications


class App extends Component {
  render() {

    return (
      <>
        <SplashScreen />
        
        <FetchHeadlines/>
      </>

        // </>
    );
  }
}

export default App;
