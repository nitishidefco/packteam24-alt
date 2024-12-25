import {NativeModules} from 'react-native';

const {PermissionModule} = NativeModules;

PermissionModule.isPermissionGranted('android.permission.NFC', isGranted => {
  if (isGranted) {
    console.log('Permission granted');
  } else {
    // Request NFC permission if not granted
    PermissionModule.requestPermission('android.permission.NFC', granted => {
      if (granted) {
        console.log('Permission granted after request');
      } else {
        console.log('Permission denied');
      }
    });
  }
});
