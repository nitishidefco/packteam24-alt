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
  loadTagFromLocalStorage,
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
  // const [tagMode, setTagMode] = useState(tagModeById);

  //loadTagFromLocalStorage
  useEffect(() => {
    dispatch(loadTagFromLocalStorage());
  }, [appState]);
  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      console.log('App State changed to:', nextAppState);
      await saveAppState(nextAppState);

      if (nextAppState === 'active') {
        setInitialTimer();
      } else if (nextAppState === 'background' && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setAppState(nextAppState);
      setTagMode(null);
      setSeconds(0);
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

  const loadAppState = async () => {
    try {
      return await AsyncStorage.getItem('appState');
    } catch (error) {
      console.error('Error loading app state:', error);
      return null;
    }
  };

  const getTimeDifferenceInSeconds = (time1, time2) => {
    return Math.abs(
      moment(time1, 'HH:mm').unix() - moment(time2, 'HH:mm').unix(),
    );
  };

  const setInitialTimer = async () => {
    console.log(
      'Initializing timer...',
      tagMode,
      'Tag in local storage',
      tagInLocalStorage,
    );
    if (isConnected && workHistoryState?.data?.length > 0) {
      const lastEntry =
        workHistoryState.data[workHistoryState.data.length - 1].from;
      console.log('Lat entrey in workHistory state', lastEntry);

      const lastMode =
        workHistoryState?.data?.[workHistoryState?.data?.length - 1].mode_raw;
      console.log('Last mode in work history state', lastMode);

      const elapsedTime = getTimeDifferenceInSeconds(
        getCurrentTime(),
        lastEntry,
      );
      console.log('isConnected elapsed time', elapsedTime);

      if (intervalRef.current) {
        console.log('Clearing interval');

        clearInterval(intervalRef.current);
      }
      setSeconds(elapsedTime);

      // Set the timer when the app becomes active to current work status from server
      // controlTimer(tagMode || currentStatus?.currentState?.work_status);
      console.log('app state', appState);

      if (appState === 'active') {
        console.log('Controlling timer from app state active');
        if (lastMode === 'work' && tagMode === 'break_start') {
          console.log('Switching from Work to Break.');
          controlTimer(tagMode || currentStatus?.currentState?.work_status);
        } else if (lastMode === 'break' && tagMode === 'work_start') {
          console.log('Switching from Break to Work.');
          controlTimer(tagMode || currentStatus?.currentState?.work_status);
        } else if (
          tagMode === 'work_end' ||
          currentStatus?.currentState?.work_status === 'work_finished' ||
          currentStatus?.currentState?.work_status === 'work_not_started'
        ) {
          console.log('Work has ended or not started.');
          controlTimer(tagMode || currentStatus?.currentState?.work_status);
        } else {
          console.log(
            'Continuing current status:',
            currentStatus?.currentState?.work_status,
          );
          controlTimer(currentStatus?.currentState?.work_status);
        }
      } else {
        console.log('Controlling timer from else of app state active');

        controlTimer(tagMode || currentStatus?.currentState?.work_status);
      }
    } else if (!isConnected && localWorkHistory?.length > 0) {
      // dispatch(OffineStatus());
      console.log(
        'last entry unedited',
        localWorkHistory[localWorkHistory.length - 1].from,
      );

      const lastEntry = localWorkHistory[localWorkHistory.length - 1].from;
      console.log('Last entrey in localHistory state', lastEntry);

      const lastMode =
        localWorkHistory?.[localWorkHistory?.length - 1].mode_raw;
      console.log('Last mode in local history state', lastMode);

      const lastEntryTime =
        localWorkHistory[localWorkHistory.length - 1].from.length > 5
          ? moment(localWorkHistory[localWorkHistory.length - 1].from).unix()
          : moment(
              localWorkHistory[localWorkHistory.length - 1].from,
              'HH:mm',
            ).unix();
      console.log('lastnetry+++>', moment().unix() - lastEntryTime);

      console.log(moment().unix() - lastEntryTime);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setSeconds(moment().unix() - lastEntryTime || 0);
      console.log(
        'TagMode while offline',
        tagMode,
        'tag in local storage',
        tagInLocalStorage,
      );
      if (
        tagMode === 'break_start' &&
        tagInLocalStorage === 'break_in_progress'
      ) {
        controlTimer(tagInLocalStorage || tagMode);
      } else if (
        tagMode === 'work_start' &&
        tagInLocalStorage === 'break_in_progress'
      ) {
        controlTimer(tagMode);
      } else if (
        tagMode === 'break_start' &&
        tagInLocalStorage === 'work_in_progress'
      ) {
        controlTimer(tagMode);
      } else {
        controlTimer(tagInLocalStorage);
      }
    } else {
      console.log(
        'No work history available. controlling timer from last else',
      );
      console.log(
        'Else: taginlocalstorage',
        tagInLocalStorage,
        'tagMode:',
        tagMode,
        'currentStatus?.currentState?.work_status:--->',
        currentStatus?.currentState?.work_status,
      );
      console.log('Work history state', workHistoryState?.data);

      if (!isConnected) {
        controlTimer(tagInLocalStorage || tagMode);
      } else {
        controlTimer(
          tagMode ||
            currentStatus?.currentState?.work_status ||
            tagInLocalStorage,
        );
      }
    }
  };
  useEffect(() => {
    console.log('Dispatching tag to localStorage');
    dispatch(saveTagToLocalStorage(tagMode));
  }, [appState]);
  useEffect(() => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', deviceId);
    formData.append('lang', globalLanguage);

    if (isConnected) {
      // getWorkHistoryCall(formData);
      fetchWorkStatusCall(formData);
    }
    const timer = setTimeout(setInitialTimer, 2000);

    return () => clearTimeout(timer);
  }, [
    appState,
    currentStatus?.currentState?.work_status,
    workHistoryState?.data,
  ]);
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
      console.log('Start timer function called');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      startTimer();
    } else if (['work_start', 'break_start'].includes(currentTag)) {
      console.log('reset timer function called');

      resetTimer();
    } else if (
      ['work_end', 'work_not_started', 'work_finished'].includes(currentTag)
    ) {
      console.log('Stop timer function called function control timer');
      stopTimer();
    } else {
      console.log('Unhandled tag:', currentTag);
      stopTimer();
    }
  };
  const resetTimer = () => {
    console.log('Inside reset timer');

    setSeconds(0);
    console.log('Reseted the seconds');

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    console.log('Start timer from the reset timer');
    startTimer();
  };
  const startTimer = () => {
    console.log('start_timers');

    intervalRef.current = setInterval(() => setSeconds(prev => prev + 1), 1000);
    console.log('after the interval ref');
  };

  const stopTimer = () => {
    console.log('stop Work');
    console.log('Settings Seconds zero inside stop timer');
    setSeconds(0);
    setPreTag(null);
    dispatch(saveTag(null));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
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
