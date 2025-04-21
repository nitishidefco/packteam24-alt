import {View, Text, StyleSheet, AppState} from 'react-native';
import React, {useEffect, useState} from 'react';
import {reduxStorage} from '../../Redux/Storage';
import {Matrics, typography} from '../../Config/AppStyling';
import dayjs from 'dayjs';
import ElapsedTime from '../../../spec/NativeElapsedTime';
import {setCurrentTime} from '../../Redux/Reducers/TimeSlice';
import {useDispatch, useSelector} from 'react-redux';
import i18n from '../../i18n/i18n';
import reactotron from '../../../ReactotronConfig';

const RealTime = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const dispatch = useDispatch();
  const currentTime = useSelector(state => state.TrueTime.currentTime);
  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      if (nextAppState === 'active') {
      } else if (nextAppState === 'background' && intervalRef.current) {
        setRandomState(!randomState);
      }

      setAppState(nextAppState);  
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);
  const initializeClock = async () => {
    try {
      const storedTime = await reduxStorage.getItem('trueTime');
      const storedDate = await reduxStorage.getItem('trueDate');
      const realTimeDiffAtLogin = await reduxStorage.getItem(
        'realTimeDiffAtLogin',
      );
      if (!storedTime || !storedDate) {
        console.error('Stored time or date not found');
        return null;
      }

      const baseDate = dayjs(
        `${storedDate} ${storedTime}`,
        'YYYY-MM-DD HH:mm:ss',
      );
      const initialRealTimeDiff = parseInt(realTimeDiffAtLogin, 10);
      if (!baseDate.isValid()) {
        console.error('Invalid stored date or time');
        return null;
      }

      return {baseDate, initialRealTimeDiff};
    } catch (error) {
      console.error('Error initializing clock:', error);
      return null;
    }
  };

  const updateTime = async ({baseDate, initialRealTimeDiff}) => {
    try {
      const elapsedTimeMs = await ElapsedTime.getElapsedTime();
      const elapsedSinceLoginMs = elapsedTimeMs - initialRealTimeDiff;

      const updatedDate = baseDate.add(
        elapsedSinceLoginMs,
        Platform.OS === 'ios' ? 'second' : 'millisecond',
      );
      const formattedDate = updatedDate.format('YYYY-MM-DD');
      const formattedTime = updatedDate.format('HH:mm:ss');
      dispatch(
        setCurrentTime({
          date: formattedDate,
          time: formattedTime,
        }),
      );
    } catch (error) {
      console.error('Error updating time:', error);
    }
  };

  useEffect(() => {
    let intervalId = null;

    const startClock = async () => {
      const baseDate = await initializeClock();
      if (!baseDate) {
        return;
      }

      await updateTime(baseDate);
      intervalId = setInterval(() => updateTime(baseDate), 1000);
    };

    startClock();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log('Interval cleared');
      }
    };
  }, [appState]);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headingStyle}>
        {i18n.t('HomeScreen.timeZoneMatches')}
      </Text>
      <View style={styles.secondaryContainer}>
        <Text style={styles.dateTimeStyles}>
          {currentTime ? currentTime.date : i18n.t('HomeScreen.loading')}
        </Text>
        <Text style={styles.dateTimeStyles}>
          {currentTime ? currentTime.time : i18n.t('HomeScreen.loading')}
        </Text>
      </View>
    </View>
  );
};

export default RealTime;

const styles = StyleSheet.create({
  headingStyle: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs16,
    textAlign: 'center',
  },
  dateTimeStyles: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs16,
    textAlign: 'center',
  },
  mainContainer: {
    width: Matrics.screenWidth * 0.9,
    margin: 'auto',
  },
  secondaryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
});
