import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
class PubItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const{item} = this.props;
        return (
            <View style={styles.PubItem}>
                <Text style={styles.pubtext}>{item.id} </Text>
                <Text style={styles.totaltext}>{item.numofart}</Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    PubItem:{
        paddingVertical:15,
        paddingHorizontal:5,
        marginVertical:5,
        marginHorizontal:15,
        flexDirection:'row',
        justifyContent:'space-between',
        borderTopWidth:1,
        borderTopColor: '#a8a8a8',
    },
    pubtext:{
        fontSize:20,
    },
    totaltext:{
        fontSize:17,
    }
});

export default PubItem;