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
import {findModeByTagId} from '../../Helpers/FindModeByTagId';
import i18n from '../../i18n/i18n';
import reactotron from '../../../ReactotronConfig';

const WorkStatusBar = ({tagsFromLocalStorage, tag}) => {
  const {state: currentStatus, fetchWorkStatusCall} = useWorkStatusActions();
  const language = useSavedLanguage();
  const {state} = useHomeActions();
  const {Auth} = state;
  const SessionId = Auth.data?.data?.sesssion_id;
  const [workMode, setWorkMode] = useState(null);
  const formattedId = addColons(tag?.id);
  const {deviceId} = useSelector(state => state?.Network);
  const {globalLanguage} = useSelector(state => state?.GlobalLanguage);
  const tagMode = findModeByTagId(tagsFromLocalStorage, tag?.id);
  const sessions = useSelector(state => state?.OfflineData?.sessions);
  const {localWorkHistory} = useSelector(state => state?.LocalWorkHistory);
  const [offlineTagMode, setOfflineTagMode] = useState(null);
  const {state: scanTagState} = useScanTagActions();
  useEffect(() => {
    const updateWorkStatus = async () => {
      try {
        let formdata = new FormData();
        formdata.append('session_id', SessionId);
        formdata.append('device_id', deviceId);
        formdata.append('lang', globalLanguage);
        reactotron.log('Called work status from work status bar');
        fetchWorkStatusCall(formdata);
      } catch (error) {
        console.error('Error updating work status', error);
      }
    };
    updateWorkStatus();
  }, [scanTagState?.currentState]);
  const getMostRecentTagId = sessionId => {
    const sessionData = sessions[sessionId];

    // Check if sessionData and items are present
    if (
      sessionData &&
      sessionData.items &&
      !localWorkHistory[localWorkHistory?.length - 1]?.to?.includes(':')
    ) {
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
  const mostRecentTagId = getMostRecentTagId(SessionId);
  // const offlineTagMode = mostRecentTagId
  //   ? findModeByTagId(tagsFromLocalStorage, mostRecentTagId)
  //   : localWorkHistory?.length > 0
  //   ? 'work_end'
  //   : mostRecentTagId;
  useEffect(() => {
    // First, determine the offline tag mode when not connected
    if (!isConnected) {
      if (
        localWorkHistory.length > 0 &&
        localWorkHistory[localWorkHistory.length - 1]?.to?.includes(':')
      ) {
        console.log('Not connected setting offline mode work end');
        setOfflineTagMode('work_end');
      } else if (
        localWorkHistory.length > 0 &&
        localWorkHistory[localWorkHistory.length - 1]?.mode_raw === 'work'
      ) {
        console.log('Not connected setting offline mode work start');
        setOfflineTagMode('work_start');
      } else if (
        localWorkHistory.length > 0 &&
        localWorkHistory[localWorkHistory.length - 1]?.mode_raw === 'break'
      ) {
        console.log('Not connected setting offline mode work break');
        setOfflineTagMode('break_start');
      }
    }

    // Then, set the work mode based on connection status and current mode
    if (isConnected) {
      setWorkMode(currentStatus?.currentState?.work_status_to_display);
    } else {
      console.log(
        'Local Work History inside workstatus bar====>>>>',
        localWorkHistory,
        offlineTagMode,
      );

      if (localWorkHistory.length > 0) {
        switch (offlineTagMode) {
          case 'work_start':
            console.log('Inside workstart');
            setWorkMode(i18n.t('Toast.WorkinProgress'));
            break;
          case 'break_start':
            setWorkMode(i18n.t('Toast.BreakinProgress'));
            break;
          case 'work_end':
            setWorkMode(i18n.t('Toast.WorkFinished'));
            break;
          default:
            if (
              localWorkHistory[localWorkHistory.length - 1]?.to?.includes(':')
            ) {
              setWorkMode(i18n.t('Toast.WorkFinished'));
            } else {
              setWorkMode(i18n.t('Toast.WorkNotStarted'));
            }
            break;
        }
      } else {
        setWorkMode(i18n.t('Toast.WorkNotStarted'));
      }
    }

    // Finally, update the status icon
    getStatusIcon();
  }, [
    localWorkHistory,
    isConnected,
    currentStatus,
    formattedId,
    offlineTagMode,
    globalLanguage,
    i18n.language,
  ]);

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
            JSON.stringify(currentStatus?.currentState?.work_status),
          );
        } catch (error) {
          console.error('Error saving tag for offline validation:', error);
        }
      }
    };
    saveTagForOfflineValidation();
  }, [currentStatus]);

  const getStatusIcon = () => {
    // console.log('getting status icon');

    if (isConnected) {
      switch (currentStatus?.currentState?.work_status) {
        case 'work_in_progress':
          return <Hammer size={30} color="#22c55e" />;
        case 'break_in_progress':
          return <Coffee size={30} color="#ef4444" />;
        case 'work_finished':
          return <House size={30} color="#3b82f6" />;
        default:
          return <House size={30} color="#6b7280" />;
      }
    } else {
      if (localWorkHistory.length > 0) {
        console.log('inside status icon');
        if (localWorkHistory[localWorkHistory.length - 1].to.includes(':')) {
          console.log('inside work end icon');
          return <House size={30} color="#3b82f6" />;
        } else if (
          localWorkHistory[localWorkHistory.length - 1].mode_raw === 'break'
        ) {
          return <Coffee size={30} color="#ef4444" />;
        } else if (
          localWorkHistory[localWorkHistory.length - 1].mode_raw === 'work'
        ) {
          return <Hammer size={30} color="#22c55e" />;
        }
      } else if (localWorkHistory.length === 0) {
        return <House size={30} color="#6b7280" />;
      }
    }
  };
  // Memoizing background color to avoid unnecessary recalculations
  const borderColor = useMemo(() => {
    if (isConnected) {
      switch (currentStatus?.currentState?.work_status) {
        case 'work_in_progress':
          return '#22c55e'; // Green for work mode
        case 'break_in_progress':
          return '#ef4444'; // Red for break mode
        case 'work_finished':
          return '#3b82f6'; // Blue for work ended
        default:
          return '#6b7280'; // Gray for default
      }
    } else {
      if (localWorkHistory.length > 0) {
        if (localWorkHistory[localWorkHistory.length - 1].to.includes(':')) {
          return '#3b82f6';
        } else if (
          localWorkHistory[localWorkHistory.length - 1].mode_raw === 'break'
        ) {
          return '#ef4444';
        } else if (
          localWorkHistory[localWorkHistory.length - 1].mode_raw === 'work'
        ) {
          return '#22c55e';
        }
      } else if (localWorkHistory.length === 0) {
        return '#6b7280';
      }
    }
  }, [
    workMode,
    currentStatus,
    formattedId,
    isConnected,
    offlineTagMode,
    globalLanguage,
    localWorkHistory,
  ]);

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
