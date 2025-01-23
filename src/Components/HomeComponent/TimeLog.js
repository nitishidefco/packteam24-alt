import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useWorkHistoryActions} from '../../Redux/Hooks/useWorkHistoryActions';
import {Matrics, typography} from '../../Config/AppStyling';
import useSavedLanguage from '../Hooks/useSavedLanguage';
import {addColons} from '../../Helpers/AddColonsToId';
import i18n from '../../i18n/i18n';

const TimeLog = ({sessionId, tag}) => {
  const {workHistoryState, getWorkHistoryCall} = useWorkHistoryActions();
  const lanuguage = useSavedLanguage();
  const formattedId = addColons(tag?.id);
  useEffect(() => {
    try {
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('device_id', '13213211');
      formData.append('lang', lanuguage);
      getWorkHistoryCall(formData);
    } catch (error) {
      console.error('Error fetching the work history', error);
    }
  }, [formattedId]);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t('TimeLog.title')}</Text>
      <ScrollView style={styles.tableContainer}>
        <View style={styles.table}>
          {/* Table Data */}

          {workHistoryState?.data?.length > 0 ? (
            <>
              {/* Table Header */}
              <View style={styles.row}>
                <Text style={styles.headerCell}>{i18n.t('TimeLog.From')}</Text>
                <Text style={styles.headerCell}>{i18n.t('TimeLog.mode')}</Text>
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
