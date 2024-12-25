import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Constants, Images} from '../../Config';
import {COLOR, Matrics} from '../../Config/AppStyling';
import {TouchableOpacityComp} from '../HOC';

export const Button = ({
  label,
  onPress,
  disabled,
  customStyle,
  customButtonStyle,
  labelStyles,
  isIconShow = true,
  defaultIcon = Images.BUTTON_ARROW,
  defaultIconCustomStyles,
}) => {
  return (
    <View style={[styles.buttonParentView, customStyle]}>
      <TouchableOpacityComp
        disabled={disabled}
        onPress={onPress}
        style={[styles.buttonView, customButtonStyle]}
        activeOpacity={Constants.activeOpacity}>
        <View style={{flex: 0.16}} />
        <View style={{flex: 0.68}}>
          <Text style={[styles.label, labelStyles]}>{label}</Text>
        </View>
        <View style={{flex: 0.16}}>
          <Image
            source={defaultIcon}
            resizeMode={'contain'}
            style={[styles.defaultIconStyles, defaultIconCustomStyles]}
          />
        </View>
      </TouchableOpacityComp>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonParentView: {
    width: '90%',
    alignSelf: 'center',
  },
  buttonView: {
    height: Matrics.s(50),
    backgroundColor: COLOR.PRIMARY,
    borderRadius: Matrics.ms(30),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    alignSelf: 'center',
    fontSize: Matrics.mvs(18),
    color: COLOR.WHITE,
    paddingVertical: Matrics.ms(10),
  },
  defaultIconStyles: {
    height: Matrics.vs(20),
    width: Matrics.ms(20),
  },
});
