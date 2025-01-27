import {useDispatch, useSelector} from 'react-redux';

import {getWorkHistory} from '../Reducers/WorkHistorySlice';
export const useWorkHistoryActions = () => {
  const dispatch = useDispatch();
  const workHistoryState = useSelector(state => state?.WorkHistory);

  const getWorkHistoryCall = params => {
    dispatch(getWorkHistory(params));
  };
  return {
    workHistoryState,
    getWorkHistoryCall,
  };
};
