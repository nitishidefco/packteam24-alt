import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Modal,
  Image as DEFAULT_IMAGE,
  TouchableWithoutFeedback,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {Image, Video} from 'react-native-compressor';

import {Images, Constants} from '../../Config';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';

export const PicturePicker = ({
  visible,
  closePicker,
  pickImage,
  multiple,
  isVideoOption = false,
}) => {
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        closePicker();
        return false;
      }
    } else {
      return true;
    }
  };
  async function compressImage(arr) {
    if (Array.isArray(arr)) {
      arr.forEach(async element => {
        let result = await Image.compress(
          Platform.OS === 'android'
            ? element.path
            : element.path
            ? element.path
            : element.sourceURL,
          {
            compressionMethod: 'auto',
            quality: 0.4,
          },
        );
        element['path'] = await result;
      });
      return arr;
    } else {
      const result = await Image.compress(
        Platform.OS === 'android'
          ? arr.path
          : arr.path
          ? arr.path
          : arr.sourceURL,
        {
          compressionMethod: 'auto',
          quality: 0.4,
        },
      );
      arr.path = await result;
      return arr;
    }
  }
  async function compressVideo(arr) {
    if (Array.isArray(arr)) {
      arr.forEach(async element => {
        let result = await Video.compress(
          Platform.OS === 'android'
            ? element.path
            : element.path
            ? element.path
            : element.sourceURL,
          {
            compressionMethod: 'auto',
            quality: 0.4,
          },
        );
        element['path'] = await result;
      });
      return arr;
    } else {
      const result = await Video.compress(
        Platform.OS === 'android'
          ? arr.path
          : arr.path
          ? arr.path
          : arr.sourceURL,
        {
          compressionMethod: 'auto',
          quality: 0.4,
        },
      );
      arr.path = await result;
      return arr;
    }
  }
  const chooseFile = () => {
    ImagePicker.openPicker({
      width: Matrics.scale(300),
      height: Matrics.vs(400),
      mediaType: 'photo',
      includeBase64: false,
      cropping: true,
      multiple: multiple ?? false,
      // compressImageQuality: 0.4,
    })
      .then(async image => {
        if (multiple) {
          const result = await compressImage(image);
          pickImage(result);
          closePicker();
        } else {
          if (image.mime === 'image/jpeg' || image.mime === 'image/png') {
            const result = await compressImage(image);
            pickImage(result);
            closePicker();
          } else {
            closePicker();
          }
        }
      })
      .catch(() => closePicker());
  };

  const captureImage = async () => {
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      ImagePicker.openCamera({
        // width: Matrics.scale(300),
        // height: Matrics.vs(400),
        cropping: true,
        mediaType: 'photo',
        includeBase64: false,
        // compressImageQuality: 0.4,
      })
        .then(async image => {
          const result = await compressImage(image);
          pickImage(result);
          closePicker();
        })
        .catch(() => closePicker());
    }
  };
  const chooseVideo = async () => {
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      ImagePicker.openPicker({
        width: Matrics.scale(300),
        height: Matrics.vs(400),
        mediaType: 'video',
        includeBase64: false,
        // compressImageQuality: 0.4,
      })
        .then(async video => {
          const result = await compressVideo(video);
          pickImage(result);
          closePicker();
        })
        .catch(() => closePicker());
    }
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        closePicker();
        return false;
      }
    } else {
      return true;
    }
  };

  if (visible === true) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType={'none'}
        style={{flex: 1}}
        statusBarTranslucent>
        <TouchableWithoutFeedback onPress={closePicker}>
          <View
            style={[
              styles.container,
              {backgroundColor: COLOR.OVERLAY_LIGHT_10},
            ]}>
            <View style={[styles.innerconatiner]}>
              <TouchableOpacity
                onPress={closePicker}
                style={styles.closeconatiner}
                activeOpacity={Constants.activeOpacity}>
                <DEFAULT_IMAGE
                  source={Images.SEARCHCLEAR}
                  style={styles.searchIconStyles}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={Constants.activeOpacity}
                style={styles.buttonStyle}
                onPress={captureImage}>
                <Text style={styles.textStyle}>{'Camera'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={Constants.activeOpacity}
                style={styles.buttonStyle}
                onPress={chooseFile}>
                <Text style={styles.textStyle}>{'File Manager'}</Text>
              </TouchableOpacity>
              {isVideoOption ? (
                <TouchableOpacity
                  activeOpacity={Constants.activeOpacity}
                  style={styles.buttonStyle}
                  onPress={chooseVideo}>
                  <Text style={styles.textStyle}>{'Video'}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  } else {
    return null;
  }
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: COLOR.WHITE,
    textAlign: 'center',
    fontSize: Matrics.ms(12),
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    fontFamily: typography.fontFamily.RobotoSlab.Regular,
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: COLOR.PRIMARY,
    paddingVertical: Matrics.ms(15),
    marginVertical: 10,
    width: '88%',
    borderRadius: 6,
  },
  closeconatiner: {
    position: 'absolute',
    right: 3,
    width: Matrics.ms(35),
    height: Matrics.ms(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerconatiner: {
    width: '90%',
    borderRadius: Matrics.ms(7),
    backgroundColor: COLOR.OVERLAY_LIGHT_60,
    // ...APPSTYLE.shadow,
    borderWidth: 0.5,
    borderColor: COLOR.GRAY1,
    alignItems: 'center',
    paddingVertical: Matrics.ms(25),
  },
  searchIconStyles: {
    width: Matrics.ms(15),
    height: Matrics.ms(15),
    tintColor: COLOR.PRIMARY,
  },
});
