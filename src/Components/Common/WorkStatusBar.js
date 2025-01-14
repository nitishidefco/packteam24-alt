import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import {House, Coffee, Hammer} from 'lucide-react-native';
import {reduxStorage} from '../../Redux/Storage';
import {useWorkStatusActions} from '../../Redux/Hooks/useWorkStatusActions';
import {useSelector} from 'react-redux';

const WorkStatusBar = ({sessionId}) => {
  const {state: currentStatus} = useWorkStatusActions();
  const [workMode, setWorkMode] = useState('');
  const isConnected = useSelector(state => state?.Network?.isConnected);
  const {sessions} = useSelector(state => state.OfflineData);
  const getMostRecentTagId = sessionId => {
    const sessionData = sessions[sessionId];

    // Check if sessionData and items are present
    if (sessionData && sessionData.items) {
      // Sort the items by time in descending order (latest first)
      const sortedItems = [...sessionData.items].sort((a, b) => {
        const timeA = new Date(a.time);
        const timeB = new Date(b.time);
        return timeB - timeA; // Sort in descending order
      });

      return sortedItems[0]?.tagId;
    }

    return null; // If session data or items are not available
  };
  const mostRecentTagId = getMostRecentTagId(sessionId);

  function findModeByTagId(tags, tagId) {
    const matchingTag = tags.find(tag => tag.key === tagId);
    return matchingTag ? matchingTag.mode : null;
  }

  useEffect(() => {
    const saveTagForOfflineValidation = async () => {
      if (isConnected) {
        try {
          console.log(currentStatus?.currentState?.work_status_to_display);
          
          setWorkMode(currentStatus?.currentState?.work_status_to_display);
          await reduxStorage.setItem(
            'tagForOfflineValidation',
            currentStatus?.currentState?.work_status,
          );
        } catch (error) {
          console.error('Error saving tag for offline validation:', error);
        }
      } else {
        console.log('Inside else');

        const tagsFromLocalStorage = await reduxStorage.getItem('nfcTags');
        const parsedTags = JSON.parse(tagsFromLocalStorage);

        const tagMode = findModeByTagId(parsedTags, mostRecentTagId);
        console.log('TagId:', tagMode); // Log the tag mode to confirm it is correct

        switch (tagMode) {
          case 'work_start':
            setWorkMode('Work in progress');
            break;
          case 'break_start':
            setWorkMode('Break in progress'); // Set work mode here
            break;
          case 'work_end':
            setWorkMode('Work finished'); // Set work mode here
            break;
          default:
            setWorkMode('Not Started'); // Set work mode here
            break;
        }
console.log('TagId:', tagMode); // Log the tag mode to confirm it is correct

        await reduxStorage.setItem('tagForOfflineValidation', tagMode); // Store the tag mode
      }
    };
    saveTagForOfflineValidation();
  }, [currentStatus, mostRecentTagId]);

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
