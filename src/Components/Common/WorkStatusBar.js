import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import {House, Coffee, Hammer} from 'lucide-react-native';
import {reduxStorage} from '../../Redux/Storage';
import {useWorkStatusActions} from '../../Redux/Hooks/useWorkStatusActions';
import {useSelector} from 'react-redux';
import {useScanTagActions} from '../../Redux/Hooks/useScanTagActions';
import {useHomeActions} from '../../Redux/Hooks';
import useSavedLanguage from '../Hooks/useSavedLanguage';
import {addColons} from '../../Helpers/AddColonsToId';

const WorkStatusBar = ({tagMode, tag}) => {
  const {state: currentStatus, fetchWorkStatusCall} = useWorkStatusActions();
  const language = useSavedLanguage();
  const {state} = useHomeActions();
  const {Auth} = state;
  const SessionId = Auth.data?.data?.sesssion_id;
  const [workMode, setWorkMode] = useState(null);
  const formattedId = addColons(tag?.id);
  const {deviceId} = useSelector(state => state?.Network);
  const {globalLanguage} = useSelector(state => state?.GlobalLanguage);
  useEffect(() => {
    const updateWorkStatus = async () => {
      try {
        let formdata = new FormData();
        formdata.append('session_id', SessionId);
        formdata.append('device_id', deviceId);
        formdata.append('lang', globalLanguage);
        fetchWorkStatusCall(formdata);
      } catch (error) {
        console.error('Error updating work status', error);
      }
    };
    updateWorkStatus();
  }, [formattedId]);
  useEffect(() => {
    setWorkMode(currentStatus?.currentState?.work_status_to_display);
  }, [currentStatus, formattedId]);

  // useEffect(() => {
  //   switch (tagMode) {
  //     case 'work_start':
  //       setWorkMode('Work in progress');
  //       break;
  //     case 'break_start':
  //       setWorkMode('Break in progress');
  //       break;
  //     case 'work_end':
  //       setWorkMode('Work finished');
  //       break;
  //     default:
  //       setWorkMode('Not Started');
  //   }
  // }, [tagMode]);
  const isConnected = useSelector(state => state?.Network?.isConnected);
  const {sessions} = useSelector(state => state.OfflineData);
  // const getMostRecentTagId = sessionId => {
  //   const sessionData = sessions[sessionId];

  //   // Check if sessionData and items are present
  //   if (sessionData && sessionData.items) {
  //     // Sort the items by time in descending order (latest first)
  //     const sortedItems = [...sessionData.items].sort((a, b) => {
  //       const timeA = new Date(a.time);
  //       const timeB = new Date(b.time);
  //       return timeB - timeA; // Sort in descending order
  //     });

  //     return sortedItems[0]?.tagId;
  //   }

  //   return null; // If session data or items are not available
  // };
  // const mostRecentTagId = getMostRecentTagId(sessionId);

  // function findModeByTagId(tags, tagId) {
  //   const matchingTag = tags.find(tag => tag.key === tagId);
  //   return matchingTag ? matchingTag.mode : null;
  // }

  useEffect(() => {
    const saveTagForOfflineValidation = async () => {
      if (isConnected) {
        try {
          // setWorkMode(currentStatus?.currentState?.work_status_to_display);
          await reduxStorage.setItem(
            'tagForOfflineValidation',
            currentStatus?.currentState?.work_status,
          );
        } catch (error) {
          console.error('Error saving tag for offline validation:', error);
        }
      }
    };
    saveTagForOfflineValidation();
  }, [currentStatus]);

  const getStatusIcon = () => {
    switch (workMode) {
      case 'Work in progress':
        return <Hammer size={30} color="#22c55e" />;
      case 'Break in progress':
        return <Coffee size={30} color="#ef4444" />;
      case 'Work finished':
        return <House size={30} color="#3b82f6" />;
      default:
        return <House size={30} color="#6b7280" />;
    }
  };

  // Memoizing background color to avoid unnecessary recalculations
  const borderColor = useMemo(() => {
    switch (workMode) {
      case 'Work in progress':
        return '#22c55e'; // Green for work mode
      case 'Break in progress':
        return '#ef4444'; // Red for break mode
      case 'Work finished':
        return '#3b82f6'; // Blue for work ended
      default:
        return '#6b7280'; // Gray for default
    }
  }, [workMode]);

  return (
    <View style={[styles.container, {borderColor}]}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>{getStatusIcon()}</View>
        <Text style={styles.statusText}>{workMode}</Text>
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
