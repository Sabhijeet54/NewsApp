import React, { Component } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const NEWS_API_URL = "https://newsapi.org/v2/everything?q=tesla&from=2023-07-24&sortBy=publishedAt&apiKey=f79863fb1e6a4d6c82b02591d32ef2ca"
// 'https://newsapi.org/v2/everything?q=tesla&from=2023-07-23&sortBy=publishedAt&apiKey=f79863fb1e6a4d6c82b02591d32ef2ca';
// a2795a07cf6845deabeda3d6581c0c48';

class FetchHeadlines extends Component {
  
  async componentDidMount() {
    const headlinesData = await AsyncStorage.getItem('@NewsApp:headlines');
    if (headlinesData) {
      const storedHeadlines = JSON.parse(headlinesData);
      this.setState({ headlines: storedHeadlines });
    }
  else{
    this.fetchHeadlines()
  }
  }

  fetchHeadlines = async () => {
    try {
      const response = await axios.get(NEWS_API_URL);
      
      if (response.data.articles) {
        // You can access the articles in response.data.articles
        const articles = response.data.articles;
        // You can process and use the articles data here

        await AsyncStorage.setItem('@NewsApp:headlines', JSON.stringify(articles));

      }
    } catch (error) {
      console.error('Error fetching headlines:', error);
    }
  };
render(){
  return
}
}

export default FetchHeadlines;
