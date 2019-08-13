import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class EndArticles extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const{onPressButton, title} = this.props;
    console.log(title);
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onPressButton}  style={styles.buttonScrollToTop}>
          <Text style={styles.endOfArticles} > {title} </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent:'center',
    alignItems:'center',
  },
  endOfArticles: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
  buttonScrollToTop: {
    backgroundColor: '#247BA0',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 10,
    width: 300,
    borderRadius:10,
  }
});

export default EndArticles;