import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  Text,
} from 'react-native';
import {Matrics, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';

const CountInput = ({value, onIncrement, onDecrement, onUpdate}) => {
  const handleIncrement = () => {
    onIncrement();
  };

  const handleDecrement = () => {
    onDecrement();
  };

  const handleChangeText = text => {
    onUpdate(text);
  };

  return (
    <View
      style={{
        flex: 1,
        borderColor: '#B3B3B3',
        height: Matrics.ms(40),
        justifyContent: 'center',
        borderBottomWidth: 1,
        right: Matrics.ms(0),
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          maxHeight: Matrics.ms(35),
          marginTop: Matrics.ms(6),
          justifyContent: 'center',
          marginRight: Matrics.ms(25),
        }}>
        <TouchableOpacity
          onPress={handleDecrement}
          style={{
            height: 30,
            width: 35,
            marginHorizontal: 0,
            borderRadius: 15,
            alignItems: 'center',
            flex: 1,
            left: 15,
          }}>
          <Image
            style={{
              height: Matrics.ms(20),
              width: Matrics.ms(20),
              marginTop: Matrics.ms(2),
              marginLeft: Matrics.ms(0),
            }}
            source={Images.MINUS}
          />
        </TouchableOpacity>
        <Text
          style={{
            textAlign: 'center',
            alignSelf: 'center',
            left: Matrics.ms(13), // Adjusted margin for the text
            // marginRight: Matrics.ms(12), // Adjusted margin for the text
            marginBottom: Matrics.ms(10),
            justifyContent: 'center',
            flex: 1,
            color: 'black',
          }}>
          {value}
        </Text>
        <TouchableOpacity
          onPress={handleIncrement}
          style={{
            height: 30,
            width: 35,
            marginHorizontal: 0,
            borderRadius: 15,
            alignItems: 'center',
            left: 15,
          }}>
          <Image
            style={{
              height: 20,
              width: 20,
              marginTop: Matrics.ms(3),
              marginLeft: Matrics.ms(0),
            }}
            source={Images.PLUS}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CountInput;
