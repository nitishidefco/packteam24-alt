//Working offline scan code

import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useWorkHistoryActions} from '../../Redux/Hooks/useWorkHistoryActions';
import {useWorkStatusActions} from '../../Redux/Hooks/useWorkStatusActions';
import {useDispatch, useSelector} from 'react-redux';
import {getCurrentTime} from '../../Helpers/GetCurrentTime';
import {findModeByTagId} from '../../Helpers/FindModeByTagId';
import moment from 'moment-timezone';
import {Matrics, typography} from '../../Config/AppStyling';
import {OffineStatus} from '../../Redux/Reducers/WorkStateSlice';
import {
  saveTag,
  saveTagToLocalStorage,
} from '../../Redux/Reducers/SaveDataOfflineSlice';
import i18n from '../../i18n/i18n';
import reactotron from '../../../ReactotronConfig';
import {useScanTagActions} from '../../Redux/Hooks/useScanTagActions';
import {reduxStorage} from '../../Redux/Storage';

const Timer = ({tag, tagsFromLocalStorage, sessionId}) => {
  const dispatch = useDispatch();
  const {state: currentStatus, fetchWorkStatusCall} = useWorkStatusActions();
  const {state: scanTagState} = useScanTagActions();
  const [appState, setAppState] = useState(AppState.currentState);
  const [randomState, setRandomState] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  const {
    workHistoryState,
    getWorkHistoryCall,
    getRealTimeCall,
    realTime,
    realTimeLoading,
  } = useWorkHistoryActions();
  const {deviceId} = useSelector(state => state?.Network);
  const {globalLanguage} = useSelector(state => state?.GlobalLanguage);
  const {localWorkHistory} = useSelector(state => state?.LocalWorkHistory);
  const {isConnected} = useSelector(state => state?.Network);
  const tagMode = findModeByTagId(tagsFromLocalStorage, tag?.id);
  const {tagInLocalStorage} = useSelector(state => state.OfflineData);
  const {isLoading} = useSelector(state => state?.Scan);

  const nowTranslation = ['Jetzt', 'Now', 'now', 'Сейчас', 'Зараз', 'Teraz'];
  // const [tagMode, setTagMode] = useState(tagModeById);
  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      // console.log('App State changed to:', nextAppState);
      await saveAppState(nextAppState);

      if (nextAppState === 'active') {
      } else if (nextAppState === 'background' && intervalRef.current) {
        setRandomState(!randomState);
      }

      setAppState(nextAppState);
      setTagMode(null);
      // setSeconds(0);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      subscription.remove();
    };
  }, []);
  const saveAppState = async appState => {
    try {
      await AsyncStorage.setItem('appState', appState);
    } catch (error) {
      console.error('Error saving app state:', error);
    }
  };

  useEffect(() => {
    reactotron.log('Real time called', realTime, realTimeLoading);

    getRealTimeCall();
  }, [appState, localWorkHistory?.length, isConnected]);

  useEffect(() => {
    if (appState !== 'active') return;
    setInitialTimer();
  }, [
    appState,
    workHistoryState.workHistoryLoading,
    localWorkHistory?.length,
    localWorkHistory?.[localWorkHistory?.length - 1]?.to,
    isConnected,
    randomState,
    realTimeLoading,
  ]);
  const setInitialTimer = async () => {
    if (
      isConnected &&
      workHistoryState?.data?.length > 0 &&
      !workHistoryState.workHistoryLoading
    ) {
      console.log('*******************************************************');
      const serverDate = await reduxStorage.getItem('trueDate');
      const lastEntry =
        workHistoryState.data[workHistoryState.data.length - 1].from;
      reactotron.log('real time', realTime);
      const lastEntryMoment = moment.tz(
        `${serverDate}${lastEntry}`,
        'YYYY-MM-DD HH:mm:ss',
        'Europe/Berlin',
      );

      // const response = await fetch(
      //   'https://api.api-ninjas.com/v1/worldtime?timezone=europe/berlin',
      //   {
      //     method: 'GET',
      //     headers: {
      //       'x-api-key': 'SZ/zOVovpgPKJes25Efr0w==8z8QOT4apepJLwWH',
      //     },
      //   },
      // );

      // const data = await response.json();
      const nowMoment = moment.tz(
        `${realTime}`,
        'YYYY-MM-DD HH:mm:ss',
        'Europe/Berlin',
      );
      const elapsedTime = nowMoment.diff(lastEntryMoment, 'seconds');
      reactotron.log('Elapsed time', elapsedTime);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (
        nowTranslation.includes(
          workHistoryState?.data[workHistoryState?.data?.length - 1]?.to,
        )
      ) {
        setSeconds(elapsedTime);
        if (workHistoryState?.data?.length === 1) {
          controlTimer(
            workHistoryState?.data[workHistoryState?.data?.length - 1]
              ?.mode_raw === 'work'
              ? 'work_in_progress'
              : 'break_start' || tagMode,
          );
        } else {
          controlTimer(
            workHistoryState?.data[workHistoryState?.data?.length - 1]
              ?.mode_raw === 'work'
              ? 'work_in_progress'
              : 'break_in_progress' || tagMode,
          );
        }
        // controlTimer(currentStatus?.currentState?.work_status || tagMode);
      } else {
        stopTimer();
      }
    } else if (!isConnected && localWorkHistory?.length > 0) {
      // dispatch(OffineStatus());

      const lastEntryTime = moment.tz(
        localWorkHistory[localWorkHistory.length - 1].from,
        'HH:mm:ss',
        'Europe/Berlin',
      );

      const now = moment.tz('Europe/Berlin');
      const elapsedTime = Math.abs(now.diff(lastEntryTime, 'seconds'));
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (
        nowTranslation.includes(
          localWorkHistory[localWorkHistory.length - 1].to,
        )
      ) {
        setSeconds(elapsedTime);

        controlTimer(
          tagInLocalStorage ||
            tagMode ||
            localWorkHistory[localWorkHistory.length - 1].mode_raw === 'work'
            ? 'work_in_progress'
            : 'break_in_progress',
        );
      } else {
        stopTimer();
      }
    } else {
      if (tagMode === 'break_start') {
        stopTimer();
      } else if (
        workHistoryState.data.length > 0 ||
        localWorkHistory.length > 0
      ) {
        controlTimer(tagInLocalStorage || tagMode);
      } else if (tagMode === 'work_start') {
        controlTimer(tagMode);
      } else {
        stopTimer();
      }
    }
  };
  useEffect(() => {
    if (!isConnected) {
      dispatch(saveTagToLocalStorage(tagMode));
    }
  }, [appState]);
  useEffect(() => {
    // if (appState !== 'active') return;
    if (scanTagState.normalScanLoading) return;
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', deviceId);
    formData.append('lang', globalLanguage);
    if (isConnected) {
      getWorkHistoryCall(formData);
      fetchWorkStatusCall(formData);
    }
  }, [scanTagState.normalScanLoading, isConnected]);

  const [pretag, setPreTag] = useState(null);
  const controlTimer = currentTag => {
    console.log('currentTag==>', currentTag, pretag, tagInLocalStorage);

    if (
      (currentTag === 'break_start' && pretag === 'break_start') ||
      (currentTag === 'work_start' && pretag === 'work_start')
    ) {
      startTimer();
      return;
    }
    if (!currentTag) {
      stopTimer();
      return;
    }
    setPreTag(currentTag);
    if (['work_in_progress', 'break_in_progress'].includes(currentTag)) {
      startTimer();
    } else if (['work_start', 'break_start'].includes(currentTag)) {
      resetTimer();
    } else if (
      ['work_end', 'work_not_started', 'work_finished'].includes(currentTag)
    ) {
      stopTimer();
    } else {
      console.log('Unhandled tag:', currentTag);
      stopTimer();
    }
  };
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setSeconds(0);
    startTimer();
  };
  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => setSeconds(prev => prev + 1), 1000);
    console.log('after the interval ref');
  };

  const stopTimer = () => {
    console.log('stop Work');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setSeconds(0);
    setPreTag(null);
    dispatch(saveTag(null));
  };
  const formatTime = totalSeconds => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.loadingText}>{i18n.t('Timer.sync')}</Text>
      ) : workHistoryState.workHistoryLoading || realTimeLoading ? (
        <Text style={styles.timerLoadingText}>
          {i18n.t('HomeScreen.checkingTimeWithServer')}
        </Text>
      ) : (
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingBottom: Matrics.ms(50),
    // backgroundColor: 'red',
  },
  timerText: {
    fontSize: 48,
    fontFamily: typography.fontFamily.Montserrat.Bold,
    marginBottom: 20,
  },
  timerLoadingText: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs17,
    height: Matrics.vs(42),
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: Matrics.vs(20),
  },
  loadingText: {
    fontSize: typography.fontSizes.fs24,
    fontFamily: typography.fontFamily.Montserrat.Medium,
    marginBottom: Matrics.vs(20),
  },
  modeText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});
export default Timer;
