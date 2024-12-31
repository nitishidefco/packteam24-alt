import {useEffect} from 'react';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import {useDispatch} from 'react-redux';
import {setNfcStatus} from '../Redux/Reducers/NetworkSlice';

export const useNfcStatus = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize NFC Manager
    NfcManager.start();
    const initialCheck = async () => {
      const isEnblaed = await NfcManager.isEnabled();
      console.log('isEnabled', isEnblaed);
      dispatch(setNfcStatus(isEnblaed));
    };
    initialCheck();
    // Add event listener for NFC state changes on Android
    if (Platform.OS === 'android') {
      NfcManager.setEventListener(NfcEvents.StateChanged, ({state} = {}) => {
        if (state === 'on') {
          dispatch(setNfcStatus(true));
        } else if (state === 'off') {
          dispatch(setNfcStatus(false));
        }
      });
    }

    // Cleanup listener on unmount
    return () => {
      if (Platform.OS === 'android') {
        NfcManager.setEventListener(NfcEvents.StateChanged, null);
      }
    };
  }, [dispatch]);
};
