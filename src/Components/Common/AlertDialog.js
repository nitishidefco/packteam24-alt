// --------------- LIBRARIES ---------------
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

// --------------- ASSETS ---------------
import {Constants} from '../../Config';
import {Tools} from '../../Helpers';
import MyDialog from './MyDialog';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';

const Divider = () => {
  return <View style={styles.divider} />;
};

// --------------- COMPONENT DECLARATION ---------------
export default React.forwardRef((_, ref) => {
  const _refDialog = React.useRef();

  React.useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    [config],
  );

  const [config, setConfig] = React.useState({
    title: '',
    message: '',
    cancelText: '',
    confirmText: 'Okay!',
    onConfirm: hide,
    onCancel: hide,
    type: 'default',
    hideCancel: false,
    cancelable: false,
    alerttype: Constants.ALERT_TYPE.NORMAL,
    fontSize: null,
  });

  const show = ({
    title,
    message,
    cancelText,
    confirmText,
    onCancel,
    onConfirm,
    type,
    timeout,
    hideCancel,
    cancelable,
    fontSize,
  }) => {
    _refDialog.current.show({timeout});
    setConfig({
      title: title ?? config.title,
      message: message ?? '',
      cancelText: cancelText ?? config.cancelText,
      confirmText: confirmText ?? config.confirmText,
      onCancel: onCancel ?? hide,
      onConfirm: onConfirm ?? hide,
      type: type ?? 'default',
      hideCancel: hideCancel ?? false,
      cancelable: cancelable ?? false,
      fontSize,
    });
  };

  const hide = (callback = null) => {
    _refDialog.current.hide(callback);
  };

  return (
    <MyDialog ref={_refDialog}>
      <View style={styles.card}>
        <View
          style={[{marginHorizontal: 0, marginBottom: Matrics.vs(10)}]}></View>
        <View style={styles.infoWrapper}>
          {config.title ? (
            <Text style={styles.title}>{config.title}</Text>
          ) : null}
          <Text style={[styles.message]}>{config.message}</Text>
        </View>
        <View
          style={[{marginHorizontal: 0, marginBottom: Matrics.vs(5)}]}></View>
        <View style={styles.buttonsWrapper}>
          {!config.hideCancel && (
            <TouchableOpacity
              activeOpacity={0.5}
              hitSlop={Tools.getHitSlop(5)}
              onPress={config.onCancel}
              style={styles.button}>
              {/* <View style={styles.button}> */}
              <Text
                style={[
                  styles.buttonLabel,
                  {
                    color: COLOR.GRAY4,
                    fontFamily: typography.fontFamily.RobotoSlab.Medium,
                  },
                ]}>
                {config.cancelText}
              </Text>
              {/* </View> */}
            </TouchableOpacity>
          )}

          {!config.hideCancel && <Divider />}

          <TouchableOpacity
            activeOpacity={0.5}
            hitSlop={Tools.getHitSlop(5)}
            onPress={() => {
              hide(config.onConfirm);
            }}
            style={styles.button}>
            <Text
              style={[
                styles.buttonLabel,
                {
                  color: config?.type == 'error' ? COLOR.ERROR : COLOR.PRIMARY,
                },
              ]}>
              {config.confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </MyDialog>
  );
});

const styles = StyleSheet.create({
  card: {
    minWidth: '92%',
    maxWidth: '92%',
    backgroundColor: '#FAFAF1',
    overflow: 'hidden',
    borderRadius: Matrics.mvs(8),
  },
  infoWrapper: {
    paddingVertical: Matrics.mvs(16),
    paddingHorizontal: Matrics.mvs(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Matrics.mvs(16),
    color: COLOR.BLACK,
    fontFamily: typography.fontFamily.RobotoSlab.SemiBold,
    textAlign: 'center',
    marginBottom: Matrics.vs(10),
  },
  message: {
    fontSize: Matrics.mvs(13),
    color: COLOR.MATAL_BLACK,
    fontFamily: typography.fontFamily.RobotoSlab.SemiBold,
    // marginTop: Matrics.vs(8),
    textAlign: 'center',
  },
  buttonsWrapper: {
    borderTopWidth: Matrics.vs(0.5),
    borderColor: COLOR.LIGHT_GRAY,
    height: Matrics.mvs(45),
    width: '100%',
    flexDirection: 'row',
    // marginHorizontal: Matrics.s(16),
    // justifyContent: 'flex-end',
    // paddingHorizontal: Matrics.mvs(14),
    alignItems: 'center',
    alignSelf: 'center',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Matrics.mvs(4),
    paddingHorizontal: Matrics.mvs(6),
  },
  buttonLabel: {
    fontSize: Matrics.mvs(14),
    fontFamily: typography.fontFamily.RobotoSlab.SemiBold,
    color: COLOR.PRIMARY,
    // textTransform: 'uppercase',
  },
  divider: {
    backgroundColor: COLOR.LIGHT_GRAY,
    width: Matrics.s(0.5),
    height: '70%',
  },
});
