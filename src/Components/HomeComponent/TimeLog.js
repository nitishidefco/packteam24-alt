import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useWorkHistoryActions} from '../../Redux/Hooks/useWorkHistoryActions';
import {Matrics, typography} from '../../Config/AppStyling';
import {addColons} from '../../Helpers/AddColonsToId';
import i18n from '../../i18n/i18n';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {findModeByTagId} from '../../Helpers/FindModeByTagId';
import moment from 'moment';
import {setLocalWorkHistoryInStorage} from '../../Redux/Reducers/LocalWorkHistorySlice';

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

  useEffect(() => {
    try {
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('device_id', deviceId);
      formData.append('lang', globalLanguage);
      if (isConnected) {
        getWorkHistoryCall(formData);
      }
    } catch (error) {
      console.error('Error fetching the work history', error);
    }
  }, [formattedId]);
  /* ---------------------- Updates the localWorkHistory ---------------------- */
  const updateLocalHistoryFromServer = async () => {
    try {
      console.log('Updating the local work hisotry');

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
    const currentTime = moment().format('HH:mm');
    const modeMapping = {
      work_start: 'work',
      work_end: 'work_end',
      break_start: 'break',
    };
    const getComparableMode = mode => modeMapping[mode];
    const updatedHistory = [...localWorkHistory];

    try {
      if (updatedHistory.length > 0) {
        const lastItem = updatedHistory[updatedHistory.length - 1];
        if (lastItem.mode_raw !== getComparableMode(newMode)) {
          updatedHistory[updatedHistory.length - 1] = {
            ...lastItem,
            to: currentTime,
          };
        }
      }
    } catch (error) {
      console.log('error', error);
    }
    try {
      if (updatedHistory.length > 0) {
        const lastItem = updatedHistory[updatedHistory.length - 1];
        if (lastItem.mode_raw === getComparableMode(newMode)) {
          console.log('Preventing duplicate time entry');
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }

    try {
      if (newMode === 'work_end') {
        const lastItem = updatedHistory[updatedHistory.length - 1];
        updatedHistory[updatedHistory.length - 1] = {
          ...lastItem,
          to: currentTime,
        };
      } else {
        updatedHistory.push({
          from: currentTime,
          mode: i18n.t(`TagModes.${newMode}`),
          mode_raw: getComparableMode(newMode),
          to: 'now',
        });
      }
    } catch (error) {
      error(error);
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
                    <Text style={styles.cell}>{item.to}</Text>
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
                  <Text style={styles.cell}>
                    {moment(item?.from).isValid()
                      ? moment(item?.from).format('HH:mm')
                      : item?.from}
                  </Text>
                  <Text style={styles.cell}>{item.mode}</Text>
                  <Text style={styles.cell}>
                    {moment(item?.to).isValid()
                      ? moment(item?.to).format('HH:mm')
                      : item?.to}
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
