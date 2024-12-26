import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  AppState,
} from 'react-native';
import {useHomeActions} from '../../Redux/Hooks';
import DrawerSceneWrapper from '../../Components/Common/DrawerSceneWrapper';
import CustomHeader from '../../Components/Common/CustomHeader';
import {Images} from '../../Config';
import NfcManager, {NfcTech, NfcEvents} from 'react-native-nfc-manager';
import {useScanTagActions} from '../../Redux/Hooks/useScanTagActions';
import NetworkStatusComponent from '../../Components/Common/NetworkStatus';
import {
  clearOfflineStorage,
  addDataToOfflineStorage,
} from '../../Redux/Reducers/SaveDataOfflineSlice';
import {showNotificationAboutTagScannedWhileOffline} from '../../Utlis/NotificationsWhileOffline';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import OfflineDataDisplay from '../../Components/OfflineDataSee';
const Home = ({navigation, route}) => {
  const dispatch = useDispatch();
  const sessions = useSelector(state => state?.OfflineData?.sessions);
  const isConnected = useSelector(state => state?.Network?.isConnected);
  const [tagDetected, setTagDetected] = useState();
  const [tagId, setTagId] = useState('');

  const [loading, setLoading] = useState(false);
  const [hasNfc, setHasNfc] = useState(false);
  const [List, setList] = useState([]);
  const {state, homecall} = useHomeActions();
  const {state: states, scanCall} = useScanTagActions();
  const {Auth, Home} = state;
  const SessionId = Auth.data?.data?.sesssion_id;
  const [refreshing, setRefreshing] = useState(false);
  const CurrentMode = states?.data?.data[1];
  const [appState, setAppState] = useState(AppState.currentState);

  // Function to handle NFC tag detection
  // Tag id is set here
  const handleNfcTag = async tag => {
    if (tag?.id) {
      const id = addColons(tag.id);
      setTagDetected(tag);
      setTagId(id);
      // await getUid(id);
    }
  };

  // Initialize NFC scanning based on platform
  const initNfcScan = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        // iOS implementation
        await NfcManager.requestTechnology(NfcTech.MifareIOS);
        const tag = await NfcManager.getTag();
        await handleNfcTag(tag);
        await NfcManager.cancelTechnologyRequest();
        // Restart scanning after a short delay
        setTimeout(() => {
          initNfcScan();
        }, 1000);
      }
    } catch (error) {
      // Restart scanning on error after a delay
      if (Platform.OS === 'ios') {
        setTimeout(() => {
          initNfcScan();
        }, 1000);
      }
    }
  }, []);

  // Initialize Android NFC scanning
  const initAndroidNfc = useCallback(async () => {
    try {
      await NfcManager.registerTagEvent();
      NfcManager.setEventListener(NfcEvents.DiscoverTag, handleNfcTag);
    } catch (error) {
      console.warn('Error initializing Android NFC:', error);
    }
  }, []);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState !== 'active' && nextAppState === 'active') {
        // App came to foreground
        if (Platform.OS === 'ios') {
          initNfcScan();
        } else {
          initAndroidNfc();
        }
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, initNfcScan, initAndroidNfc]);

  // Initialize NFC when component mounts
  useEffect(() => {
    const setupNfc = async () => {
      try {
        await NfcManager.start();
        const isSupported = await NfcManager.isSupported();
        setHasNfc(isSupported);

        if (isSupported) {
          if (Platform.OS === 'android') {
            await initAndroidNfc();
          } else {
            await initNfcScan();
          }
        }
      } catch (error) {
        console.warn('Error setting up NFC:', error);
      }
    };

    setupNfc();

    // Cleanup
    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.unregisterTagEvent().catch(() => 0);
      if (Platform.OS === 'ios') {
        NfcManager.cancelTechnologyRequest().catch(() => 0);
      }
    };
  }, []);

  useEffect(() => {
    dashboardApi();
  }, []);

  function addColons(number) {
    return number.replace(/(.{2})(?=.)/g, '$1:');
  }

  const getUid = async uid => {
    try {
      setLoading(true);
      let formdata = new FormData();
      formdata.append('session_id', SessionId);
      formdata.append('device_id', '13213211');
      formdata.append('nfc_key', uid);
      await scanCall(formdata);
    } catch (error) {
      console.error('Error processing UID:', error);
    } finally {
      setLoading(false);
    }
  };
  console.log('*************isConnected**************', isConnected);
  useEffect(() => {
    const processTag = async () => {
      if (isConnected) {
        try {
          // check if internt is connected
          if (isConnected) {
            // TODO: add the api to send offline data to server
            dispatch(clearOfflineStorage());
            if (tagId !== '') {
              await getUid(tagId);
              setTagId('');
            }
          }
        } catch (error) {
          console.error('Error processing the tag:', error);
        }
      } else {
        if (tagId !== '') {
          showNotificationAboutTagScannedWhileOffline(tagId);
          dispatch(
            addDataToOfflineStorage({
              sessionId: SessionId,
              time: moment().format('YYYY-MM-DD HH:mm:ss'),
              tagId: tagId,
            }),
          );
          setTagId('');
        }
      }
    };

    processTag();
  }, [tagDetected, isConnected]);

  function dashboardApi() {
    setLoading(true);
    let formdata = new FormData();
    formdata.append('session_id', SessionId);
    formdata.append('device_id', '13213211');
    homecall(formdata);
  }

  useEffect(() => {
    if (Home.data?.data) {
      setList(Home.data.data);
    }
    setLoading(false);
  }, [Home]);

  if (!hasNfc) {
    return (
      <DrawerSceneWrapper>
        <SafeAreaView style={styles.centeredContainer}>
          <CustomHeader />
          <View style={styles.centeredContainer}>
            <Text style={styles.errorText}>
              Your device does not support NFC! If your device supports NFC turn
              it on from settings and restart the App
            </Text>
          </View>
        </SafeAreaView>
      </DrawerSceneWrapper>
    );
  }

  return (
    <DrawerSceneWrapper>
      <SafeAreaView style={{flex: 1, backgroundColor: '#EBF0FA'}}>
        <CustomHeader />
        <OfflineDataDisplay />

        <View style={styles.container}>
          <View>
            <NetworkStatusComponent />
          </View>
          <View style={styles.nfcPromptContainer}>
            <Image source={Images.NFC} style={styles.userIcon} />
            <Text style={styles.nfcPromptText}>Ready to Scan NFC Tags</Text>
            <Text style={styles.nfcPromptSubtext}>
              {Platform.OS === 'ios'
                ? 'When prompted, hold your device near an NFC tag'
                : 'Hold your device near an NFC tag'}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </DrawerSceneWrapper>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    backgroundColor: '#EBF0FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#000',
    fontSize: 18,
  },
  container: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modeContainer: {
    padding: 5,
    display: 'flex',
  },
  modeLabel: {
    fontSize: 25,
  },
  modeText: {
    fontSize: 19,
  },
  scanButton: {
    backgroundColor: '#0A1931',
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
  },

  // NFC Tag styles
  nfcPromptContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nfcPromptText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 10,
  },
  nfcPromptSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
});

export default Home;
