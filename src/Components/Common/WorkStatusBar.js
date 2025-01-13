import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import {House, Coffee, Hammer} from 'lucide-react-native';
import {useScanTagActions} from '../../Redux/Hooks/useScanTagActions';
import {useDispatch, useSelector} from 'react-redux';
import {reduxStorage} from '../../Redux/Storage';
import {useWorkStatusActions} from '../../Redux/Hooks/useWorkStatusActions';
const WorkStatusBar = ({validationResult}) => {
  const {state: currentStatus} = useWorkStatusActions();

  const workMode = currentStatus?.currentState?.work_status_to_display;
  console.log(workMode,'<<--Work Mode');
  
  const isConnected = useSelector(state => state?.Network?.isConnected);

  useEffect(() => {
    console.log('***********inside useEffect**************');

    const fetchNfcTags = async () => {
      try {
        const fetchedTags = await reduxStorage.getItem('nfcTags');
        const parsedTags = JSON.parse(fetchedTags);
        return parsedTags;
      } catch (error) {
        console.log('Error in useValidateTag', error);
      }
    };
  

    fetchNfcTags();
  }, []);


  const getStatusIcon = () => {
    switch (workMode) {
      case 'Work Started':
        return <Hammer size={30} color="#22c55e" />;
      case 'Break Started':
        return <Coffee size={30} color="#ef4444" />;
      case 'Work Ended':
        return <House size={30} color="#3b82f6" />;
      default:
        return <House size={30} color="#6b7280" />;
    }
  };

  // Memoizing background color to avoid unnecessary recalculations
  const borderColor = useMemo(() => {
    switch (workMode) {
      case 'Work Started':
        return '#22c55e'; // Green for work mode
      case 'Break Started':
        return '#ef4444'; // Red for break mode
      case 'Work Ended':
        return '#3b82f6'; // Blue for work ended
      default:
        return '#6b7280'; // Gray for default
    }
  }, [workMode]);

  return (
    <View style={[styles.container, {borderColor}]}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>{getStatusIcon()}</View>
        <Text style={styles.statusText}>{workMode || 'Not Started'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16, // Add margin for spacing
    borderWidth: 2, // Add border instead of background color
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50, // Rounded icon container
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
});

export default WorkStatusBar;
