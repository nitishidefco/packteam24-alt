// --------------- LIBRARIES ---------------
import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import {COLOR} from '../../Config/AppStyling';

// --------------- ASSETS ---------------

// --------------- COMPONENT DECLARATION ---------------
export default React.forwardRef(
  (
    {
      springConfig = {
        damping: 22,
        mass: 0.5,
        stiffness: 450,
      },
      containerStyle,
      childrenStyle,
      children,
    },
    ref,
  ) => {
    React.useImperativeHandle(
      ref,
      () => ({
        show,
        hide: cancelDialog,
      }),
      [config],
    );

    const _refTimeout = React.useRef();
    const animations = {
      backdrop: React.useRef(new Animated.Value(0)).current,
      scale: React.useRef(new Animated.Value(0)).current,
    };
    const animationStyles = {
      backdrop: {
        opacity: animations.backdrop,
      },
      card: {
        transform: [
          {
            scale: animations.scale.interpolate({
              inputRange: [0, 1],
              outputRange: [1.25, 1],
            }),
          },
        ],
        opacity: animations.backdrop,
      },
    };

    const [config, setConfig] = React.useState({
      show: false,
      cancelable: false,
    });

    const show = ({timeout, cancelable = false} = {}) => {
      _refTimeout.current = setTimeout(() => {
        setConfig({
          show: true,
          cancelable,
        });
      }, timeout ?? 80);
    };

    const hide = () => {
      clearTimeout(_refTimeout.current);
      setConfig({
        ...config,
        show: false,
      });
    };

    const cancelDialog = (callback = null) => {
      hideAnimation();
      hide();
      if (typeof callback == 'function') callback();
    };

    const showAnimation = () => {
      Animated.parallel([
        Animated.timing(animations.backdrop, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(animations.scale, {
          toValue: 1,
          useNativeDriver: true,
          ...springConfig,
        }),
      ]).start();
    };

    const hideAnimation = (callback = null) => {
      Animated.parallel([
        Animated.timing(animations.backdrop, {
          toValue: 0,
          duration: 1,
          useNativeDriver: true,
        }),
        Animated.timing(animations.scale, {
          toValue: 0,
          duration: 1,
          useNativeDriver: true,
        }),
      ]).start(callback);
    };

    return (
      <Modal
        visible={config.show}
        transparent
        animationType={'none'}
        onShow={showAnimation}
        statusBarTranslucent={true}>
        <TouchableWithoutFeedback
          style={{flex: 1}}
          onPress={cancelDialog}
          disabled={!config.cancelable}>
          <View style={[styles.container, containerStyle]}>
            <Animated.View
              style={[styles.backdrop, animationStyles.backdrop]}
            />
            <Animated.View
              style={[
                styles.childrenWrapper,
                childrenStyle,
                animationStyles.card,
              ]}>
              {children}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    backgroundColor: COLOR.OVERLAY_DARK_30,
    ...StyleSheet.absoluteFillObject,
  },
  childrenWrapper: {},
});
