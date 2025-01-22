import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from './Button';
import {findModeByTagId} from '../../Helpers/FindModeByTagId';
import {addColons} from '../../Helpers/AddColonsToId';
import useSavedLanguage from '../Hooks/useSavedLanguage';
import {useWorkHistoryActions} from '../../Redux/Hooks/useWorkHistoryActions';
import {getCurrentTime} from '../../Helpers/GetCurrentTime';
import {useWorkStatusActions} from '../../Redux/Hooks/useWorkStatusActions';
import {Matrics} from '../../Config/AppStyling';

const Timer = ({tag, tagsFromLocalStorage, sessionId}) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [tagMode, setTagMode] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const {workHistoryState, getWorkHistoryCall} = useWorkHistoryActions();
  const lang = useSavedLanguage();
  const currentTime = getCurrentTime();
  const {state} = useWorkStatusActions();

  useEffect(() => {
    if (state?.currentState?.work_status === 'work_in_progress') {
      setSeconds(0);
    }
  }, []);
  // const controlTimer = () => {
  //   const formattedId = addColons(tag?.id);
  //   const mode = findModeByTagId(tagsFromLocalStorage, formattedId);
  //   console.log('Tag Mode',mode);
  // };
  // controlTimer();

  const timeToSeconds = time => {
    const hour = time.slice(0, 2);
    const hourToSeconds = hour * 60 * 60;
    const min = time.slice(3, 5);
    const minToSeconds = min * 60;
    const totalTimeinSeconds = hourToSeconds + minToSeconds;
    return totalTimeinSeconds;
  };
  const fetchInitialTimerState = () => {
    try {
      // Check if we have work history data
      if (
        !workHistoryState ||
        !workHistoryState.data ||
        workHistoryState.data.length === 0
      ) {
        // No work started today
        setSeconds(0);
        setIsActive(false);
        return;
      }

      const lastEntry = workHistoryState.data[workHistoryState.data.length - 1];
      const mode = lastEntry.mode || lastEntry.work_mode; // handle different possible property names

      if (mode === 'work_finished' || mode === 'work_not_started') {
        setSeconds(0);
        setIsActive(false);
        return;
      }

      // Calculate elapsed time
      const startTime = lastEntry.from;
      const startTimeinSeconds = timeToSeconds(startTime);
      const nowInSeconds = timeToSeconds(currentTime);
      const passed = nowInSeconds - startTimeinSeconds;
      setSeconds(passed);
      setIsActive(true);
      setLastSyncTime(startTime);
    } catch (error) {
      console.error('Error processing work history state:', error);
      // Reset timer on error
      setSeconds(0);
      setIsActive(false);
    }
  };

  // Effect to handle workHistoryState updates
  useEffect(() => {
    if (workHistoryState) {
      fetchInitialTimerState();
    }
  }, [workHistoryState, tag]);

  // Initial data fetch
  useEffect(() => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', '13213211');
    formData.append('lang', lang);
    console.log('fetching work history');

    getWorkHistoryCall(formData);
  }, []);

  // Periodic sync with API (every minute)
  useEffect(() => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', '13213211');
    formData.append('lang', lang);

    const syncInterval = setInterval(() => {
      getWorkHistoryCall(formData);
    }, 60000); // Check every minute

    return () => clearInterval(syncInterval);
  }, [sessionId, lang]);

  // Format time with leading zeros
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
