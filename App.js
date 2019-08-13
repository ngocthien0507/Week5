import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Flatlist from './components/Flatlist';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <Flatlist/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  }
});
