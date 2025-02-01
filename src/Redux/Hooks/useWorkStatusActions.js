import {useDispatch, useSelector} from 'react-redux';
import {fetchWorkStatus} from '../Reducers/WorkStateSlice';

export const useWorkStatusActions = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state?.WorkState);

  const fetchWorkStatusCall = params => {
    console.log(
      'fetching updating work status---------------------->>>>>>>>>>>>>>>>>',
    );

    dispatch(fetchWorkStatus(params));
  };

  return {state, fetchWorkStatusCall};
};
