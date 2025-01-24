import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {Images} from '../../Config';

const FlagComponent = ({Country}) => {
  return (
    <View style={styles.flagContainer}>
      <Image
        source={Images[Country]}
        style={{width: 50, height: 50}}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flagContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // padding: 8,
// backgroundColor: 'red'
  },
});

export default FlagComponent;
