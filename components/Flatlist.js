import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Linking } from 'react-native';
import FeedItem from './FeedItem';


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
        };
    }

    CallAPI = (pageNumber) => {
        const { listArticles } = this.state;
        setTimeout(async ()  => {
            try {
                const Respone = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=6eec2f7fe6cd4c40a3fef8f33f5778fe&page=${pageNumber}`);
                const jsonRepone = await Respone.json();
                this.setState({
                    listArticles: listArticles.concat(jsonRepone.articles),
                    totalResult: jsonRepone.totalResults,
                    isLoading: false,
                    isRefreshing: false,
                });
            } catch (error) {
                this.setState({
                    isLoading: false,
                    hasError: true,
                })
            }
        }, 2000);

    }

    componentDidMount() {
        const { pageNumber } = this.state;
        this.CallAPI(pageNumber);
    }

    onPressReadMore = url => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log(`Don't know how to open URL: ${url}`);
            }
        });
    };

    renderItem = ({ item }) => {
        return (
            <FeedItem
                key={item.source.id}
                item={item}
                onPressReadMore={() => this.onPressReadMore(item.url)}
            />
        );
    }
    getNews = async () => {
        const { pageNumber } = this.state;
        const newPage = pageNumber + 1;
        await this.setState({
            pageNumber: newPage,
        });
        this.CallAPI(newPage);
    }

    renderFooter = () => {
        const { isRefreshing, hasError } = this.state;
        console.log(hasError);
        if (!isRefreshing || !hasError) {
            return <ActivityIndicator size="large" color='black' animating={true} />
        }
    }
    onRefresh = async () => {
        const Page = 1;
        await this.setState({
            isRefreshing: true,
            listArticles: [],
            pageNumber: Page,
            isLoading: true,
        });
        setTimeout(() => {
            this.CallAPI(Page);
        }, 2000);
    }

    render() {
        const { isLoading, listArticles, hasError } = this.state;
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
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text>Haha</Text>
                </View>
                <View style={styles.content}>
                    <FlatList style={styles.Flatlist}
                        data={listArticles}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={this.getNews} onEndReachedThreshold={1}
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
        backgroundColor: 'red',
        flex: 0.1,
    },
    content: {
        flex: 0.9,
    },
});


export default Flatlist;
