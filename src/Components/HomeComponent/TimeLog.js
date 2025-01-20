import {View, Text} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';

const TimeLog = () => {
  const {sessions} = useSelector(state => state.OfflineData);
console.log(sessions);

  return (
    <View>
      <Text>TimeTable</Text>
    </View>
  );
};

export default TimeLog;
