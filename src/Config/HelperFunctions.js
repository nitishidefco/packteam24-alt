import React from 'react';
import {
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Images from './Images';
import {COLOR, typography} from './AppStyling';

const {width, height} = Dimensions.get('window');
export const setHeader = (navigation, label) => {
  navigation.setOptions({
    headerTitle: label,
    headerStyle: styles.headerShadowStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerLeft: () => (
      <TouchableOpacity activeOpacity={1} onPress={() => navigation.pop()}>
        {Images.Back ? (
          <Image
            source={Images.Back}
            resizeMode={'contain'}
            style={styles.leftArrowStyle}
          />
        ) : (
          <Text>Back</Text>
        )}
      </TouchableOpacity>
    ),
  });
};
export const styles = {
  headerTitleStyle: {
    color: COLOR.MATEBLACK,
    width: width - 75,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 18,
    fontFamily: typography.fontFamily.RobotoSlab.SemiBold,
  },
  headerStyle: {
    shadowOpacity: 0,
    borderBottomWidth: 0,
    elevation: 0,
    backgroundColor: COLOR.APPCOLOR,
  },
  headerShadowStyle: {
    height: Platform.OS == 'ios' ? 80 : 70,
    shadowOffset: {height: 2, width: 0},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderBottomWidth: 0,
    elevation: 5,
    shadowColor: COLOR.GRAY,
    backgroundColor: COLOR.WHITE,
  },
  shadowStyle: {
    shadowOffset: {height: 3, width: 0},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderBottomWidth: 0,
    elevation: 5,
    shadowColor: COLOR.GRAY,
  },
  leftArrowStyle: {
    tintColor: COLOR.MATEBLACK,
    marginHorizontal: 15,
    height: 20,
    width: 20,
  },
};
