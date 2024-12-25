// CustomHeader3.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { Matrics, typography } from '../../Config/AppStyling';
import { Images } from '../../Config';
import { useNavigation } from '@react-navigation/native';

const CustomHeader3 = ({ title, imageSource, onPdfIconPress,onBackIconPress }) => {
  const navigation = useNavigation();
  const openDrawer = () => {
    onBackIconPress();
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
            flex: 1, 
            textAlign: 'center', 
            marginLeft:Matrics.ms(15)
          }}>
          {title}
        </Text>
        <TouchableOpacity onPress={onPdfIconPress}> 
          <Image
            source={imageSource} // Assuming this is your PDF icon image
            resizeMode={'contain'}
            style={styles.pdfIconStyle}
          />
        </TouchableOpacity>
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
    justifyContent: 'center', 
    backgroundColor: '#091242',
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

export default CustomHeader3;
