import React, {useEffect, useState, useCallback} from 'react';
import {useTranslation} from 'react-i18next';

import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  AppState,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useHomeActions} from '../../Redux/Hooks';
import DrawerSceneWrapper from '../../Components/Common/DrawerSceneWrapper';
import CustomHeader from '../../Components/Common/CustomHeader';
import {Images} from '../../Config';
import NfcManager, {NfcTech, NfcEvents} from 'react-native-nfc-manager';
import {useScanTagActions} from '../../Redux/Hooks/useScanTagActions';
import {useWorkStatusActions} from '../../Redux/Hooks/useWorkStatusActions';
// import NetworkStatusComponent from '../../Components/Common/NetworkStatus';
import {
  clearOfflineStorage,
  addDataToOfflineStorage,
} from '../../Redux/Reducers/SaveDataOfflineSlice';
import {showNotificationAboutTagScannedWhileOffline} from '../../Utlis/NotificationsWhileOffline';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {setDeviceInfo} from '../../Redux/Reducers/NetworkSlice';
import DeviceInfo from 'react-native-device-info';
import {useNfcStatus} from '../../Utlis/CheckNfcStatus';
import WorkStatusBar from '../../Components/Common/WorkStatusBar';
import useValidateTag from '../../Components/Hooks/useValidateTag';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFetchNfcTagsActions} from '../../Redux/Hooks/useFetchNfcTagsActions';
import {reduxStorage} from '../../Redux/Storage';
import useSavedLanguage from '../../Components/Hooks/useSavedLanguage';
import LanguageSelector from '../../Components/Common/LanguageSelector';
import Timer from '../../Components/Common/Timer';
import {Matrics, typography} from '../../Config/AppStyling';
import TimeLog from '../../Components/HomeComponent/TimeLog';
import TimerNew from '../../Components/Common/TimerNew';
const Home = ({navigation, route}) => {
  const dispatch = useDispatch();

  useNfcStatus();
  const {t, i18n} = useTranslation();
  const sessions = useSelector(state => state?.OfflineData?.sessions);
  const isConnected = useSelector(state => state?.Network?.isConnected);
  const isNfcEnabled = useSelector(state => state?.Network?.isNfcEnabled);
  const [duplicateTagId, setDuplicateTagId] = useState('');
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
  const [validationResult, setValidationResult] = useState(null);
  const {fetchTagsCall} = useFetchNfcTagsActions();
  const {fetchWorkStatusCall} = useWorkStatusActions();
  const [tagsFromLocalStorage, setTagsFromLocalStorage] = useState([]);

  // let validationResult1 = useValidateTag(tagId, sessionItems);
  // useEffect(() => {
  //   setValidationResult(validationResult1);
  // }, []);
  // console.log('Validation result', validationResult);

  //
  // on every refresh its showing notification
  // Handles the scanned NFC tag and extracts its ID
  const [count, setCount] = useState(0);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const handleNfcTag = async tag => {
    setCount(prevCount => prevCount + 1);
    if (tag?.id) {
      const id = addColons(tag.id); // Format the tag ID with colons
      setTagDetected(tag);
      setTagId(id);
      setDuplicateTagId(id);
    }
  };
  /* -------------------------------- language -------------------------------- */
  const language = useSavedLanguage();
  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language); // Change language once it's loaded
    }
  }, [language]);

  /* ----------------------------- Get device info ---------------------------- */
  useEffect(() => {
    const getDeviceInfo = async () => {
      const deviceId = await DeviceInfo.getUniqueId();
      const manufacturer = await DeviceInfo.getManufacturer();
      dispatch(
        setDeviceInfo({
          deviceId: deviceId,
          manufacturer: manufacturer,
        }),
      );
    };
    getDeviceInfo();
  }, []);
  // fetching nfc tags stored in local storage
  useEffect(() => {
    const fetchNfcTags = async () => {
      try {
        const fetchedTags = await reduxStorage.getItem('nfcTags');
        const parsedTags = JSON.parse(fetchedTags);
        setTagsFromLocalStorage(parsedTags);
      } catch (error) {
        console.log('Error in fetching tags from mmkv storage', error);
      }
    };
    const updateWorkStatus = async () => {
      try {
        let formdata = new FormData();
        formdata.append('session_id', SessionId);
        formdata.append('device_id', '13213211');
        formdata.append('lang', language);
        fetchWorkStatusCall(formdata);
      } catch (error) {
        console.error('Error updating work status', error);
      }
    };
    updateWorkStatus();
    fetchNfcTags();
  }, [tagDetected, count]);

  // Get nfc from server and save in local storage
  useEffect(() => {
    const saveNfcTagToLocalStorage = async () => {
      try {
        let formData = new FormData();
        formData.append('session_id', SessionId);
        formData.append('device_id', '13213211');
        formData.append('lang', language);
        fetchTagsCall(formData);
      } catch (error) {
        console.error('Error saving nfc tags to local storage', error);
      }
    };
    saveNfcTagToLocalStorage();
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
      formdata.append('lang', language);
      scanCall(formdata);
    } catch (error) {
      console.error('Error processing UID:', error);
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------- most recent tag id --------------------------- */
  const getMostRecentTagId = sessionId => {
    const sessionData = sessions[sessionId];

    // Check if sessionData and items are present
    if (sessionData && sessionData.items) {
      // Sort the items by time in descending order (latest first)
      const sortedItems = [...sessionData.items].sort((a, b) => {
        const timeA = new Date(a.time);
        const timeB = new Date(b.time);
        return timeB - timeA; // Sort in descending order
      });

      return sortedItems[0]?.tagId;
    }

    return null; // If session data or items are not available
  };
  const mostRecentTagId = getMostRecentTagId(SessionId);
  /* -------------------------- get tag mode from id -------------------------- */

  function findModeByTagId(tags, tagId) {
    const matchingTag = tags.find(tag => tag.key === tagId);
    return matchingTag ? matchingTag.mode : null;
  }
  const [tagMode, setTagMode] = useState(null);
  const mode = findModeByTagId(tagsFromLocalStorage, mostRecentTagId);
  useEffect(() => {
    setTagMode(mode);
  }, [mode]);

  // const updateLastEffectiveTagMode = async (tagMode) => {
  //   await reduxStorage.setItem('tagForOfflineValidation', tagMode);
  // };

  // useEffect(() => {
  //   updateLastEffectiveTagMode();
  // }, [tagMode]);
  // console.log('tagDetected', tagDetected);

  /* ------------------- Processing online and offline tags ------------------- */
  useEffect(() => {
    if (!SessionId) return;

    const processOnlineTags = async storedSessions => {
      try {
        if (tagId) {
          // Process the current tag when online
          await getUid(tagId);
          setTagId('');
        }

        if (storedSessions.length > 0) {
          console.log('Processing stored offline tags...');
          for (const [index, item] of storedSessions.entries()) {
            try {
              await getUid(item.tagId);
            } catch (error) {
              console.error(
                `Error processing stored tag ${item.tagId}:`,
                error,
              );
            }

            // Add a delay of 6 seconds before the next item (except for the last one)
            if (index < storedSessions.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 6000));
            }
          }
        }

        // Clear offline storage after processing
        dispatch(clearOfflineStorage());
      } catch (error) {
        console.error('Error processing online tags:', error);
      }
    };

    const processOfflineTag = () => {
      if (!tagId) return;
      setDuplicateTagId(tagId);

      // if (!validationResult.valid) {
      //   showNotificationAboutTagScannedWhileOffline(validationResult);
      //   return;
      // }

      dispatch(
        addDataToOfflineStorage({
          sessionId: SessionId,
          time: moment().format('YYYY-MM-DD HH:mm:ss'),
          tagId,
          // initialScanTime,
          // initialTagMode,
        }),
      );

      showNotificationAboutTagScannedWhileOffline(tagId, tagsFromLocalStorage);
      setTagId('');
    };

    const processTag = async () => {
      const storedSessions = sessions[SessionId]?.items || [];

      if (isConnected) {
        await processOnlineTags(storedSessions);
      } else {
        processOfflineTag();
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
    formdata.append('lang', language);
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
  // if (!hasNfc) {
  //   return (
  //     <DrawerSceneWrapper>
  //       <SafeAreaView style={styles.centeredContainer}>
  //         <CustomHeader />
  //         <View style={styles.centeredContainer}>
  //           <Text style={styles.errorText}>
  //             Your device does not support NFC! If your device supports NFC turn
  //             it on from settings and restart the App
  //           </Text>
  //         </View>
  //       </SafeAreaView>
  //     </DrawerSceneWrapper>
  //   );
  // }
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
      <SafeAreaView style={{backgroundColor: '#EBF0FA', flex: 1}}>
        <CustomHeader />
        <ScrollView
          style={{backgroundColor: '#EBF0FA', flex: 1}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View
            style={[
              Platform.OS === 'android'
                ? styles.topContainer
                : styles.topContainerios,
            ]}>
            <View
              style={{
                position: 'relative',
                alignItems: 'flex-end',
                marginRight: Matrics.ms(20),
                marginBottom: Matrics.vs(30),
              }}>
              <LanguageSelector sessionId={SessionId} />
            </View>
            <View
              style={[
                Platform.OS === 'android'
                  ? styles.timerContainer
                  : styles.timerContainerIos,
              ]}>
              <Timer
                tag={tagDetected}
                tagsFromLocalStorage={tagsFromLocalStorage}
                sessionId={SessionId}
              />
              {/* <TimerNew /> */}
            </View>
            {/* <OfflineDataDisplay /> */}
            <View style={styles.container}>
              <View>
                {/* <NetworkStatusComponent /> */}
                <WorkStatusBar tagMode={tagMode} tag={tagDetected} />
              </View>
              <View style={styles.nfcPromptContainer}>
                <Image source={Images.NFC} style={styles.userIcon} />
                <Text style={styles.nfcPromptText}>
                  {t('HomeScreen.nfcCardTitle')}
                </Text>

                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={styles.scanButton}
                    onPress={() => initNfcScan()}>
                    <Text style={styles.buttonText}>
                      {t('HomeScreen.nfcButtonText')}
                    </Text>
                  </TouchableOpacity>
                )}
                {Platform.OS === 'android' && (
                  <Text style={styles.nfcPromptSubtext}>
                    {t('HomeScreen.nfcCardSubtitle')}
                  </Text>
                )}
              </View>
              {/* <View style={{marginTop: Matrics.ms(40)}}>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.Montserrat.SemiBold,
                    fontSize: typography.fontSizes.fs15,
                  }}>
                  {Platform.OS === 'android'
                    ? 'Scroll to see the Time Log'
                    : ''}
                </Text>
              </View> */}
            </View>
          </View>
          <View style={styles.timeLogContainer}>
            <TimeLog sessionId={SessionId} tag={tagDetected} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </DrawerSceneWrapper>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    // minHeight: Matrics.screenHeight,
    // justifyContent: 'space-between',
    // alignContent: 'space-between',
    // flex: 1,
    // backgroundColor:'red'
    // marginTop: Matrics.vs(20),
  },
  topContainerios: {
    marginTop: Matrics.vs(20),
  },
  // centeredContainer: {
  //   flex: 1,
  //   backgroundColor: '#EBF0FA',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
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
    textAlign: 'center',
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
  timerContainer: {
    // position: 'absolute',
    // top: Matrics.screenHeight < 780 ? Matrics.ms(100) : Matrics.ms(150),
    // left: Matrics.screenWidth / 4.5,
    marginTop: Matrics.vs(60),
  },
  timerContainerIos: {},
  timeLogContainer: {
    // alignItems: 'center',
    marginTop: Matrics.ms(40),
    width: Matrics.screenWidth - 40,
    marginHorizontal: 'auto',
    borderRadius: Matrics.s(10),
    marginBottom: Matrics.ms(20),
  },
});

export default Home;
