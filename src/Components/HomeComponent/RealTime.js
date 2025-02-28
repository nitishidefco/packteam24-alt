import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {reduxStorage} from '../../Redux/Storage';
import reactotron from '../../../ReactotronConfig';
import moment from 'moment-timezone';

const RealTime = () => {
  const [trueTime, setTrueTime] = useState('');
  const [trueDate, setTrueDate] = useState('');
  const getTime = async () => {
    const realTime = await reduxStorage.getItem('trueTime');
    const realDate = await reduxStorage.getItem('trueDate');
    setTrueTime(realTime);
    setTrueDate(realDate);
  };

  getTime();
  reactotron.log(trueTime);
  return (
    <View>
      <Text>The time zone matches your location</Text>
      <Text>
        {trueTime}
        {trueDate}
      </Text>
    </View>
  );
};

export default RealTime;
