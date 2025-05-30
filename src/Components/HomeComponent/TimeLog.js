import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useWorkHistoryActions} from '../../Redux/Hooks/useWorkHistoryActions';
import {Matrics, typography} from '../../Config/AppStyling';
import {addColons} from '../../Helpers/AddColonsToId';
import i18n from '../../i18n/i18n';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {findModeByTagId} from '../../Helpers/FindModeByTagId';
import moment, {utc} from 'moment-timezone';
import {setLocalWorkHistoryInStorage} from '../../Redux/Reducers/LocalWorkHistorySlice';
import reactotron from '../../../ReactotronConfig';
import {useScanTagActions} from '../../Redux/Hooks/useScanTagActions';

const TimeLog = ({sessionId, tag, tagsFromLocalStorage}) => {
  const dispatch = useDispatch();
  const {workHistoryState, getWorkHistoryCall} = useWorkHistoryActions();
  const {deviceId} = useSelector(state => state?.Network);
  const {globalLanguage} = useSelector(state => state?.GlobalLanguage);
  const {localWorkHistory} = useSelector(state => state?.LocalWorkHistory);
  const tagMode = findModeByTagId(tagsFromLocalStorage, tag?.id);
  const formattedId = addColons(tag?.id);
  const isConnected = useSelector(state => state?.Network?.isConnected);
  const {tagInLocalStorage} = useSelector(state => state.OfflineData);
  const {bulkSessions} = useSelector(state => state?.OfflineData);
  const realTime = useSelector(state => state.TrueTime.currentTime);

  const {state: scanTagState} = useScanTagActions();

  // No need to call it for tag scanned
  useEffect(() => {
    try {
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('device_id', deviceId);
      formData.append('lang', globalLanguage);
      if (isConnected) {
        console.log('Calling for work history call');
        getWorkHistoryCall(formData);
      }
    } catch (error) {
      console.error('Error fetching the work history', error);
    }
  }, [scanTagState.currentState]);
  /* ---------------------- Updates the localWorkHistory ---------------------- */
  const updateLocalHistoryFromServer = async () => {
    try {
      dispatch(setLocalWorkHistoryInStorage(workHistoryState?.data));
    } catch (error) {
      console.log('Error saving local history with data from server', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {

      if (isConnected) {
        updateLocalHistoryFromServer();
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [workHistoryState?.data, isConnected]);

  /* -------------- handles offline data updation to local state -------------- */
  useEffect(() => {
    if (tagMode) {
      handleTagScan(tagMode);
    }
  }, [tagMode, isConnected]);

  const handleTagScan = async newMode => {
    console.log('Inside handle tag scan');

    console.log('Current time', realTime.time);
    const currentTime = realTime.time;

    if (newMode === 'work_end' && localWorkHistory.length === 0) {
      console.log('No work history to end');

      return;
    } else if (newMode === 'break_start' && localWorkHistory.length === 0) {
      console.log('No work history to start break');

      return;
    }
    const modeMapping = {
      work_start: 'work',
      work_end: 'work_end',
      break_start: 'break',
    };
    const getComparableMode = mode => modeMapping[mode];
    console.log('compareable mode', getComparableMode(newMode));

    const updatedHistory = [...localWorkHistory];
    const lastItem = updatedHistory[updatedHistory.length - 1];

    console.log('Updated History:', updatedHistory);
    console.log('Last Item:', lastItem);

    if (newMode === 'work_end') {
      console.log('Executing: newMode === work_end');
      updatedHistory[updatedHistory.length - 1] = {
        ...lastItem,
        to: currentTime,
      };
    } else if (updatedHistory.length === 0 && newMode === 'break_start') {
      console.log('Break before anything else');
      return;
    } else if (
      updatedHistory.length === 0 ||
      (updatedHistory.length > 0 && !lastItem?.to?.includes(':'))
    ) {
      console.log('Executing: New entry or continuing current mode');

      if (lastItem?.mode_raw !== getComparableMode(newMode)) {
        console.log('Executing: Mode change detected');
        if (lastItem) {
          console.log('Updating last item with end time');
          updatedHistory[updatedHistory.length - 1] = {
            ...lastItem,
            to: currentTime,
          };
        }
        updatedHistory.push({
          from: currentTime,
          mode: i18n.t(`TagModes.${newMode}`),
          mode_raw: getComparableMode(newMode),
          to: 'now',
        });
      } else if (lastItem.mode_raw === getComparableMode(newMode)) {
        return;
      }
    }
    // Update the local history state
    dispatch(setLocalWorkHistoryInStorage(updatedHistory));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t('TimeLog.title')}</Text>
      <ScrollView style={styles.tableContainer}>
        <View style={styles.table}>
          {/* Table Data */}

          {isConnected ? (
            workHistoryState?.data?.length > 0 ? (
              <>
                {/* Table Header */}
                <View style={styles.row}>
                  <Text style={styles.headerCell}>
                    {i18n.t('TimeLog.From')}
                  </Text>
                  <Text style={styles.headerCell}>
                    {i18n.t('TimeLog.mode')}
                  </Text>
                  <Text style={styles.headerCell}>{i18n.t('TimeLog.To')}</Text>
                </View>

                {/* Table Rows */}
                {workHistoryState?.data.map((item, index) => (
                  <View key={index} style={styles.row}>
                    <Text style={styles.cell}>{item.from}</Text>
                    <Text style={styles.cell}>{item.mode}</Text>
                    <Text style={styles.cell}>
                      {['Now', 'now']?.includes(item.to)
                        ? i18n.t('TimeLog.now')
                        : item.to}
                    </Text>
                  </View>
                ))}
              </>
            ) : (
              <View>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.Montserrat.Bold,
                    textAlign: 'center',
                  }}>
                  {i18n.t('TimeLog.nohistory')}
                </Text>
              </View>
            )
          ) : localWorkHistory?.length > 0 ? (
            <>
              {/* Table Header */}
              <View style={styles.row}>
                <Text style={styles.headerCell}>{i18n.t('TimeLog.From')}</Text>
                <Text style={styles.headerCell}>{i18n.t('TimeLog.mode')}</Text>
                <Text style={styles.headerCell}>{i18n.t('TimeLog.To')}</Text>
              </View>

              {/* Table Rows */}
              {localWorkHistory.map((item, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.cell}>{item?.from}</Text>
                  <Text style={styles.cell}>{item.mode}</Text>
                  <Text style={styles.cell}>
                    {['Now', 'now']?.includes(item.to)
                      ? i18n.t('TimeLog.now')
                      : item.to}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <View>
              <Text
                style={{
                  fontFamily: typography.fontFamily.Montserrat.Bold,
                  textAlign: 'center',
                }}>
                {i18n.t('TimeLog.nohistory')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 60,
    borderRadius: Matrics.ms(12),
  },
  header: {
    fontSize: 24,
    fontFamily: typography.fontFamily.Montserrat.Bold,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  tableContainer: {
    width: '100%',
    marginTop: 10,
  },
  table: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    fontFamily: typography.fontFamily.Montserrat.Regular,
  },
  headerCell: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#f1f1f1',
    paddingVertical: 12,
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
  },
});

export default TimeLog;
