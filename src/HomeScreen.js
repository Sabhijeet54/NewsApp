import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeout from 'react-native-swipeout';
import DetailScreen from './DetailScreen';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headlines: [],
            pinnedHeadlines: [],
            updateKey: 0,
            showDetail: false, // To toggle the visibility of the detail screen
            selectedHeadline: null, // To store the selected headline
        };
        this.timer = null;
    }
    componentDidMount() {
        this.loadHeadlinesFromStorage();

    }

    componentWillUnmount() {
        this.stopDripTimer();
    }

    loadHeadlinesFromStorage = async () => {
        try {
            const headlinesData = await AsyncStorage.getItem('@NewsApp:headlines');
            const pinnedHeadlinesData = await AsyncStorage.getItem('@NewsApp:pinnedHeadlines');

            if (headlinesData) {
                const storedHeadlines = JSON.parse(headlinesData);
                const first10Headlines = storedHeadlines.slice(0, 10);
                this.setState({ headlines: first10Headlines }, () => this.startDripTimer());
            }

            if (pinnedHeadlinesData) {
                const pinnedHeadlines = JSON.parse(pinnedHeadlinesData);
                this.setState({ pinnedHeadlines });
            }
        } catch (error) {
            console.error('Error loading headlines from storage:', error);
        }
    }

    startDripTimer = () => {
        if (this.state.headlines?.length === 0) {
            return;
        }

        this.timer = setInterval(() => {
            this.shuffleCurrentHeadlines();
        }, 10000); // Timer runs every 10 seconds
    }

    stopDripTimer = () => {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    handleFetchNextBatch = async () => {
        // Get pinned headlines
        const { pinnedHeadlines } = this.state;

        // Fetch the next 10 headlines from AsyncStorage and remove unpinned headlines
        try {
            const headlinesData = await AsyncStorage.getItem('@NewsApp:headlines');

            if (headlinesData) {
                const storedHeadlines = JSON.parse(headlinesData);

                const nextHeadlines = storedHeadlines.slice(0, 10).filter((headline) => {
                    return !pinnedHeadlines.some((pinnedHeadline) => pinnedHeadline.author === headline.author);
                });

                // Update state with new headlines
                this.setState({
                    headlines: [...pinnedHeadlines, ...nextHeadlines],
                    updateKey: this.state.updateKey + 1,
                });

                // Remove 'nextHeadlines' from the stored data and update AsyncStorage
                const updatedHeadlines = storedHeadlines.filter((headline) => {
                    return !nextHeadlines.some((nextHeadline) => nextHeadline.author === headline.author);
                });

                await AsyncStorage.setItem('@NewsApp:headlines', JSON.stringify(updatedHeadlines));
            }
        } catch (error) {
            console.error('Error fetching and removing unpinned headlines from storage:', error);
        }
    }


    handlePinHeadline = (headline) => {
        const { pinnedHeadlines } = this.state;
        
        // Check if the pinned headline already exists
        if (!pinnedHeadlines.some((item) => item.title === headline.title)) {
            const updatedPinnedHeadlines = [headline, ...pinnedHeadlines];
    
            // Update the state with the new list of pinned headlines
            this.setState({ pinnedHeadlines: updatedPinnedHeadlines }, () => {
                // Save the updated pinned headlines to AsyncStorage
                this.savePinnedHeadlinesToStorage(updatedPinnedHeadlines);
    
                // Move the pinned headline to the top immediately
                this.movePinnedHeadlineToTop(headline);
            });
        }
    }

    movePinnedHeadlineToTop = (headline) => {
        const { pinnedHeadlines } = this.state;
        const filteredHeadlines = this.state.headlines.filter((item) => item !== headline);
    
        // Set the headlines array with the pinned headline at the top
        this.setState({
            headlines: [headline, ...filteredHeadlines],
            updateKey: this.state.updateKey + 1,
        });
    }

    handleUnpinHeadline = (headline) => {
        const { pinnedHeadlines } = this.state;
        const updatedPinnedHeadlines = pinnedHeadlines.filter((item) => item !== headline);

        // Update the state with the updated list of pinned headlines
        this.setState({ pinnedHeadlines: updatedPinnedHeadlines });

        // Save the updated pinned headlines to AsyncStorage
        this.savePinnedHeadlinesToStorage(updatedPinnedHeadlines);
    }

    handleDeleteHeadline = (headline) => {
        const updatedHeadlines = this.state.headlines.filter((item) => item !== headline);

        this.setState({ headlines: updatedHeadlines });

        // Save the updated headlines to AsyncStorage
        this.saveHeadlinesToStorage(updatedHeadlines);
    }

    shuffleCurrentHeadlines = () => {
        const { pinnedHeadlines, headlines } = this.state;
        const nonPinnedHeadlines = headlines.filter((headline) => !pinnedHeadlines.includes(headline));
        for (let i = nonPinnedHeadlines.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nonPinnedHeadlines[i], nonPinnedHeadlines[j]] = [nonPinnedHeadlines[j], nonPinnedHeadlines[i]];
        }
        const updatedHeadlines = [...pinnedHeadlines, ...nonPinnedHeadlines];
        this.setState((prevState) => ({
            headlines: updatedHeadlines,
            updateKey: prevState.updateKey + 1,
        }));
    }

    saveHeadlinesToStorage = async (headlines) => {
        try {
            await AsyncStorage.setItem('@NewsApp:headlines', JSON.stringify(headlines));
        } catch (error) {
            console.error('Error saving headlines to storage:', error);
        }
    }

    savePinnedHeadlinesToStorage = async (pinnedHeadlines) => {
        try {
            await AsyncStorage.setItem('@NewsApp:pinnedHeadlines', JSON.stringify(pinnedHeadlines));
        } catch (error) {
            console.error('Error saving pinned headlines to storage:', error);
        }
    }

    getSwipeoutButtons = (headline) => {
        const { pinnedHeadlines } = this.state;
        const isPinned = pinnedHeadlines.includes(headline);

        return [
            {
                text: 'Delete',
                backgroundColor: 'red',
                onPress: () => this.handleDeleteHeadline(headline),
            },
            {
                text: isPinned ? 'Unpin' : 'Pin',
                backgroundColor: isPinned ? 'green' : 'blue',
                onPress: () => (isPinned ? this.handleUnpinHeadline(headline) : this.handlePinHeadline(headline)),
            },
        ];
    }

    handleOpenDetail = (headline) => {
        // Set the selected headline and show the detail screen
        this.setState({ selectedHeadline: headline, showDetail: true });
    }

    handleCloseDetail = () => {
        // Clear the selected headline and hide the detail screen
        this.setState({ selectedHeadline: null, showDetail: false });
    }

    renderSwipeoutItem = ({ item }) => (
      
        <Swipeout testID="SwipeoutID"  right={this.getSwipeoutButtons(item)} autoClose={true} backgroundColor="transparent"
         >
          <TouchableOpacity
          testID='handleOpenDetailid'
          onPress={() => this.handleOpenDetail(item)}>
            <View style={styles.itemContainer}>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              <View style={{justifyContent:'center',alignItems:'center'}}>
              <Image
                source={{ uri: item.urlToImage }}
                resizeMode="cover"
                style={styles.itemImage}
              />
              </View>
            </View>
          </TouchableOpacity>
        </Swipeout>
      );
      
    
      render() {
        const { showDetail, selectedHeadline } = this.state;
        return (
          <>
            {showDetail ? (
              <DetailScreen headline={selectedHeadline} onClose={this.handleCloseDetail} />
            ) : (
              <View style={styles.container}>
                {this.state.headlines.length > 0 && (
                  <FlatList
                  testID='FlatListId'
                    data={this.state.headlines}
                    keyExtractor={(item, index) => `${item?.title}-${index}-${this.state.updateKey}`}
                    renderItem={this.renderSwipeoutItem}
                    extraData={this.state.updateKey}
                  />
                )}
                <TouchableOpacity
                testID='handleFetchNextBatchid'
                  style={styles.fetchButton}
                  onPress={this.handleFetchNextBatch}
                >
                  <Text style={styles.fetchButtonText}> Next </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        );
      }
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Background color similar to Google News
      },
      itemContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        margin: 8, // Smaller margin
        padding: 8, // Smaller padding
        elevation: 3,
        flexDirection: 'row',
      },
      itemImage: {
        height: 80, // Smaller image size
        width: 80, // Smaller image size
        borderRadius: 8,
      },
      itemContent: {
        flex: 1,
        marginLeft: 8, // Smaller margin
      },
      itemTitle: {
        fontSize: 16, // Smaller font size
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#333',
      },
      itemDescription: {
        fontSize: 12, // Smaller font size
        color: '#666',
      },
      fetchButton: {
        backgroundColor: '#0073e6', // Google News blue
        borderRadius: 5,
        paddingVertical: 12,
        marginTop: 16,
        marginHorizontal: 8, // Smaller margin
        alignItems: 'center',
      },
      fetchButtonText: {
        color: 'white',
        fontSize: 16, // Smaller font size
        fontWeight: 'bold',
      },
    });
    
    export default HomeScreen;