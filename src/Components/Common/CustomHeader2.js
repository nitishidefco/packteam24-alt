// CustomHeader2.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { typography } from '../../Config/AppStyling';
import { Images } from '../../Config';
import { useNavigation } from '@react-navigation/native';

const CustomHeader2 = ({ title, imageSource ,onPdfIconPress,isPdfClickable}) => {
  const navigation = useNavigation();
  const openDrawer = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#091242' }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={openDrawer}>
          <Image
            source={Images.BACKICON}
            resizeMode={'contain'}
            style={styles.drawerIconStyle}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: 'white',
            fontFamily: typography.fontFamily.Montserrat.Medium,
            fontSize: typography.fontSizes.fs15,
            left: 9,
          }}>
          {title}
        </Text>
        {imageSource && (
          <TouchableOpacity onPress={isPdfClickable ? onPdfIconPress : null}>
            <Image
              source={imageSource}
              resizeMode={'contain'}
              style={styles.pdfIconStyle}
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 65,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#061439',
  },
  drawerIconStyle: {
    tintColor: 'white',
    width: 15,
    height: 15,
    marginLeft: 20,
  },
  pdfIconStyle: {
    width: 35,
    height: 35,
    marginRight: 20,
  },
});

export default CustomHeader2;
