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
const Timer = ({tag, tagsFromLocalStorage, sessionId}) => {
  const {state: currentStatus, fetchWorkStatusCall} = useWorkStatusActions();

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);
  const {workHistoryState, getWorkHistoryCall} = useWorkHistoryActions();
  const currentTime = getCurrentTime();
  const [anotherDevice, setAnotherDevice] = useState(false);
  const language = useSavedLanguage();
  const formattedTagId = addColons(tag?.id);
  const currentTag = findModeByTagId(tagsFromLocalStorage, formattedTagId);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (workHistoryState && workHistoryState.data) {
      console.log('Work history state', workHistoryState);
      setLoading(false);
    }
  }, [workHistoryState?.data]);
  const timeToSeconds = time => {
    const [hours, minutes] = time?.split(':')?.map(Number); // Split the time into hours and minutes
    return hours * 3600 + minutes * 60; // Convert to seconds
  };

  const getTimeDifferenceInSeconds = (time1, time2) => {
    console.log(typeof time1, typeof time2);

    const time1InSeconds = timeToSeconds(time1);
    const time2InSeconds = timeToSeconds(time2);

    // Calculate the difference
    return Math.abs(time2InSeconds - time1InSeconds);
  };
  const lastEntry =
    workHistoryState?.data?.[workHistoryState?.data?.length - 1];
  const saveTimerState = async () => {
    try {
      const timerState = {
        seconds,
        isActive,
        lastSavedTime: Date.now(),
      };
      if (timerState.seconds === 0) return;
      await AsyncStorage.setItem('timerState', JSON.stringify(timerState));
    } catch (error) {
      console.error('Error saving timer state:', error);
    }
  };

  // Load timer state
  const loadTimerState = async () => {
    try {
      const storedState = await AsyncStorage.getItem('timerState');
      console.log(storedState);

      if (storedState) {
        console.log();
        console.log('*****************************************');
        console.log();
        const {
          seconds: storedSeconds,
          isActive: storedActive,
          lastSavedTime,
        } = JSON.parse(storedState);
        const elapsed = Math.floor((Date.now() - lastSavedTime) / 1000);
        console.log(elapsed);

        setSeconds(storedActive ? storedSeconds + elapsed : storedSeconds);
        setIsActive(storedActive);
        console.log(storedActive, 'stored active');
        setAnotherDevice(false);
        if (storedActive) {
          console.log('inside stored active');

          startTimer(); // Resume timer if it was active
        }
      } else {
        console.log('No data in local storage');
        try {
          const elapsed = getTimeDifferenceInSeconds(
            workHistoryState?.data?.[
              workHistoryState?.data?.length - 1
            ]?.from?.toString(),
            currentTime.toString(),
          );
          console.log(elapsed);
          setSeconds(elapsed);
          startTimer();
          setAnotherDevice(true);
        } catch (error) {
          console.log('more sepcidfa error', error);
        }
      }
    } catch (error) {
      console.error('Error loading timer state:', error);
    }
  };
  // Handle the timer behavior based on tag
  const controlTimer = currentTag => {
    if (currentTag === 'work_start') {
      resetTimer();
      startTimer();
      setIsActive(true);
    } else if (currentTag === 'break_start') {
      resetTimer();
      setIsActive(true);
    } else if (currentTag === 'work_end') {
      stopTimer();
      setIsActive(false);
    }
  };

  const startTimer = () => {
    if (!anotherDevice) {
      if (intervalRef.current) return; // Prevent multiple intervals
    }
    console.log('inside start timer');

    intervalRef.current = setInterval(() => {
      console.log('inside set inside');

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

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      console.log('nextAppState', nextAppState);
      setIsActive(true);

      if (nextAppState === 'background' || nextAppState === 'inactive') {
        saveTimerState();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove(); // Cleanup listener
    };
  }, [seconds, isActive]);

  // Load timer state on component mount
  useEffect(() => {
    console.log(
      currentStatus?.currentState?.work_status === 'work_not_started',
    );
    if (
      currentStatus?.currentState?.work_status === 'work_not_started' ||
      ' work_end'
    ) {
      stopTimer();
      return;
    }
    if (workHistoryState?.data.length > 0) {
      loadTimerState();
    }
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);
  // Effect to handle tag changes
  useEffect(() => {
    if (tag) {
      controlTimer(currentTag);
    }
  }, [currentTag]);

  // Initial timer state fetch
  useEffect(() => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', '13213211');
    formData.append('lang', language);
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

  return loading ? (
    <View>
      <Text>Loading</Text>
    </View>
  ) : (
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
    paddingBottom: Matrics.ms(50),
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
