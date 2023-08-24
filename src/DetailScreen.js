import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { BackHandler } from 'react-native';



class DetailScreen extends Component {
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        this.props.onClose();
        return true
    }



  render() {
    const { headline, onClose } = this.props;

    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity testID='backBtn' style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.mainContent}>
          <Image
            source={{ uri: headline.urlToImage }}
            resizeMode="cover"
            style={styles.headlineImage}
          />
          <Text style={styles.headlineTitle}>{headline.title}</Text>
          <Text style={styles.headlineDescription}>{headline.description}</Text>
          <Text style={styles.sourceText}>{headline.source.name}</Text>
          <Text style={styles.dateText}>{headline.publishedAt}</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 30, // Adjusted top margin
    left: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  mainContent: {
    margin: 16, // Added margin for spacing
  },
  headlineTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  headlineDescription: {
    fontSize: 18,
    color: '#666',
    lineHeight: 28,
  },
  headlineImage: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    marginBottom: 16,
  },
  sourceText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#777',
  },
});

export default DetailScreen;
