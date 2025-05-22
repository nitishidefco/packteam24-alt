import React, {useEffect, useState, useCallback, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';

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
import {
  addDataToOfflineStorage,
  dataForBulkUpdate,
} from '../../Redux/Reducers/SaveDataOfflineSlice';
import {showNotificationAboutTagScannedWhileOffline} from '../../Utlis/NotificationsWhileOffline';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {setDeviceInfo} from '../../Redux/Reducers/NetworkSlice';
import DeviceInfo from 'react-native-device-info';
import {useNfcStatus} from '../../Utlis/CheckNfcStatus';
import WorkStatusBar from '../../Components/Common/WorkStatusBar';
import {useFetchNfcTagsActions} from '../../Redux/Hooks/useFetchNfcTagsActions';
import {reduxStorage} from '../../Redux/Storage';
import LanguageSelector from '../../Components/Common/LanguageSelector';
import Timer from '../../Components/Common/Timer';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import TimeLog from '../../Components/HomeComponent/TimeLog';
import {initializeLanguage} from '../../Redux/Reducers/LanguageProviderSlice';
import {setSessionHandler} from '../../Utlis/SessionHandler';
import {errorToast} from '../../Helpers/ToastMessage';
import RealTime from '../../Components/HomeComponent/RealTime';
import {
  fetchMessagesStart,
  fetchUnreadCountStart,
} from '../../Redux/Reducers/MessageSlice';
import {Store} from '../../Redux/Store';
import {useTheme} from '../../Context/ThemeContext';

const Home = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {searchQuery, filterType} = useSelector(state => state.Messages);
  useNfcStatus();
  const {t, i18n} = useTranslation();
  const {sessions, bulkSessions} = useSelector(state => state?.OfflineData);
  // Current time from the server time
  const realTime = useSelector(state => state.TrueTime.currentTime);

  const isConnected = useSelector(state => state?.Network?.isConnected);
  const [duplicateTagId, setDuplicateTagId] = useState('');
  const [tagDetected, setTagDetected] = useState();
  const [tagId, setTagId] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNfc, setHasNfc] = useState(false);
  const [List, setList] = useState([]);
  const {state, homecall} = useHomeActions();
  const {state: states, scanCall, bulkScanCall} = useScanTagActions();
  const {Auth, Home} = state;
  const SessionId = Auth.data?.data?.sesssion_id;
  const [appState, setAppState] = useState(AppState.currentState);
  const {fetchTagsCall} = useFetchNfcTagsActions();
  const [tagsFromLocalStorage, setTagsFromLocalStorage] = useState([]);
  const {deviceId} = useSelector(state => state?.Network);
  const {globalLanguage} = useSelector(state => state?.GlobalLanguage);
  const {localWorkHistory} = useSelector(state => state?.LocalWorkHistory);
  const currentTime = useSelector(state => state.TrueTime.currentTime);
  const messageState = useSelector(state => state.Messages);

  // Set session handler values

  const [count, setCount] = useState(0);

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
  useEffect(() => {
    dispatch(initializeLanguage());
  }, []);

  useEffect(() => {
    const deviceMoment = moment().tz('Europe/Berlin');
    const serverMoment = moment.tz(
      `${currentTime?.date} ${currentTime?.time}`,
      'YYYY-MM-DD HH:mm:ss',
      'Europe/Berlin',
    );
    if (Platform.OS === 'ios' && appState !== 'active') {
      return;
    }
  }, [appState, tagDetected]);

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
    setSessionHandler(dispatch, SessionId, deviceId, navigation);
  }, []);

  useEffect(() => {
    const fetchNfcTags = async () => {
      try {
        const fetchedTags = await reduxStorage.getItem('nfcTags');
        const parsedTags = JSON.parse(fetchedTags);
        setTagsFromLocalStorage(parsedTags);
      } catch (error) {}
    };

    // updateWorkStatus();
    fetchNfcTags();
  }, [tagDetected, count, isConnected]);

  // Get nfc from server and save in local storage
  useEffect(() => {
    const saveNfcTagToLocalStorage = async () => {
      try {
        let formData = new FormData();
        formData.append('session_id', SessionId);
        formData.append('device_id', deviceId);
        formData.append('lang', globalLanguage);
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
      await NfcManager.registerTagEvent();
      NfcManager.setEventListener(NfcEvents.DiscoverTag, handleNfcTag);
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
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      navigation.replace('HomeDrawer', {}, {animationEnabled: false});
      setRefreshing(false);
    }, 2000);
  }, [navigation]);
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

  useFocusEffect(
    useCallback(() => {
      if (appState === 'active' && SessionId) {
        const formData = new FormData();
        formData.append('session_id', SessionId);
        formData.append('device_id', deviceId);
        formData.append('lang', globalLanguage);
        formData.append('page', 1);
        if (filterType === 'read') {
          formData.append('status', 1);
        } else if (filterType === 'unread') {
          formData.append('status', 0);
        }
        if (searchQuery?.trim() !== '') {
          formData.append('keyword', searchQuery);
        }
        console.log('Calling for messages and unread count');
        dispatch(fetchMessagesStart({payload: formData}));
        dispatch(fetchUnreadCountStart({payload: formData}));
      }
    }, [appState, SessionId, deviceId, globalLanguage, dispatch]),
  );

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
      formdata.append('device_id', deviceId);
      formdata.append('nfc_key', uid);
      formdata.append('lang', globalLanguage);

      scanCall(formdata);
    } catch (error) {
      console.error('Error processing UID:', error);
    } finally {
      setLoading(false);
    }
  };
  const makeBulkCall = async data => {
    try {
      setLoading(true);
      let formdata = new FormData();
      formdata.append('session_id', SessionId);
      formdata.append('device_id', deviceId);
      formdata.append('lang', globalLanguage);
      formdata.append('data', JSON.stringify(data));

      bulkScanCall(formdata);
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
    if (
      sessionData &&
      sessionData.items &&
      !localWorkHistory[localWorkHistory?.length - 1]?.to?.includes(':')
    ) {
      // Sort the items by time in descending order (latest first)
      const sortedItems = [...sessionData.items].sort((a, b) => {
        const timeA = new Date(a.time);
        const timeB = new Date(b.time);
        return timeB - timeA; // Sort in descending order
      });

      return sortedItems[0]?.tagId;
    }

    return null;
  };
  const mostRecentTagId = getMostRecentTagId(SessionId);
  /* -------------------------- get tag mode from id -------------------------- */

  function findModeByTagId(tags, tagId) {
    const matchingTag = tags.find(tag => tag.key === tagId);
    return matchingTag ? matchingTag.mode : null;
  }
  const [tagMode, setTagMode] = useState(null);
  const mode =
    mostRecentTagId && findModeByTagId(tagsFromLocalStorage, mostRecentTagId);
  useEffect(() => {
    setTagMode(mode);
  }, [mode]);

  /* ------------------- Processing online and offline tags ------------------- */
  useEffect(() => {
    if (!SessionId) return;

    const processOnlineTags = async (storedSessions, bulkStoredSessions) => {
      try {
        if (tagId) {
          await getUid(tagId);
          setTagId('');
        }

        if (bulkStoredSessions.length > 0) {
          await makeBulkCall(bulkStoredSessions);
        }
        // console.log('bulk stored sessions', bulkStoredSessions);
      } catch (error) {
        console.error('Error processing online tags:', error);
      }
    };

    const processOfflineTag = bulkStoredSessions => {
      const tagModeInProcessOfflineTag = findModeByTagId(
        tagsFromLocalStorage,
        tagId,
      );
      if (tagsFromLocalStorage.length === 0 && tagId) {
        errorToast(
          'Connect to internet atleast once',
          'We cannot detect your tags',
        );
        setTagId('');
        return;
      }
      if (
        tagModeInProcessOfflineTag === 'work_end' &&
        localWorkHistory.length === 0
      ) {
        errorToast(i18n.t('Toast.Cannotendwork'));
        setTagId('');
        return;
      } else if (
        tagModeInProcessOfflineTag === 'break_start' &&
        localWorkHistory.length === 0
      ) {
        errorToast(i18n.t('Toast.Cannottakebreak'));
        setTagId('');
        return;
      } else if (
        !tagId ||
        localWorkHistory[localWorkHistory?.length - 1]?.to?.includes(':')
      ) {
        console.log('tagId', tagId);

        console.log(localWorkHistory[localWorkHistory?.length - 1]?.to);

        console.log('tag id is empty or last item is not ended');
        setTagId('');
        return;
      } else {
        setDuplicateTagId(tagId);

        try {
          const current_date = realTime.date;
          const current_hour = realTime.time;

          dispatch(
            addDataToOfflineStorage({
              sessionId: SessionId,
              time: moment().format('YYYY-MM-DD HH:mm:ss'),
              tagId,
              current_date,
              current_hour,
            }),
          );
          dispatch(
            dataForBulkUpdate({
              sessionId: SessionId,
              nfc_key: tagId,
              date: current_date,
              hour: current_hour,
            }),
          );
        } catch (error) {
          console.error('error', error);
        }
      }

      if (localWorkHistory.length > 0) {
        console.log('*******************Shwoing notification**************');

        showNotificationAboutTagScannedWhileOffline(
          tagId,
          tagsFromLocalStorage,
          localWorkHistory,
        );
      }
      setTagId('');
    };

    const processTag = async () => {
      const storedSessions = sessions[SessionId]?.items || [];
      const bulkStoredSessions = bulkSessions[SessionId]?.items || [];
      if (isConnected) {
        await processOnlineTags(storedSessions, bulkStoredSessions);
      } else {
        processOfflineTag(bulkStoredSessions);
      }
    };

    processTag();
  }, [tagDetected, isConnected]);

  // Fetches dashboard data from the server
  function dashboardApi() {
    setLoading(true);
    let formdata = new FormData();
    formdata.append('session_id', SessionId);
    formdata.append('device_id', deviceId);
    formdata.append('lang', globalLanguage);
    homecall(formdata);
  }

  // Updates the list of data when the home state changes
  useEffect(() => {
    if (Home.data?.data) {
      setList(Home.data.data);
    }
    setLoading(false);
  }, [Home]);
  const theme = useTheme();
  return (
    <DrawerSceneWrapper>
      <SafeAreaView style={{backgroundColor: '#EBF0FA', flex: 1}}>
        <CustomHeader />
        <ScrollView
          style={{backgroundColor: '#EBF0FA', flex: 1}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              Platform.OS === 'android'
                ? styles.topContainer
                : styles.topContainerios,
            ]}>
            {/* {!isTimeValid && (
              <Text
                style={[
                  {
                    fontFamily: typography.fontFamily.Montserrat.SemiBold,
                    textAlign: 'center',
                    paddingHorizontal: Matrics.s(10),
                    marginBottom: Matrics.vs(5),
                    color: COLOR.ERROR,
                  },
                  Platform.OS === 'ios'
                    ? {} // iOS-specific styles
                    : {
                        marginTop: Matrics.vs(15),
                        marginBottom: Matrics.vs(0),
                      }, // Android-specific styles
                ]}>
                {i18n.t('HomeScreen.importantNotice')}
              </Text>
            )} */}
            <View
              style={{
                position: 'relative',
                alignItems: 'flex-end',
                paddingHorizontal: Matrics.s(10),
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
                <WorkStatusBar
                  tagsFromLocalStorage={tagsFromLocalStorage}
                  tag={tagDetected}
                />
              </View>
              <View style={styles.nfcPromptContainer}>
                <Image source={Images.NFC} style={styles.userIcon} />
                <Text style={styles.nfcPromptText}>
                  {t('HomeScreen.nfcCardTitle')}
                </Text>

                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={[
                      styles.scanButton,
                      {
                        backgroundColor: theme.PRIMARY,
                      },
                    ]}
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
            </View>
            <RealTime />
          </View>
          <View style={styles.timeLogContainer}>
            <TimeLog
              sessionId={SessionId}
              tag={tagDetected}
              tagsFromLocalStorage={tagsFromLocalStorage}
            />
          </View>
          {/* <NotificationComponent /> */}
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
