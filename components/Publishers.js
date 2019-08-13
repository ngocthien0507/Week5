import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PubItem from './PubItem';

let array = [];

class Publishers extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        const { ListPub, onPressButton } = this.props;
        console.log(ListPub)
        for (var propt in ListPub) {
            var nums = Object.keys(ListPub[propt]).length;
            var item = { id: propt, numofart: nums };
            array.push(item);
        }
        console.log(array);
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={onPressButton} style={styles.NFbutton}>
                    <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>Back to Newsfeed</Text>
                </TouchableOpacity>
                <View style={styles.PubItem}>
                    <Text style={styles.pubtext}> Publishers </Text>
                    <Text style={styles.totaltext}>Total Articles</Text>
                </View>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {
                        array.map(item => {
                            return (
                                <PubItem key={item.id} item={item} />
                            )
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginTop: 50,
        marginBottom: 20,
    },
    NFbutton: {
        width: 300, height: 50,
        alignItems: 'center',
        backgroundColor: '#247BA0',
        alignSelf: 'center',
        borderRadius: 20,
        justifyContent: 'center',

    },
    scrollView: {

        flexDirection: 'column',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 5,
    },
    PubItem: {
        paddingVertical: 15,
        paddingHorizontal: 5,
        marginVertical: 5,
        marginHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#a8a8a8',
    },
    pubtext: {
        fontSize: 20,
    },
    totaltext: {
        fontSize: 17,
    }
});


export default Publishers;