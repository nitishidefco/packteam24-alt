import {NativeModules} from 'react-native';

const {PermissionModule} = NativeModules;

PermissionModule.isPermissionGranted('android.permission.NFC', isGranted => {
  if (isGranted) {
  } else {
    // Request NFC permission if not granted
    PermissionModule.requestPermission('android.permission.NFC', granted => {
      if (granted) {
      } else {
      }
    });
  }
});
