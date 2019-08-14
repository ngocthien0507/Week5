import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Linking, TextInput, TouchableOpacity } from 'react-native';
import FeedItem from './FeedItem';
import EndArticles from './EndArticles';
import Icon from 'react-native-vector-icons/Ionicons';
import Publishers from './Publishers';

//function GroupBy Hardcode to find item's source-id
Array.prototype.groupBy = function () {
    return this.reduce(function (groups, item) {
        const val = item['source']
        const value = val['name']
        groups[value] = groups[value] || []
        groups[value].push(item)
        return groups
    }, {})
}

class Flatlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            isLoading: true,
            listArticles: [],
            totalResult: 0,
            pageNumber: 1,
            hasError: false,
            lastPageReached: false,
            hasMore: true,
            search: '',
            isSearch: false,
            individualPublishersList: [],
            isPublishers: false,
        };
    }
    // call API 
    CallAPI = async (page) => {
        const { listArticles, totalResult } = this.state;
        let Respone = '';
        try {
            Respone = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=dea4cf70d9914db689de52a741d18bfc&page=${page}`);
            const jsonRespone = await Respone.json();
            if (jsonRespone.status === "ok") {
                const hasMoreArticles = jsonRespone.articles.length > 0;
                const PublishersList = listArticles.concat(jsonRespone.articles).groupBy();
                if (hasMoreArticles) {
                    this.setState({
                        listArticles: listArticles.concat(jsonRespone.articles),
                        totalResult: totalResult + jsonRespone.articles.length,
                        isLoading: false,
                        isRefreshing: false,
                        pageNumber: page + 1,
                        individualPublishersList: PublishersList
                    });
                } else {
                    this.setState({
                        lastPageReached: true,
                        hasMore: false,
                    });
                }
            }
        } catch (error) {
            console.log(error);
            this.setState({
                isLoading: false,
                hasError: true,
            })
        }
    }
    // call api when app start
    componentDidMount() {
        const { pageNumber } = this.state;
        this.CallAPI(pageNumber);
    }

    // handle readmore button's pressed
    onPressReadMore = url => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log(`Don't know how to open URL: ${url}`);
            }
        });
    };
    //render all item in listArticles
    renderItem = ({ item }) => {
        return (
            <FeedItem
                key={item.source.id}
                item={item}
                onPressReadMore={() => this.onPressReadMore(item.url)}
            />
        );
    }
    // call next page when scroll to the end.
    getNews = () => {
        const { pageNumber, hasMore } = this.state;
        if (hasMore) {
            this.CallAPI(pageNumber);
        }
        else {
            console.log('no more');
        }
    }
    // scroll to top when press button "No more articles"
    onPressScrollToUp = () => {
        this.flatListRef.scrollToIndex({ animated: true, index: 0 });
    }

    //handle  ListFooterComponent
    renderFooter = () => {
        const { isRefreshing, hasError, lastPageReached, isSearch } = this.state;
        if ((!isRefreshing || !hasError) && !isSearch) {
            return lastPageReached ? <EndArticles title='↑ No more Articles ↑' onPressButton={() => this.onPressScrollToUp()} /> : <ActivityIndicator size="large" color='black' animating={true} />
        }

        if (isSearch) {
            return <EndArticles title='Back' onPressButton={() => this.onRefresh()} />
        }
    }
    // reload feed to page 1 when refresh
    onRefresh = async () => {
        const Page = 1;
        await this.setState({
            isRefreshing: false,
            isLoading: true,
            listArticles: [],
            totalResult: 0,
            pageNumber: 1,
            hasError: false,
            lastPageReached: false,
            hasMore: true,
            search: '',
            isSearch: false,
            individualPublishersList: [],
            isPublishers: false,
        });
        setTimeout(() => {
            this.CallAPI(Page);
        }, 2000);
    }

    onChangeText(text) {
        this.setState({
            search: text,
        });
    }
    onPressSearchButton = async () => {
        const { search, listArticles } = this.state;
        const newData = listArticles.filter(function (item) {
            //applying filter for the inserted text in search bar
            const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
            const textData = search.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            listArticles: newData,
            totalResult: newData.length,
            hasMore: false,
            isSearch: true,
            search: '',
        })
    }
    GoToPublishers = () => {
        this.setState({
            isPublishers: true,
        });
    }
    onPressBackToNewFeed = () => {
        this.setState({
            isPublishers: false,
        });
    }

    render() {
        const { isLoading, listArticles, hasError, totalResult, search, individualPublishersList, isPublishers } = this.state;
        if (isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator
                        size="large"
                        color='black'
                        animating={isLoading}
                    />
                </View>
            )
        }
        if (hasError) {
            return (
                <View style={styles.container}>
                    <Text style={{ fontSize: 50, color: 'black' }}> Error =( </Text>
                </View>
            )
        }
        if (isPublishers) {
            return <Publishers onPressButton={() => this.onPressBackToNewFeed()} ListPub={individualPublishersList} />
        }
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.totalArticlesText}>Articles count: {totalResult} </Text>
                    <View style={styles.SearchGroup}>
                        <TouchableOpacity
                            onPress={this.GoToPublishers}
                            style={styles.PubButton}>
                            <Icon name="md-person" size={25} color="black" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.searchBar}
                            onChangeText={text => this.onChangeText(text)}
                            value={search}
                            placeholder='Type here to search...'
                        />
                        <TouchableOpacity
                            onPress={this.onPressSearchButton}
                            style={styles.searchButton}>
                            <Icon name="md-search" size={25} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.content}>
                    <FlatList style={styles.Flatlist}
                        ref={(ref) => { this.flatListRef = ref; }}
                        data={listArticles}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={this.getNews}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={this.renderFooter()}
                        refreshing={false}
                        onRefresh={this.onRefresh}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFA',
    },
    header: {
        flexDirection: 'column',
        flex: 0.1,
        justifyContent: 'center',
        marginTop: 30,
        alignItems: 'center',
    },
    searchBar: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#a8a8a8',
        width: 200,
        height: 40,
        textAlign: 'center',
        fontSize: 18,
        color: 'black',
        borderRadius: 10,
        marginLeft:30,
    },
    SearchGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButton: {
        backgroundColor: 'white',
        borderRadius: 10,
        shadowOpacity: 1,
        borderWidth: 1,
        borderColor: '#a8a8a8',
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    PubButton: {
        backgroundColor: 'white',
        borderRadius: 10,
        shadowOpacity: 1,
        borderWidth: 1,
        borderColor: '#a8a8a8',
        height: 40,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center'
    },
    totalArticlesText: {
        fontSize: 20,
        fontWeight: '300'
    },
    TextInput: {

    },
    content: {
        flex: 0.9,
    },
});


export default Flatlist;
