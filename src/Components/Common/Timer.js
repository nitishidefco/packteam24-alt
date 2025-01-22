import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, AppState} from 'react-native';
import {useWorkHistoryActions} from '../../Redux/Hooks/useWorkHistoryActions';
import {getCurrentTime} from '../../Helpers/GetCurrentTime';
import {Matrics} from '../../Config/AppStyling';
import {findModeByTagId} from '../../Helpers/FindModeByTagId';
import {addColons} from '../../Helpers/AddColonsToId';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSavedLanguage from '../Hooks/useSavedLanguage';
const Timer = ({tag, tagsFromLocalStorage, sessionId}) => {
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
    console.log('saving timer state');
    console.log(isActive);

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
  console.log(currentTag, 'Current tag from server');

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
    loadTimerState();
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Matrics.ms(50),
  },
  timerText: {
    fontSize: 48,
    fontFamily: 'monospace',
    marginBottom: 20,
  },
  modeText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

export default Timer;

// ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDVp6dSvMu5LRLeL5vyFnuS2HR74jbS6QgDfN2c7de0TPqICDlZwsYkJzsqqdrUXHv6mXXAD+Pmf1Z+ZXThyKrw5k/qGdHCG0oCU9pokmup1ys7qb7fEC8AkzktwYgZssytPsoWWvH/pN6gswqHc29ITZ+jFU6x6IYUkKKrUhrgBGB529m0fid06X5lSzAtqT7eBE6qzgvcFhYZQD/F0YUJUWibvk7UjktXjVPFfJXilPxyBkP4NFmL5JwBACqWciAPn65OaXSws9riQLX/A8eKDgez9fCUgitOVn1LcWS7qz1mGmpX7vu8ZMOmtYVHi/pFGxnSayReDe7oF1S+DZvonuC1vrXexxmVZtnSBrRTsgKO7fQwRbD9KTRWFnjJzgfYa4GSk16ThPNQ0RhK+Ah+KkH8PMU4d4tYZGR1PqNMfa5WzOofSdaUK8wkuTKkbsSR1W9DcexdKSNr0Qa5n1uFTnhOLKUIzyClzI1Ga2MUFWLkmRApYOnRfOkL21JTxg+TtZF2bMnpudkbwlaBACL/vyd/4Va7foDa0QoYmeqyZxxkNjPNCdxahiq7KH6hcFnu243BWQZm3s0w3E7OVS+mP4/pVfAh15F12Jb9CaRfEo3KKUcvlupUmsT2fAdxXr6qeSdFH2pDmVLNKO7DbE/hqhbKV25nNizKYe3Ju3RSrw== nitishidefcoinfotech@gmail.com