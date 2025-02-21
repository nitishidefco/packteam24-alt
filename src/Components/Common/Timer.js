//Working offline scan code

import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useWorkHistoryActions} from '../../Redux/Hooks/useWorkHistoryActions';
import {useWorkStatusActions} from '../../Redux/Hooks/useWorkStatusActions';
import {useDispatch, useSelector} from 'react-redux';
import {getCurrentTime} from '../../Helpers/GetCurrentTime';
import {findModeByTagId} from '../../Helpers/FindModeByTagId';
import moment from 'moment';
import {Matrics, typography} from '../../Config/AppStyling';
import {OffineStatus} from '../../Redux/Reducers/WorkStateSlice';
import {
  saveTag,
  saveTagToLocalStorage,
} from '../../Redux/Reducers/SaveDataOfflineSlice';
import i18n from '../../i18n/i18n';
import reactotron from '../../../ReactotronConfig';
import {useScanTagActions} from '../../Redux/Hooks/useScanTagActions';

const Timer = ({tag, tagsFromLocalStorage, sessionId}) => {
  const dispatch = useDispatch();
  const {state: currentStatus, fetchWorkStatusCall} = useWorkStatusActions();
  const {state: scanTagState} = useScanTagActions();
  const [appState, setAppState] = useState(AppState.currentState);
  const [randomState, setRandomState] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  const {workHistoryState, getWorkHistoryCall} = useWorkHistoryActions();
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
        // setInitialTimer();
      } else if (nextAppState === 'background' && intervalRef.current) {
        reactotron.log('Clearing timer interval ref');
        // clearInterval(intervalRef.current);
        // intervalRef.current = null;
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
    reactotron.log(
      'app state',
      appState,
      'localworkhistory',
      localWorkHistory,
      'internet status',
      isConnected,
      'workHistoryLoading',
      workHistoryState.workHistoryLoading,
      'Work History:',
      workHistoryState?.data,
    );
    if (appState !== 'active') return;

    // console.log('localWorkHistory===>', localWorkHistory);
    setInitialTimer();
  }, [
    appState,
    // tagMode,
    // tagInLocalStorage,
    // JSON.stringify(workHistoryState?.data),
    workHistoryState.workHistoryLoading,
    // JSON.stringify(localWorkHistory),
    localWorkHistory?.length,
    localWorkHistory?.[localWorkHistory?.length - 1]?.to,
    isConnected,
    randomState,
  ]);
  const setInitialTimer = async () => {
    // console.log(
    //   'Initializing timer...',
    //   tagMode,
    //   tagInLocalStorage,
    //   workHistoryState.data[workHistoryState.data.length - 1],
    // );
    if (
      isConnected &&
      workHistoryState?.data?.length > 0 &&
      !workHistoryState.workHistoryLoading
    ) {
      const lastEntry =
        workHistoryState.data[workHistoryState.data.length - 1].from;
      const lastEntryMoment = moment(lastEntry, 'HH:mm:ss');
      const now = moment();
      const elapsedTime = Math.abs(now.diff(lastEntryMoment, 'seconds'));
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      reactotron.log('last Entry... online mode', lastEntry);
      if (
        nowTranslation.includes(
          workHistoryState?.data[workHistoryState?.data?.length - 1]?.to,
        )
      ) {
        reactotron.log(
          'Inside if nowTranslation',
          currentStatus?.currentState?.work_status,
          workHistoryState?.data,
          tagMode,
        );
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
        reactotron.log('Stopping timer from online mode');
        stopTimer();
      }
    } else if (!isConnected && localWorkHistory?.length > 0) {
      // dispatch(OffineStatus());
      reactotron.log(
        'Ofine Last===>',
        localWorkHistory[localWorkHistory.length - 1],
      );

      const lastEntryTime = moment(
        localWorkHistory[localWorkHistory.length - 1].from,
        'HH:mm:ss',
      );

      const now = moment();
      const elapsedTime = Math.abs(now.diff(lastEntryTime, 'seconds'));
      reactotron.log('elapsedTime+++>', elapsedTime);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (
        nowTranslation.includes(
          localWorkHistory[localWorkHistory.length - 1].to,
        )
      ) {
        setSeconds(elapsedTime);
        reactotron.log(
          'Controlling timer from offlinemode',
          tagInLocalStorage,
          tagMode,
          localWorkHistory[localWorkHistory.length - 1],
        );
        controlTimer(
          tagInLocalStorage ||
            tagMode ||
            localWorkHistory[localWorkHistory.length - 1].mode_raw === 'work'
            ? 'work_in_progress'
            : 'break_in_progress',
        );
      } else {
        reactotron.log('Stopping timer from not connected');
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
        reactotron.log('Tag mode', tagMode);
        controlTimer(tagMode);
      } else {
        reactotron.log('Stopping timer from last else');
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
      reactotron.log('Called get work history from timer', appState);
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
      reactotron.log('Stopping timer from no current tag');
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
    reactotron.log('Inside stop work');
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
      ) : workHistoryState.workHistoryLoading ? (
        <Text style={styles.timerLoadingText}>Checking time with server</Text>
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
