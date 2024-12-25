// --------------- LIBRARIES ---------------
import React from 'react';
import {View, Modal, ActivityIndicator, StyleSheet, Text} from 'react-native';

import {AppStyle, COLOR, Matrics, typography} from '../../Config/AppStyling';

// --------------- COMPONENT DECLARATION ---------------
export const Loader = ({visible, label}) => {
  return (
    <Modal visible={visible} transparent statusBarTranslucent={true}>
      <View style={styles.container}>
        <View style={styles.card}>
          <ActivityIndicator size={'small'} color='#091242' />
          <Text style={styles.label}>Login...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLOR.OVERLAY_DARK_60,
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  card: {
    height: Matrics.mvs(55),
    paddingHorizontal: Matrics.s(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    borderRadius: Matrics.mvs(6),
    flexDirection: 'row',
    maxWidth: '90%'
  },
  label: {
    fontSize: typography.fontSizes.fs10,
    color: COLOR.BLACK,
    fontFamily: typography.fontFamily.RobotoSlab.Regular,
    marginLeft: Matrics.s(8),
  },
});
