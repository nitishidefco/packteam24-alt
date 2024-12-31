import React from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, Text, View} from 'react-native';

const NetworkStatusComponent = () => {
  const isConnected = useSelector(state => state?.Network?.isConnected);

  return (
    <View
      style={[
        styles.NetworkView,
        {backgroundColor: isConnected ? 'green' : 'red'}, // Conditional background color
      ]}>
      <Text style={styles.textStyle}>{isConnected ? 'Online' : 'Offline'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  NetworkView: {
    backgroundColor: 'lightblue',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NetworkStatusComponent;
