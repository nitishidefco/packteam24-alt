import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import {useWorkHistoryActions} from '../../Redux/Hooks/useWorkHistoryActions';
import {typography} from '../../Config/AppStyling';

const TimeLog = () => {
  const {workHistoryState} = useWorkHistoryActions();
  console.log(workHistoryState);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Time Log</Text>
      <ScrollView style={styles.tableContainer}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.row}>
            <Text style={styles.headerCell}>From</Text>
            <Text style={styles.headerCell}>Mode</Text>
            <Text style={styles.headerCell}>To</Text>
          </View>

          {/* Table Data */}
          {workHistoryState.data.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{item.from}</Text>
              <Text style={styles.cell}>{item.mode}</Text>
              <Text style={styles.cell}>{item.to}</Text>
            </View>
          ))}
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
