import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import moment from "moment";
class FeedItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { item: {
            title,
            urlToImage,
            publishedAt,
            content,
            source: {
                name,
            },
        },
        onPressReadMore
        } = this.props;
        return (
            <View style={styles.FeedItem}>
                <Text style={styles.Title}> {title} </Text>
                <Image style={styles.Image} source={{ uri: urlToImage }} />
                <Text style={styles.Source}> Source: <Text style={{ color: '#d3d3d3' }}> {name} </Text> </Text>
                <Text style={styles.Content}> {content} </Text>
                <Text style={styles.Source}> Published: <Text style={{ color: '#d3d3d3' }}> {moment(publishedAt).format('LLL')} </Text> </Text>
                <TouchableOpacity style={styles.ReadMoreButton}
                    onPress = {onPressReadMore}
                >
                    <Text style={styles.buttonText}>
                        Read More
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    FeedItem: {
        flexDirection: 'column',
        borderColor: '#a8a8a8',
        borderWidth: 1,
        marginHorizontal: 15,
        marginTop: 10,
    },

    Title: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center'
    },
    Image: {
        height: 200,
        width: 370,
        alignSelf: 'center'
    },
    Source: {
        fontSize: 15,
        fontWeight: '700',
    },
    Content: {
        textAlign: 'left',
        marginLeft: 3,
    },
    ReadMoreButton: {
        backgroundColor: '#FF312E',
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: 200,
        alignSelf: 'center',
        marginVertical: 10,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '300',
        textAlign: 'center',
        color: 'white'
    }
});

export default FeedItem;