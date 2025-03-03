import {useDispatch, useSelector} from 'react-redux';

import {getRealTime, getWorkHistory} from '../Reducers/WorkHistorySlice';
import reactotron from '../../../ReactotronConfig';
export const useWorkHistoryActions = () => {
  const dispatch = useDispatch();
  const workHistoryState = useSelector(state => state?.WorkHistory);
  const {realTime, realTimeLoading} = useSelector(state => state?.WorkHistory);
  const getWorkHistoryCall = params => {
    dispatch(getWorkHistory(params));
  };

  const getRealTimeCall = params => {
    dispatch(getRealTime(params));
  };
  return {
    workHistoryState,
    getWorkHistoryCall,
    realTime,
    realTimeLoading,
    getRealTimeCall,
  };
};
