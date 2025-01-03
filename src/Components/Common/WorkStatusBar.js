import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import {House, Coffee, Hammer} from 'lucide-react-native';
import {useScanTagActions} from '../../Redux/Hooks/useScanTagActions';
import {useSelector} from 'react-redux';

const WorkStatusBar = ({tagId}) => {
  const {state: states} = useScanTagActions();
  const onlineMode = states?.data?.data?.mode;
  const lastOnlineMode = useSelector(state => state?.WorkState?.lastOnlineMode);
  const [workMode, setWorkMode] = useState();
  const isConnected = useSelector(state => state?.Network?.isConnected);
  const validationResult = useSelector(
    state => state?.OfflineData?.validationResult,
  );

  // console.log('validatoin result', validationResult);
  // console.log('lastOnlineMode', lastOnlineMode);
  // console.log('onlinemode', onlineMode);
  

  useEffect(() => {
    if (isConnected) {
      if (onlineMode === 'work_start') {
        setWorkMode('Work Started');
      } else if (onlineMode === 'break_start') {
        setWorkMode('Break Started');
      } else if (onlineMode === 'work_end') {
        setWorkMode('Work Ended');
      }
    } else {
      if (validationResult?.valid) {
        switch (validationResult?.message) {
          case 'Work started':
            setWorkMode('Work Started');
            break;
          case 'Break ended, work resumed':
            setWorkMode('Work Started');
            break;
          case 'Break started':
            setWorkMode('Break Started');
            break;
          case 'Work ended':
            setWorkMode('Work Ended');
            break;
          default:
            setWorkMode('Not Started');
        }
      }
    }
  }, [isConnected, tagId, onlineMode, validationResult]);

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
