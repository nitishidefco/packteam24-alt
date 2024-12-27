import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  AppState,
  TouchableOpacity,
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
  const statess = useSelector(state => state);
  console.log('Full Redux State:', statess);
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

  // Handles the scanned NFC tag and extracts its ID
  const handleNfcTag = async tag => {
    if (tag?.id) {
      const id = addColons(tag.id); // Format the tag ID with colons
      setTagDetected(tag);
      setTagId(id);
    }
  };

  // Initializes NFC scanning for iOS
  const initNfcScan = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        await NfcManager.requestTechnology(NfcTech.MifareIOS); // Request NFC technology
        const tag = await NfcManager.getTag(); // Get the NFC tag
        await handleNfcTag(tag); // Process the scanned tag
        await NfcManager.cancelTechnologyRequest(); // Cancel the request after processing
      }
    } catch (error) {
      console.warn('Error initializing iOS NFC:', error);
    }
  }, []);

  // Initializes NFC for Android and sets up event listeners
  const initAndroidNfc = useCallback(async () => {
    try {
      await NfcManager.registerTagEvent(); // Register for NFC tag events
      NfcManager.setEventListener(NfcEvents.DiscoverTag, handleNfcTag); // Handle tag discovery
    } catch (error) {
      console.warn('Error initializing Android NFC:', error);
    }
  }, []);

  // Monitors app state changes to reinitialize NFC when returning to the app
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState !== 'active' && nextAppState === 'active') {
        if (Platform.OS === 'android') {
          initAndroidNfc();
        }
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, initAndroidNfc]);

  // Sets up NFC on component mount and cleans up on unmount
  useEffect(() => {
    const setupNfc = async () => {
      try {
        await NfcManager.start(); // Start NFC manager
        const isSupported = await NfcManager.isSupported(); // Check NFC support
        setHasNfc(isSupported);

        if (isSupported && Platform.OS === 'android') {
          await initAndroidNfc();
        }
      } catch (error) {
        console.warn('Error setting up NFC:', error);
      }
    };

    setupNfc();

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null); // Remove event listener
      NfcManager.unregisterTagEvent().catch(() => 0); // Unregister tag events
      if (Platform.OS === 'ios') {
        NfcManager.cancelTechnologyRequest().catch(() => 0); // Cancel iOS tech request
      }
    };
  }, [initAndroidNfc]);

  // Fetch dashboard data when the component is mounted
  useEffect(() => {
    dashboardApi();
  }, []);

  // Adds colons to a string for better readability
  function addColons(number) {
    return number.replace(/(.{2})(?=.)/g, '$1:');
  }

  // Processes the NFC tag ID by sending it to the server
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

  // Processes scanned tags based on network connectivity
  useEffect(() => {
    const processTag = async () => {
      if (isConnected) {

        try {
          dispatch(clearOfflineStorage()); // Clear offline storage if connected
          if (tagId !== '') {
            await getUid(tagId); // Send tag ID to server
            setTagId('');
          }
        } catch (error) {
          console.error('Error processing the tag:', error);
        }
      } else {
        // console.log('**********************sessions*************', sessions);

        if (tagId !== '') {
          showNotificationAboutTagScannedWhileOffline(
            tagId,
            sessions,
            SessionId,
          ); // Notify user
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

  // Fetches dashboard data from the server
  function dashboardApi() {
    setLoading(true);
    let formdata = new FormData();
    formdata.append('session_id', SessionId);
    formdata.append('device_id', '13213211');
    homecall(formdata);
  }

  // Updates the list of data when the home state changes
  useEffect(() => {
    if (Home.data?.data) {
      setList(Home.data.data);
    }
    setLoading(false);
  }, [Home]);

  // Render fallback UI if the device does not support NFC
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

  // Main render for the Home component
  return (
    <DrawerSceneWrapper>
      <SafeAreaView style={{flex: 1, backgroundColor: '#EBF0FA'}}>
        <CustomHeader />
        {/* TODO:Remove this later */}
        <OfflineDataDisplay />
        <View style={styles.container}>
          <View>
            <NetworkStatusComponent />
          </View>
          <View style={styles.nfcPromptContainer}>
            <Image source={Images.NFC} style={styles.userIcon} />
            <Text style={styles.nfcPromptText}>Ready to Scan NFC Tags</Text>
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => initNfcScan()}>
                <Text style={styles.buttonText}>Start NFC Scan</Text>
              </TouchableOpacity>
            )}
            {Platform.OS === 'android' && (
              <Text style={styles.nfcPromptSubtext}>
                Hold your device near an NFC tag
              </Text>
            )}
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
  scanButton: {
    backgroundColor: '#0A1931',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
