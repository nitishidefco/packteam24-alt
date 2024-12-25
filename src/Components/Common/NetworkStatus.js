import React from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, Text, View} from 'react-native';

const NetworkStatusComponent = () => {
  const isConnected = useSelector(state => state?.Network?.isConnected);

  return (
    <View style={styles.NetworkView}>
      <Text>Network Status: {isConnected ? 'Online' : 'Offline'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  NetworkView: {
    backgroundColor: 'lightblue',
    padding: 10,
    alignItems: 'center',
  },
});

export default NetworkStatusComponent;
