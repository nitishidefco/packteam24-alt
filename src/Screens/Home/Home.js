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
import {setDeviceInfo} from '../../Redux/Reducers/NetworkSlice';
import DeviceInfo from 'react-native-device-info';
import {useNfcStatus} from '../../Utlis/CheckNfcStatus';
import WorkStatusBar from '../../Components/Common/WorkStatusBar';
import {setLastOnlineMode} from '../../Redux/Reducers/WorkStateSlice';

const Home = ({navigation, route}) => {
  const dispatch = useDispatch();
  useNfcStatus();
  const sessions = useSelector(state => state?.OfflineData?.sessions);
  const isConnected = useSelector(state => state?.Network?.isConnected);
  const isNfcEnabled = useSelector(state => state?.Network?.isNfcEnabled);
  const lastOnlineMode = useSelector(state => state?.WorkState?.lastOnlineMode);
  const [duplicateTagId, setDuplicatTagId] = useState('');
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
  const CurrentMode = states?.data?.data?.mode;
  const [appState, setAppState] = useState(AppState.currentState);
  const {deviceId, manufacturer} = useSelector(state => state?.Network);
  const [isFirstOfflineScan, setFirstOfflineScan] = useState(true);
  // Handles the scanned NFC tag and extracts its ID
  const handleNfcTag = async tag => {
    if (tag?.id) {
      const id = addColons(tag.id); // Format the tag ID with colons
      setTagDetected(tag);
      setTagId(id);
    }
  };
  useEffect(() => {
    const getDeviceInfo = async () => {
      const deviceId = await DeviceInfo.getUniqueId();
      const manufacturer = await DeviceInfo.getManufacturer();

      console.log('devialsdfkj', deviceId);

      dispatch(
        setDeviceInfo({
          deviceId: deviceId,
          manufacturer: manufacturer,
        }),
      );
    };
    getDeviceInfo();
  }, []);

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
    if (SessionId) {
      const processTag = async () => {
        if (isConnected) {
          try {
            // Get stored sessions before clearing
            dispatch(setLastOnlineMode(CurrentMode)); // Update lastOnlineMode with CurrentMode when online
            const storedSessions = sessions[SessionId]?.items || [];

            if (tagId !== '') {
              // Process the current tag first when online
              await getUid(tagId);
              setTagId('');
            }

            // If there are stored offline tags, process them sequentially
            if (storedSessions.length > 0) {
              console.log('Processing stored offline tags...');

              // Process each stored tag one by one with delay
              for (const item of storedSessions) {
                try {
                  await getUid(item.tagId);
                  // Add 6-second delay before processing next tag
                  // Skip delay for the last item
                  if (
                    storedSessions.indexOf(item) <
                    storedSessions.length - 1
                  ) {
                    await new Promise(resolve => setTimeout(resolve, 6000));
                  }
                } catch (error) {
                  console.error(
                    `Error processing stored tag ${item.tagId}:`,
                    error,
                  );
                  // Still wait 6 seconds before trying next tag even if there's an error
                  if (
                    storedSessions.indexOf(item) <
                    storedSessions.length - 1
                  ) {
                    await new Promise(resolve => setTimeout(resolve, 6000));
                  }
                }
              }
            }

            // Clear storage after all tags are processed
            dispatch(clearOfflineStorage());
          } catch (error) {
            console.error('Error processing tags:', error);
          }
        } else {
          // Offline mode - store the tag and update lastOnlineMode for subsequent scans
          if (tagId !== '') {
            setDuplicatTagId(tagId);

            // Determine the mode based on the tagId scanned
            let tagMode = '';
            if (
              tagId === '53:AE:E6:BB:40:00:01' ||
              tagId === '53:71:D8:BB:40:00:01'
            ) {
              tagMode = 'work_start';
            } else if (
              tagId === '53:1E:3D:BC:40:00:01' ||
              tagId === '53:30:85:BB:40:00:01'
            ) {
              tagMode = 'break_start';
            } else if (
              tagId === '53:88:66:BC:40:00:01' ||
              tagId === '53:8B:07:BC:40:00:01'
            ) {
              tagMode = 'work_end';
            }

            // If this is the first offline scan, do not update lastOnlineMode
            if (isFirstOfflineScan) {
              // Just store the data without updating lastOnlineMode
              dispatch(
                addDataToOfflineStorage({
                  sessionId: SessionId,
                  time: moment().format('YYYY-MM-DD HH:mm:ss'),
                  tagId: tagId,
                  lastOnlineMode: lastOnlineMode, // lastOnlineMode remains the same
                }),
              );
              setFirstOfflineScan(false); // Mark that the first offline scan has occurred
            } else {
              // After the first offline scan, update lastOnlineMode
              dispatch(setLastOnlineMode(tagMode)); // Update lastOnlineMode based on the first offline scan
              dispatch(
                addDataToOfflineStorage({
                  sessionId: SessionId,
                  time: moment().format('YYYY-MM-DD HH:mm:ss'),
                  tagId: tagId,
                  lastOnlineMode: tagMode, // Use the new lastOnlineMode after the first offline scan
                }),
              );
            }

            showNotificationAboutTagScannedWhileOffline(
              tagId,
              sessions,
              SessionId,
              lastOnlineMode,
            );
            setTagId('');
          }
        }
      };

      processTag();
    }
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
  if (Platform.OS === 'android') {
    if (!isNfcEnabled) {
      return (
        <DrawerSceneWrapper>
          <CustomHeader />

          <View style={styles.container}>
            <Text style={styles.title}>NFC is Required</Text>
            <Text style={styles.description}>
              Near Field Communication (NFC) allows your phone to communicate
              with nearby devices. You'll need to enable it to use this feature.
            </Text>

            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => NfcManager.goToNfcSetting()}>
              <Text style={styles.buttonText}>Open NFC Settings</Text>
            </TouchableOpacity>

            <Text style={styles.hint}>
              After enabling NFC, return to this screen to continue
            </Text>
          </View>
        </DrawerSceneWrapper>
      );
    }
  }

  return (
    <DrawerSceneWrapper>
      <SafeAreaView style={{flex: 1, backgroundColor: '#EBF0FA'}}>
        <CustomHeader />
        {/* <OfflineDataDisplay /> */}
        <View style={styles.container}>
          <View>
            {/* <NetworkStatusComponent /> */}
            <WorkStatusBar tagId={duplicateTagId} sessionId={SessionId} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  hint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default Home;
