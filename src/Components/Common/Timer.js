import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, AppState} from 'react-native';
import {useWorkHistoryActions} from '../../Redux/Hooks/useWorkHistoryActions';
import {getCurrentTime} from '../../Helpers/GetCurrentTime';
import {Matrics, typography} from '../../Config/AppStyling';
import {findModeByTagId} from '../../Helpers/FindModeByTagId';
import {addColons} from '../../Helpers/AddColonsToId';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSavedLanguage from '../Hooks/useSavedLanguage';
import {useWorkStatusActions} from '../../Redux/Hooks/useWorkStatusActions';
import {useSelector} from 'react-redux';
const Timer = ({tag, tagsFromLocalStorage, sessionId}) => {
  const {state: currentStatus, fetchWorkStatusCall} = useWorkStatusActions();
  const [appState, setAppState] = useState(AppState.currentState);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);
  const {workHistoryState, getWorkHistoryCall} = useWorkHistoryActions();
  const currentTime = getCurrentTime();
  const [anotherDevice, setAnotherDevice] = useState(false);
  const language = useSavedLanguage();
  const formattedTagId = addColons(tag?.id);
  const [loading, setLoading] = useState(true);
  const {deviceId} = useSelector(state => state?.Network);
  const {globalLanguage} = useSelector(state => state?.GlobalLanguage)
  const tagMode = findModeByTagId(tagsFromLocalStorage, tag?.id);
  useEffect(() => {
    if (workHistoryState && workHistoryState.data) {
      setLoading(false);
    }
  }, [workHistoryState?.data]);
  const timeToSeconds = time => {
    const [hours, minutes] = time?.split(':')?.map(Number); // Split the time into hours and minutes
    return hours * 3600 + minutes * 60; // Convert to seconds
  };

  const getTimeDifferenceInSeconds = (time1, time2) => {
    const time1InSeconds = timeToSeconds(time1);
    const time2InSeconds = timeToSeconds(time2);
    return Math.abs(time2InSeconds - time1InSeconds);
  };

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      console.log('App State changed to:', nextAppState);
      setAppState(nextAppState); // Update the state with the new app state
    };

    // Add event listener for app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Cleanup the listener on component unmount
    return () => {
      subscription.remove();
    };
  }, []);

  const setInitialTimer = () => {
    if (workHistoryState?.data?.length > 0) {
      const lastEntry =
        workHistoryState?.data?.[workHistoryState?.data?.length - 1].from;

      const currentTime = getCurrentTime();
      const elapsedTime = getTimeDifferenceInSeconds(currentTime, lastEntry);
      if (
        currentStatus?.currentState?.work_status === 'work_finished' ||
        currentStatus?.currentState?.work_status === 'work_not_started'
      ) {
        setSeconds(0);
        controlTimer(null, currentStatus?.currentState?.work_status);
        return;
      } else {
        setSeconds(elapsedTime);
        controlTimer(tagMode, currentStatus?.currentState?.work_status);
      }
    } else {
      console.log('Nothing in history');
    }
  };

  useEffect(() => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', deviceId);
    formData.append('lang', globalLanguage);
    const timer = setTimeout(() => {
      getWorkHistoryCall(formData);
      setInitialTimer();
    }, 2000); // Wait for 2 seconds (2000ms)

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timer);
  }, []);

  const saveTimerState = async () => {
    try {
      const timerState = {
        seconds,
        isActive,
        lastSavedTime: Date.now(),
      };
      console.log('Saving timer state', timerState);

      if (timerState.seconds === 0) return;
      await AsyncStorage.setItem('timerState', JSON.stringify(timerState));
    } catch (error) {
      console.error('Error saving timer state:', error);
    }
  };

  // Handle the timer behavior based on tag
  const controlTimer = (currentTag, workStatus) => {
    console.log('Outer current tag:', currentTag);

    const actions = {
      work_start: () => {
        console.log('Executing action for: work_start');
        resetTimer();
        startTimer();
        setIsActive(true);
      },
      work_in_progress: () => {
        console.log('Executing action for: work_in_progress');
        startTimer();
        setIsActive(true);
      },
      break_start: () => {
        console.log('Executing action for: break_start');
        resetTimer();
        setIsActive(true);
      },
      break_in_progress: () => {
        console.log('Executing action for: break_in_progress');
        startTimer();
        setIsActive(true);
      },
      work_end: () => {
        console.log('Executing action for: work_end');
        stopTimer();
        setIsActive(false);
      },
      work_not_started: () => {
        console.log('Executing action for: work_not_started');
        stopTimer();
        setIsActive(false);
      },
      work_finished: () => {
        console.log('Executing action for: work_finished');
        stopTimer();
        setIsActive(false);
      },
    };

    // Default action for undefined or unhandled cases
    const defaultAction = () =>
      console.log('No matching action found for:', currentTag ?? workStatus);

    // Use currentTag if it exists; otherwise, fall back to workStatus
    const actionKey = currentTag ?? workStatus; // Nullish coalescing
    console.log('Determined actionKey:', actionKey); // Log the resolved key
    (actions[actionKey] || defaultAction)();
  };

  const startTimer = () => {
    console.log('before intervaRef', intervalRef.current);

    if (intervalRef.current) return; // Prevent multiple intervals
    console.log('after intervaRef strating timer', intervalRef.current);

    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current); // Stop the timer
    intervalRef.current = null; // Reset the interval reference
    setSeconds(0); // Reset the timer
    startTimer(); // Start the timer again
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current); // Stop the timer
    intervalRef.current = null; // Reset the interval reference
    setSeconds(0); // Reset the timer
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);
  // Effect to handle tag changes
  useEffect(() => {
    if (tag || currentStatus?.currentState?.work_status) {
      controlTimer(tagMode, currentStatus?.currentState?.work_status);
    }
  }, [tagMode, currentStatus?.currentState?.work_status]);

  // Initial timer state fetch
  useEffect(() => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', deviceId);
    formData.append('lang', globalLanguage);
    getWorkHistoryCall(formData);
  }, [formattedTagId]);

  // Cleanup the interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Format the time for display
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
