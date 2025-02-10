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
import {typography} from '../../Config/AppStyling';
import {OffineStatus} from '../../Redux/Reducers/WorkStateSlice';
import {
  saveTag,
  saveTagToLocalStorage,
} from '../../Redux/Reducers/SaveDataOfflineSlice';

const Timer = ({tag, tagsFromLocalStorage, sessionId}) => {
  const dispatch = useDispatch();
  const {state: currentStatus, fetchWorkStatusCall} = useWorkStatusActions();
  const [appState, setAppState] = useState(AppState.currentState);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  const {workHistoryState, getWorkHistoryCall} = useWorkHistoryActions();
  const {deviceId} = useSelector(state => state?.Network);
  const {globalLanguage} = useSelector(state => state?.GlobalLanguage);
  const {localWorkHistory} = useSelector(state => state?.LocalWorkHistory);
  const {isConnected} = useSelector(state => state?.Network);
  const tagMode = findModeByTagId(tagsFromLocalStorage, tag?.id);
  const {tagInLocalStorage} = useSelector(state => state.OfflineData);

  const nowTranslation = ['Jetzt', 'Now', 'now', 'Сейчас', 'Зараз', 'Teraz'];
  // const [tagMode, setTagMode] = useState(tagModeById);
  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      // console.log('App State changed to:', nextAppState);
      await saveAppState(nextAppState);

      if (nextAppState === 'active') {
        setInitialTimer();
      } else if (nextAppState === 'background' && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
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
    // console.log('localWorkHistory===>', localWorkHistory);
    setInitialTimer();
  }, [
    appState,
    tagMode,
    tagInLocalStorage,
    JSON.stringify(workHistoryState?.data),
    JSON.stringify(localWorkHistory),
  ]);
  const setInitialTimer = async () => {
    // console.log(
    //   'Initializing timer...',
    //   tagMode,
    //   tagInLocalStorage,
    //   workHistoryState.data[workHistoryState.data.length - 1],
    // );
    if (isConnected && workHistoryState?.data?.length > 0) {
      const lastEntry =
        workHistoryState.data[workHistoryState.data.length - 1].from;
      const lastEntryMoment = moment(lastEntry, 'HH:mm:ss');
      const now = moment();
      const elapsedTime = Math.abs(now.diff(lastEntryMoment, 'seconds'));
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      console.log('last Entry...', lastEntry);
      if (
        nowTranslation.includes(
          workHistoryState.data[workHistoryState.data.length - 1].to,
        )
      ) {
        setSeconds(elapsedTime);
        controlTimer(currentStatus?.currentState?.work_status || tagMode);
      } else {
        stopTimer();
      }
    } else if (!isConnected && localWorkHistory?.length > 0) {
      // dispatch(OffineStatus());
      console.log(
        'Ofine Last===>',
        localWorkHistory[localWorkHistory.length - 1],
      );

      const lastEntryTime = moment(
        localWorkHistory[localWorkHistory.length - 1].from,
        'HH:mm:ss',
      );
      console.log(
        'lastnetry+++>',
        lastEntryTime,
        lastEntryTime.format('HH:mm:ss'),
      );

      const now = moment();
      const elapsedTime = Math.abs(now.diff(lastEntryTime, 'seconds'));
      console.log('elapsedTime+++>', elapsedTime);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (
        nowTranslation.includes(
          localWorkHistory[localWorkHistory.length - 1].to,
        )
      ) {
        setSeconds(elapsedTime);
        controlTimer(tagInLocalStorage || tagMode);
      } else {
        stopTimer();
      }
    } else {
      console.log('No work history available.');
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
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', deviceId);
    formData.append('lang', globalLanguage);
    if (isConnected) {
      getWorkHistoryCall(formData);
      fetchWorkStatusCall(formData);
    }
  }, [appState]);

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
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>
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
  modeText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});
export default Timer;
