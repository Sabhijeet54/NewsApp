import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomeScreen from './HomeScreen';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHomeScreen: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showHomeScreen: true });
    }, 3000); // Change the duration as needed
  }

  render() {
    if (this.state.showHomeScreen) {
      return <HomeScreen />;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.appName}>NEWS APP</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007bff', // Background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 36, // Adjust the font size as needed
    fontWeight: 'bold', // Make it bold
    color: 'white', // Text color
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow color
    textShadowOffset: { width: 2, height: 2 }, // Text shadow offset
    textShadowRadius: 4, // Text shadow radius
  },
});

export default SplashScreen;
