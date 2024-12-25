import React, {useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {AppStyle, COLOR} from '../../Config/AppStyling';
import {ThemeContext} from '../Provider/ThemeProvider';

const Comp = () => {
  const {dark} = useContext(ThemeContext);

  return ({
    spinner = false,
    children,
    translucent = false,
    statusbarBG = COLOR.WHITE,
    barStyle = '',
    keyboardHandler = false,
    theme,
  }) => (
    <View
      style={[
        AppStyle.flexone,
        {backgroundColor: theme?.backgroundColor ?? COLOR.WHITE},
      ]}>
      <StatusBar
        translucent={translucent}
        backgroundColor={statusbarBG}
        barStyle={barStyle ? barStyle : dark ? 'light-content' : 'dark-content'}
      />
      <TouchableWithoutFeedback
        style={{flex: 1}}
        disabled={!keyboardHandler}
        onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1}}>{children}</View>
      </TouchableWithoutFeedback>
      {spinner == true && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: COLOR.OVERLAY_DARK_10,
              justifyContent: 'center',
              zIndex: 99999,
            },
          ]}>
          <ActivityIndicator size="small" color={COLOR.PRIMARY} />
        </View>
      )}
    </View>
  );
};

const FullScreenSpinner = Comp();
export default FullScreenSpinner;
